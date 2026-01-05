// =============================================================================
// API GESTIONE APPUNTAMENTI ADMIN - DOTT. BERNARDO GIAMMETTA
// CRUD completo appuntamenti per dashboard admin
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';

export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Lista appuntamenti con filtri
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // all, today, week, upcoming
    const status = searchParams.get('status') || 'all'; // all, CONFIRMED, CANCELLED, COMPLETED
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Costruisci where clause
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Lunedì
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let whereClause: Record<string, unknown> = {};
    
    // Filtro temporale
    if (filter === 'today') {
      whereClause.startTime = { gte: startOfToday, lt: endOfToday };
    } else if (filter === 'week') {
      whereClause.startTime = { gte: startOfWeek, lt: endOfWeek };
    } else if (filter === 'upcoming') {
      whereClause.startTime = { gte: now };
    }
    
    // Filtro stato
    if (status !== 'all') {
      whereClause.status = status;
    }
    
    // Filtro ricerca
    if (search.length >= 2) {
      whereClause.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    
    const appointments = await db.appointment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
            phone: true,
            codiceFiscale: true,
            city: true,
            address: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
      take: limit,
    });
    
    // Statistiche
    const todayCount = await db.appointment.count({
      where: { startTime: { gte: startOfToday, lt: endOfToday }, status: 'CONFIRMED' },
    });
    
    const weekCount = await db.appointment.count({
      where: { startTime: { gte: startOfWeek, lt: endOfWeek }, status: 'CONFIRMED' },
    });
    
    const totalPatients = await db.user.count({
      where: { role: 'PATIENT', isWhitelisted: true },
    });
    
    // Tasso presenze (completati vs totali ultimo mese)
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const completedLastMonth = await db.appointment.count({
      where: { startTime: { gte: lastMonth }, status: 'COMPLETED' },
    });
    const totalLastMonth = await db.appointment.count({
      where: { startTime: { gte: lastMonth }, status: { in: ['COMPLETED', 'CONFIRMED', 'CANCELLED'] } },
    });
    const attendanceRate = totalLastMonth > 0 
      ? Math.round((completedLastMonth / totalLastMonth) * 100) 
      : 100;
    
    // Attività recenti (ultimi log)
    const recentActivity = await db.emailLog.findMany({
      where: { sentAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
      include: { user: { select: { name: true } } },
      orderBy: { sentAt: 'desc' },
      take: 5,
    });
    
    return NextResponse.json({
      success: true,
      appointments: appointments.map(apt => ({
        ...apt,
        startTime: apt.startTime.toISOString(),
        createdAt: apt.createdAt.toISOString(),
      })),
      stats: {
        todayCount,
        weekCount,
        totalPatients,
        attendanceRate,
      },
      recentActivity: recentActivity.map(a => ({
        action: a.type.replace(/_/g, ' '),
        details: a.user?.name || a.toEmail,
        time: getRelativeTime(a.sentAt),
      })),
    });
    
  } catch (error) {
    console.error('Errore GET appuntamenti:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// POST - Crea nuovo appuntamento (admin può creare per qualsiasi paziente)
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { patientId, patientEmail, startTime, duration, type, notes } = await request.json();
    
    if (!startTime || !duration || !type) {
      return NextResponse.json({ success: false, error: 'Dati mancanti' }, { status: 400 });
    }
    
    // Trova o crea paziente
    let userId = patientId;
    if (!userId && patientEmail) {
      const patient = await db.user.findUnique({ where: { email: patientEmail } });
      if (!patient) {
        return NextResponse.json({ success: false, error: 'Paziente non trovato' }, { status: 404 });
      }
      userId = patient.id;
    }
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'ID o email paziente richiesto' }, { status: 400 });
    }
    
    const start = new Date(startTime);
    
    const appointment = await db.appointment.create({
      data: {
        userId,
        startTime: start,
        duration,
        type,
        status: 'CONFIRMED',
        notes: notes || null,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Appuntamento creato',
      appointment,
    });
    
  } catch (error) {
    console.error('Errore POST appuntamento:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// PUT - Modifica appuntamento (stato, note, orario)
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { appointmentId, action, data } = await request.json();
    
    if (!appointmentId) {
      return NextResponse.json({ success: false, error: 'ID appuntamento richiesto' }, { status: 400 });
    }
    
    let updateData: any = {};
    let message = '';
    
    switch (action) {
      case 'confirm':
        updateData = { status: 'CONFIRMED' };
        message = 'Appuntamento confermato';
        break;
        
      case 'cancel':
        updateData = { status: 'CANCELLED' };
        message = 'Appuntamento cancellato';
        break;
        
      case 'complete':
        updateData = { status: 'COMPLETED' };
        message = 'Visita completata';
        // Aggiorna lastVisitAt del paziente
        const apt = await db.appointment.findUnique({ 
          where: { id: appointmentId },
          include: { user: { select: { isWhitelisted: true } } }
        });
        if (apt) {
          // Punto 8: Se paziente non è in whitelist, lo aggiungiamo dopo prima visita
          const updateUserData: { lastVisitAt: Date; isWhitelisted?: boolean; whitelistedAt?: Date } = { 
            lastVisitAt: new Date() 
          };
          
          if (!apt.user.isWhitelisted) {
            updateUserData.isWhitelisted = true;
            updateUserData.whitelistedAt = new Date();
            message = 'Visita completata - Paziente aggiunto alla whitelist';
          }
          
          await db.user.update({
            where: { id: apt.userId },
            data: updateUserData,
          });
        }
        break;
        
      case 'update_notes':
        updateData = { notes: data?.notes || '' };
        message = 'Note aggiornate';
        break;
        
      case 'reschedule':
        if (!data?.startTime || !data?.duration) {
          return NextResponse.json({ success: false, error: 'Nuova data e durata richiesti' }, { status: 400 });
        }
        
        // Parse data in modo robusto
        let newStart: Date;
        try {
          newStart = new Date(data.startTime);
          if (isNaN(newStart.getTime())) {
            throw new Error('Data non valida');
          }
        } catch (e) {
          console.error('[RESCHEDULE] Errore parsing data:', e);
          return NextResponse.json({ success: false, error: 'Formato data non valido' }, { status: 400 });
        }
        
        const newEnd = new Date(newStart.getTime() + data.duration * 60 * 1000);
        
        // Verifica disponibilità: controlla che non ci siano altri appuntamenti nella fascia oraria
        // Nota: il modello ha solo startTime e duration, quindi calcoliamo manualmente
        const existingAppointments = await db.appointment.findMany({
          where: {
            id: { not: appointmentId },
            status: { in: ['CONFIRMED', 'COMPLETED'] },
            // Prendi appuntamenti nello stesso giorno per evitare query troppo ampie
            startTime: {
              gte: new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate()),
              lt: new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate() + 1),
            },
          },
        });
        
        // Verifica manuale dei conflitti
        const hasConflict = existingAppointments.some(apt => {
          const aptStart = new Date(apt.startTime);
          const aptEnd = new Date(aptStart.getTime() + apt.duration * 60 * 1000);
          // Conflitto se gli intervalli si sovrappongono
          return (newStart < aptEnd && newEnd > aptStart);
        });
        
        if (hasConflict) {
          return NextResponse.json({ 
            success: false, 
            error: 'Fascia oraria non disponibile: esiste già un appuntamento in questo orario' 
          }, { status: 400 });
        }
        
        updateData = {
          startTime: newStart,
          duration: data.duration,
        };
        message = 'Appuntamento riprogrammato';
        break;
        
      default:
        return NextResponse.json({ success: false, error: 'Azione non valida' }, { status: 400 });
    }
    
    const updated = await db.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    
    return NextResponse.json({
      success: true,
      message,
      appointment: updated,
    });
    
  } catch (error) {
    console.error('Errore PUT appuntamento:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// DELETE - Elimina appuntamento
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('id');
    
    if (!appointmentId) {
      return NextResponse.json({ success: false, error: 'ID richiesto' }, { status: 400 });
    }
    
    await db.appointment.delete({ where: { id: appointmentId } });
    
    return NextResponse.json({
      success: true,
      message: 'Appuntamento eliminato',
    });
    
  } catch (error) {
    console.error('Errore DELETE appuntamento:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// HELPER
// =============================================================================

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Adesso';
  if (minutes < 60) return `${minutes} min fa`;
  if (hours < 24) return `${hours} ore fa`;
  return `${days} giorni fa`;
}
