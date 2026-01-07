// =============================================================================
// API BLACKLIST - DOTT. BERNARDO GIAMMETTA
// GET: Lista pazienti in blacklist e recidivi
// POST: Rimuovi paziente dalla blacklist
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// GET - Lista pazienti in blacklist
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Solo admin può vedere la blacklist
    const isMaster = session.user.role === 'ADMIN' || 
      (session.user.email && isMasterAccount(session.user.email));
    
    if (!isMaster) {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 403 }
      );
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Recupera tutti i pazienti con le loro cancellazioni recenti
    const patients = await db.user.findMany({
      where: {
        role: 'PATIENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isWhitelisted: true,
        whitelistedAt: true,
        createdAt: true,
        appointments: {
          where: {
            status: 'CANCELLED',
            cancelledAt: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            id: true,
            startTime: true,
            cancelledAt: true,
          },
          orderBy: {
            cancelledAt: 'desc',
          },
        },
      },
    });

    // Calcola per ogni paziente le cancellazioni di appuntamenti FUTURI
    const patientsWithStats = patients.map(patient => {
      // Filtra solo cancellazioni di appuntamenti che erano FUTURI
      const futureCancellations = patient.appointments.filter(apt => {
        if (!apt.cancelledAt) return false;
        // Considera solo cancellazioni DOPO whitelistedAt (se esiste)
        if (patient.whitelistedAt && apt.cancelledAt < patient.whitelistedAt) {
          return false;
        }
        return apt.startTime > apt.cancelledAt;
      });

      return {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        isWhitelisted: patient.isWhitelisted,
        whitelistedAt: patient.whitelistedAt?.toISOString() || null,
        createdAt: patient.createdAt.toISOString(),
        recentCancellations: futureCancellations.length,
        lastCancellationDate: futureCancellations[0]?.cancelledAt?.toISOString() || null,
        // Per ora blacklistCount è 1 se in blacklist (TODO: implementare storico)
        blacklistCount: futureCancellations.length >= 3 ? 1 : 0,
      };
    });

    // Pazienti in blacklist: 3+ cancellazioni recenti
    const blacklisted = patientsWithStats.filter(p => p.recentCancellations >= 3);
    
    // Pazienti recidivi: hanno avuto problemi in passato (per ora semplificato)
    // TODO: Implementare campo `blacklistHistory` nel database per tracciare storicamente
    // Per ora mostriamo chi ha molte cancellazioni anche se non in blacklist attualmente
    const recidivists = patientsWithStats.filter(p => 
      p.blacklistCount > 0 || (p.recentCancellations >= 2 && p.isWhitelisted)
    );

    return NextResponse.json({
      success: true,
      blacklisted,
      recidivists,
    });

  } catch (error) {
    console.error('Errore recupero blacklist:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero della blacklist' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Rimuovi paziente dalla blacklist
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const isMaster = session.user.role === 'ADMIN' || 
      (session.user.email && isMasterAccount(session.user.email));
    
    if (!isMaster) {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 403 }
      );
    }

    const { userId, action } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID utente mancante' },
        { status: 400 }
      );
    }

    if (action === 'remove') {
      // Rimuovi dalla blacklist: aggiorna whitelistedAt per azzerare contatore
      await db.user.update({
        where: { id: userId },
        data: {
          isWhitelisted: true,
          whitelistedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Paziente rimosso dalla blacklist',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Azione non valida' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Errore gestione blacklist:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nella gestione della blacklist' },
      { status: 500 }
    );
  }
}
