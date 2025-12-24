// =============================================================================
// API: BLOCCHI ORARI - DOTT. BERNARDO GIAMMETTA
// Endpoint per gestire blocchi orari (solo admin/master)
// POST /api/agenda/blocks - Crea blocco
// GET /api/agenda/blocks - Lista blocchi
// DELETE /api/agenda/blocks - Elimina blocco
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
import { z } from 'zod';

// =============================================================================
// SCHEMA VALIDAZIONE
// =============================================================================

const createBlockSchema = z.object({
  type: z.enum(['OCCASIONAL', 'RECURRING']),
  // Per blocchi occasionali
  specificDate: z.string().optional(),
  // Per blocchi ricorrenti
  dayOfWeek: z.number().min(0).max(6).optional(),
  // Comune a entrambi
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  note: z.string().optional(),
});

const deleteBlockSchema = z.object({
  blockId: z.string(),
});

// =============================================================================
// POST - Crea blocco orario
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticazione
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Verifica permessi (solo admin/master)
    const isAdmin = session.user.role === 'ADMIN' || isMasterAccount(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 403 }
      );
    }

    // Parse e valida body
    const body = await request.json();
    const validationResult = createBlockSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dati non validi', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { type, specificDate, dayOfWeek, startTime, endTime, note } = validationResult.data;

    // Validazione specifica per tipo
    if (type === 'OCCASIONAL' && !specificDate) {
      return NextResponse.json(
        { success: false, error: 'Data specifica richiesta per blocchi occasionali' },
        { status: 400 }
      );
    }

    if (type === 'RECURRING' && dayOfWeek === undefined) {
      return NextResponse.json(
        { success: false, error: 'Giorno della settimana richiesto per blocchi ricorrenti' },
        { status: 400 }
      );
    }

    // Verifica che startTime < endTime
    if (startTime >= endTime) {
      return NextResponse.json(
        { success: false, error: 'L\'ora di inizio deve essere prima dell\'ora di fine' },
        { status: 400 }
      );
    }

    // Crea blocco
    const block = await db.timeBlock.create({
      data: {
        type,
        specificDate: specificDate ? new Date(specificDate) : null,
        dayOfWeek: type === 'RECURRING' ? dayOfWeek : null,
        startTime,
        endTime,
        note: note || null,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: block,
      message: type === 'RECURRING' 
        ? 'Blocco ricorrente creato con successo' 
        : 'Blocco occasionale creato con successo',
    });

  } catch (error) {
    console.error('Errore creazione blocco:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nella creazione del blocco' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Lista blocchi orari
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Verifica autenticazione
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Verifica permessi
    const isAdmin = session.user.role === 'ADMIN' || isMasterAccount(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'RECURRING' | 'OCCASIONAL' | null (tutti)
    const activeOnly = searchParams.get('active') !== 'false';

    // Query
    const whereClause: any = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (activeOnly) {
      whereClause.isActive = true;
    }

    const blocks = await db.timeBlock.findMany({
      where: whereClause,
      orderBy: [
        { type: 'asc' },
        { dayOfWeek: 'asc' },
        { specificDate: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: blocks,
    });

  } catch (error) {
    console.error('Errore recupero blocchi:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero dei blocchi' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Elimina/disattiva blocco orario
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    // Verifica autenticazione
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Verifica permessi
    const isAdmin = session.user.role === 'ADMIN' || isMasterAccount(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const validationResult = deleteBlockSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'ID blocco non valido' },
        { status: 400 }
      );
    }

    const { blockId } = validationResult.data;

    // Verifica che il blocco esista
    const block = await db.timeBlock.findUnique({
      where: { id: blockId },
    });

    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Blocco non trovato' },
        { status: 404 }
      );
    }

    // Disattiva il blocco (soft delete)
    await db.timeBlock.update({
      where: { id: blockId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Blocco eliminato con successo',
    });

  } catch (error) {
    console.error('Errore eliminazione blocco:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nell\'eliminazione del blocco' },
      { status: 500 }
    );
  }
}
