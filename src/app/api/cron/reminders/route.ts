// =============================================================================
// CRON JOB: EMAIL REMINDERS - DOTT. BERNARDO GIAMMETTA
// Endpoint da chiamare giornalmente per inviare reminders automatici
// Può essere configurato con Vercel Cron, AWS EventBridge, o servizio esterno
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendReminder, sendFollowupReminder, sendQuestionnaireReminder } from '@/lib/email';
import { addDays, subDays, startOfDay, endOfDay } from 'date-fns';

// Chiave segreta per autorizzare chiamate cron
const CRON_SECRET = process.env.CRON_SECRET;

// =============================================================================
// POST - Elabora tutti i reminders
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verifica autorizzazione
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    const now = new Date();
    const results = {
      reminders1Week: 0,
      reminders1Day: 0,
      questionnaireReminders: 0, // Nuovo: reminder questionario 2 giorni prima
      followup25Days: 0,
      urgent60Days: 0,
      errors: [] as string[],
    };
    
    // ==========================================================================
    // 1. REMINDER 1 SETTIMANA PRIMA
    // ==========================================================================
    const oneWeekFromNow = addDays(now, 7);
    const appointmentsIn1Week = await db.appointment.findMany({
      where: {
        startTime: {
          gte: startOfDay(oneWeekFromNow),
          lte: endOfDay(oneWeekFromNow),
        },
        status: 'CONFIRMED',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    for (const appointment of appointmentsIn1Week) {
      try {
        const sent = await sendReminder(appointment, 'REMINDER_1_WEEK');
        if (sent) results.reminders1Week++;
      } catch (error) {
        results.errors.push(`Errore reminder 1w per ${appointment.id}`);
      }
    }
    
    // ==========================================================================
    // 2. REMINDER 1 GIORNO PRIMA
    // ==========================================================================
    const tomorrow = addDays(now, 1);
    const appointmentsTomorrow = await db.appointment.findMany({
      where: {
        startTime: {
          gte: startOfDay(tomorrow),
          lte: endOfDay(tomorrow),
        },
        status: 'CONFIRMED',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    for (const appointment of appointmentsTomorrow) {
      try {
        const sent = await sendReminder(appointment, 'REMINDER_1_DAY');
        if (sent) results.reminders1Day++;
      } catch (error) {
        results.errors.push(`Errore reminder 1d per ${appointment.id}`);
      }
    }
    
    // ==========================================================================
    // 2.5 REMINDER QUESTIONARIO 2 GIORNI PRIMA
    // Invia reminder solo a pazienti che:
    // - Hanno appuntamento tra 2 giorni
    // - NON hanno compilato questionario
    // - NON hanno già ricevuto questo reminder
    // ==========================================================================
    const twoDaysFromNow = addDays(now, 2);
    const appointmentsIn2Days = await db.appointment.findMany({
      where: {
        startTime: {
          gte: startOfDay(twoDaysFromNow),
          lte: endOfDay(twoDaysFromNow),
        },
        status: 'CONFIRMED',
      },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            questionnaires: {
              select: { id: true },
              take: 1, // Basta sapere se ne ha almeno uno
            },
          },
        },
      },
    });
    
    for (const appointment of appointmentsIn2Days) {
      // Salta se ha già un questionario compilato
      if (appointment.user.questionnaires && appointment.user.questionnaires.length > 0) {
        continue;
      }
      
      // Verifica se abbiamo già inviato questo reminder
      const alreadySent = await db.emailLog.findFirst({
        where: {
          userId: appointment.user.id,
          appointmentId: appointment.id,
          type: 'QUESTIONNAIRE_REMINDER',
        },
      });
      
      if (alreadySent) continue;
      
      try {
        // Invia email reminder questionario
        const sent = await sendQuestionnaireReminder(appointment);
        if (sent) {
          results.questionnaireReminders++;
          // Logga l'invio
          await db.emailLog.create({
            data: {
              userId: appointment.user.id,
              toEmail: appointment.user.email || '',
              type: 'QUESTIONNAIRE_REMINDER',
              templateId: 1,
              appointmentId: appointment.id,
              subject: 'Compila il questionario prima della visita',
              status: 'SENT',
            },
          });
        }
      } catch (error) {
        results.errors.push(`Errore reminder questionario per ${appointment.id}`);
      }
    }
    
    // ==========================================================================
    // 3. FOLLOWUP 25 GIORNI
    // Utenti la cui ultima visita è stata ~25 giorni fa e non hanno prenotazioni
    // ==========================================================================
    const twentyFiveDaysAgo = subDays(now, 25);
    const usersNeedingFollowup = await db.user.findMany({
      where: {
        isWhitelisted: true,
        lastVisitAt: {
          gte: subDays(twentyFiveDaysAgo, 2), // 23-27 giorni fa
          lte: addDays(twentyFiveDaysAgo, 2),
        },
        // Non ha appuntamenti futuri
        appointments: {
          none: {
            startTime: { gte: now },
            status: 'CONFIRMED',
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastVisitAt: true,
      },
    });
    
    for (const user of usersNeedingFollowup) {
      try {
        const sent = await sendFollowupReminder(user, 'FOLLOWUP_25_DAYS');
        if (sent) results.followup25Days++;
      } catch (error) {
        results.errors.push(`Errore followup 25d per ${user.id}`);
      }
    }
    
    // ==========================================================================
    // 4. URGENTE 60 GIORNI
    // Utenti la cui ultima visita è stata >= 60 giorni fa
    // ==========================================================================
    const sixtyDaysAgo = subDays(now, 60);
    const usersNeedingUrgent = await db.user.findMany({
      where: {
        isWhitelisted: true,
        lastVisitAt: {
          lte: sixtyDaysAgo,
        },
        // Non ha appuntamenti futuri
        appointments: {
          none: {
            startTime: { gte: now },
            status: 'CONFIRMED',
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastVisitAt: true,
      },
    });
    
    for (const user of usersNeedingUrgent) {
      try {
        const sent = await sendFollowupReminder(user, 'URGENT_60_DAYS');
        if (sent) results.urgent60Days++;
      } catch (error) {
        results.errors.push(`Errore urgent 60d per ${user.id}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    });
    
  } catch (error) {
    console.error('Errore cron reminders:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel processare i reminders' },
      { status: 500 }
    );
  }
}

// GET per test/verifica
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint cron reminders attivo',
    description: 'Chiama POST con authorization header per eseguire',
  });
}
