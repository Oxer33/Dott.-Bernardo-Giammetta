// =============================================================================
// API GESTIONE BLOCCHI ORARI - DOTT. BERNARDO GIAMMETTA
// CRUD per blocchi orari (indisponibilità) del dottore
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';

export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Lista tutti i blocchi orari
// =============================================================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const timeBlocks = await db.timeBlock.findMany({
      where: { isActive: true },
      orderBy: [
        { type: 'asc' },
        { dayOfWeek: 'asc' },
        { specificDate: 'asc' },
      ],
    });
    
    return NextResponse.json({
      success: true,
      timeBlocks: timeBlocks.map(tb => ({
        ...tb,
        specificDate: tb.specificDate?.toISOString() || null,
        createdAt: tb.createdAt.toISOString(),
      })),
    });
    
  } catch (error) {
    console.error('Errore GET timeblocks:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// POST - Crea nuovo blocco orario
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { type, dayOfWeek, startTime, endTime, specificDate, note } = await request.json();
    
    if (!type || !startTime || !endTime) {
      return NextResponse.json({ success: false, error: 'Dati mancanti' }, { status: 400 });
    }
    
    // Validazione
    if (type === 'RECURRING' && (dayOfWeek === null || dayOfWeek === undefined)) {
      return NextResponse.json({ success: false, error: 'Giorno della settimana richiesto per blocchi ricorrenti' }, { status: 400 });
    }
    
    if (type === 'OCCASIONAL' && !specificDate) {
      return NextResponse.json({ success: false, error: 'Data specifica richiesta per blocchi occasionali' }, { status: 400 });
    }
    
    const timeBlock = await db.timeBlock.create({
      data: {
        type,
        dayOfWeek: type === 'RECURRING' ? dayOfWeek : null,
        startTime,
        endTime,
        specificDate: type === 'OCCASIONAL' ? new Date(specificDate) : null,
        note: note || null,
        isActive: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Blocco orario creato',
      timeBlock,
    });
    
  } catch (error) {
    console.error('Errore POST timeblock:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// PUT - Modifica blocco orario
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { id, type, dayOfWeek, startTime, endTime, specificDate, note } = await request.json();
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID richiesto' }, { status: 400 });
    }
    
    const timeBlock = await db.timeBlock.update({
      where: { id },
      data: {
        type,
        dayOfWeek: type === 'RECURRING' ? dayOfWeek : null,
        startTime,
        endTime,
        specificDate: type === 'OCCASIONAL' && specificDate ? new Date(specificDate) : null,
        note: note || null,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Blocco orario aggiornato',
      timeBlock,
    });
    
  } catch (error) {
    console.error('Errore PUT timeblock:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// DELETE - Elimina blocco orario
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isMasterAccount(session.user.email)) {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID richiesto' }, { status: 400 });
    }
    
    // Soft delete - disattiva invece di eliminare
    await db.timeBlock.update({
      where: { id },
      data: { isActive: false },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Blocco orario eliminato',
    });
    
  } catch (error) {
    console.error('Errore DELETE timeblock:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}
