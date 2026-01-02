// =============================================================================
// API GESTIONE PAZIENTI - DOTT. BERNARDO GIAMMETTA
// Endpoint per CRUD pazienti (solo admin)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
import { sendWhitelistApprovedEmail } from '@/lib/aws-ses';

export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Lista tutti i pazienti
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifica admin
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // all, whitelisted, pending, pending_with_visits, pending_without_visits
    const search = searchParams.get('search') || '';
    
    // Query base
    let whereClause: any = {
      role: 'PATIENT', // Solo pazienti, non admin
    };
    
    // Filtro whitelist
    if (filter === 'whitelisted') {
      whereClause.isWhitelisted = true;
    } else if (filter === 'pending') {
      whereClause.isWhitelisted = false;
    } else if (filter === 'pending_with_visits') {
      // Punto 10: Pazienti in attesa CON visite prenotate
      whereClause.isWhitelisted = false;
      whereClause.appointments = { some: {} };
    } else if (filter === 'pending_without_visits') {
      // Punto 10: Pazienti in attesa SENZA visite
      whereClause.isWhitelisted = false;
      whereClause.appointments = { none: {} };
    }
    
    // Filtro ricerca
    if (search.length >= 2) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const patients = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        isWhitelisted: true,
        whitelistedAt: true,
        codiceFiscale: true,
        city: true,
        createdAt: true,
        lastVisitAt: true,
        _count: {
          select: { appointments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Statistiche
    const stats = {
      total: await db.user.count({ where: { role: 'PATIENT' } }),
      whitelisted: await db.user.count({ where: { role: 'PATIENT', isWhitelisted: true } }),
      pending: await db.user.count({ where: { role: 'PATIENT', isWhitelisted: false } }),
    };
    
    return NextResponse.json({
      success: true,
      patients,
      stats,
    });
    
  } catch (error) {
    console.error('Errore GET pazienti:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// PUT - Aggiorna paziente (whitelist, dati)
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { patientId, action, data } = await request.json();
    
    if (!patientId) {
      return NextResponse.json({ success: false, error: 'ID paziente richiesto' }, { status: 400 });
    }
    
    // Verifica che il paziente esista
    const patient = await db.user.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ success: false, error: 'Paziente non trovato' }, { status: 404 });
    }
    
    let updateData: any = {};
    
    switch (action) {
      case 'whitelist':
        updateData = {
          isWhitelisted: true,
          whitelistedAt: new Date(),
        };
        break;
        
      case 'unwhitelist':
        updateData = {
          isWhitelisted: false,
          whitelistedAt: null,
        };
        break;
        
      case 'update':
        // Aggiorna dati specifici
        updateData = data || {};
        break;
        
      default:
        return NextResponse.json({ success: false, error: 'Azione non valida' }, { status: 400 });
    }
    
    const updated = await db.user.update({
      where: { id: patientId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isWhitelisted: true,
        whitelistedAt: true,
      },
    });
    
    // Invia email di notifica quando paziente viene approvato
    if (action === 'whitelist' && updated.email) {
      try {
        await sendWhitelistApprovedEmail({
          email: updated.email,
          name: updated.name,
        });
        console.log(`[WHITELIST] Email di approvazione inviata a ${updated.email}`);
      } catch (emailError) {
        // Non blocchiamo l'operazione se l'email fallisce
        console.error('[WHITELIST] Errore invio email:', emailError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: action === 'whitelist' ? 'Paziente approvato! Email di notifica inviata.' : 
               action === 'unwhitelist' ? 'Paziente rimosso dalla whitelist' : 'Paziente aggiornato',
      patient: updated,
    });
    
  } catch (error) {
    console.error('Errore PUT paziente:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// DELETE - Elimina paziente
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('id');
    
    if (!patientId) {
      return NextResponse.json({ success: false, error: 'ID paziente richiesto' }, { status: 400 });
    }
    
    // Verifica che non sia un admin
    const patient = await db.user.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ success: false, error: 'Paziente non trovato' }, { status: 404 });
    }
    
    if (patient.role === 'ADMIN' || isMasterAccount(patient.email)) {
      return NextResponse.json({ success: false, error: 'Non puoi eliminare un admin' }, { status: 403 });
    }
    
    // Elimina prima i record collegati (cascade manuale)
    await db.appointment.deleteMany({ where: { userId: patientId } });
    await db.emailLog.deleteMany({ where: { userId: patientId } });
    await db.account.deleteMany({ where: { userId: patientId } });
    await db.session.deleteMany({ where: { userId: patientId } });
    
    // Elimina il paziente
    await db.user.delete({ where: { id: patientId } });
    
    return NextResponse.json({
      success: true,
      message: 'Paziente eliminato con successo',
    });
    
  } catch (error) {
    console.error('Errore DELETE paziente:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}
