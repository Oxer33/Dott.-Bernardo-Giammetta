// =============================================================================
// API: STATISTICHE SINGOLO PAZIENTE - DOTT. BERNARDO GIAMMETTA
// Punto 5: Ricerca paziente e statistiche individuali
// GET /api/admin/patient-stats?search=... - Cerca pazienti
// GET /api/admin/patient-stats?id=... - Statistiche singolo paziente
// PUT /api/admin/patient-stats - Aggiorna stato paziente (Ultimato)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
import { differenceInDays } from 'date-fns';

export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Cerca pazienti o ottieni statistiche singolo paziente
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const patientId = searchParams.get('id');
    
    // Se c'è un ID, restituisci statistiche singolo paziente
    if (patientId) {
      const patient = await db.user.findUnique({
        where: { id: patientId },
        include: {
          appointments: {
            orderBy: { startTime: 'asc' },
            select: {
              id: true,
              startTime: true,
              status: true,
              duration: true,
            }
          }
        }
      });
      
      if (!patient) {
        return NextResponse.json({ success: false, error: 'Paziente non trovato' }, { status: 404 });
      }
      
      // Calcola statistiche
      const completedVisits = patient.appointments.filter(a => a.status === 'COMPLETED');
      const cancelledVisits = patient.appointments.filter(a => a.status === 'CANCELLED');
      
      // Calcola cadenza visite (giorni medi tra visite completate)
      let avgDaysBetweenVisits: number | null = null;
      if (completedVisits.length >= 2) {
        const sortedVisits = completedVisits.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        let totalDays = 0;
        for (let i = 1; i < sortedVisits.length; i++) {
          totalDays += differenceInDays(
            new Date(sortedVisits[i].startTime),
            new Date(sortedVisits[i-1].startTime)
          );
        }
        avgDaysBetweenVisits = Math.round(totalDays / (sortedVisits.length - 1));
      }
      
      const patientName = patient.firstName && patient.lastName 
        ? `${patient.firstName} ${patient.lastName}` 
        : patient.name || patient.email;
      
      return NextResponse.json({
        success: true,
        patient: {
          id: patient.id,
          name: patientName,
          email: patient.email,
          totalVisits: patient.appointments.length,
          completedVisits: completedVisits.length,
          cancelledVisits: cancelledVisits.length,
          firstVisit: completedVisits.length > 0 ? completedVisits[0].startTime : null,
          lastVisit: completedVisits.length > 0 ? completedVisits[completedVisits.length - 1].startTime : null,
          avgDaysBetweenVisits,
          // TODO: patientStatus dopo migrazione DB - per ora usa campo raw
          patientStatus: (patient as any).patientStatus || 'ACTIVE',
          isWhitelisted: patient.isWhitelisted,
        }
      });
    }
    
    // Altrimenti, cerca pazienti
    if (search && search.length >= 2) {
      const patients = await db.user.findMany({
        where: {
          role: 'PATIENT',
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ]
        },
        include: {
          _count: {
            select: { appointments: true }
          }
        },
        take: 10,
      });
      
      return NextResponse.json({
        success: true,
        patients: patients.map(p => ({
          id: p.id,
          name: p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.name || p.email,
          email: p.email,
          totalVisits: p._count.appointments,
          // TODO: patientStatus dopo migrazione DB
          patientStatus: (p as any).patientStatus || 'ACTIVE',
          isWhitelisted: p.isWhitelisted,
        }))
      });
    }
    
    return NextResponse.json({ success: true, patients: [] });
    
  } catch (error) {
    console.error('Errore patient-stats GET:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// PUT - Aggiorna stato paziente (Ultimato / Attivo)
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { patientId, status } = await request.json();
    
    if (!patientId || !status) {
      return NextResponse.json({ success: false, error: 'ID paziente e stato richiesti' }, { status: 400 });
    }
    
    // Valida stato (ACTIVE o COMPLETED)
    if (!['ACTIVE', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Stato non valido' }, { status: 400 });
    }
    
    // TODO: patientStatus dopo migrazione DB - per ora usa raw query
    const updated = await db.$executeRaw`UPDATE "User" SET "patientStatus" = ${status} WHERE id = ${patientId}`;
    
    const patient = await db.user.findUnique({
      where: { id: patientId },
      select: { id: true, name: true }
    });
    
    return NextResponse.json({
      success: true,
      message: status === 'COMPLETED' ? 'Paziente segnato come Ultimato' : 'Paziente riattivato',
      patient: { ...patient, patientStatus: status }
    });
    
  } catch (error) {
    console.error('Errore patient-stats PUT:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}
