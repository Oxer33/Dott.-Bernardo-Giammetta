// =============================================================================
// API NATURE SPESA - DOTT. BERNARDO GIAMMETTA
// GET: Lista nature spesa, POST: Crea nuova, DELETE: Elimina
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
import { Decimal } from '@prisma/client/runtime/library';

// =============================================================================
// GET - Lista nature spesa attive
// =============================================================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    // Solo master/admin
    const isMaster = isMasterAccount(session.user.email);
    if (!isMaster && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const expenseTypes = await db.expenseType.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json({ 
      success: true, 
      expenseTypes: expenseTypes.map(e => ({
        ...e,
        defaultAmount: Number(e.defaultAmount)
      }))
    });
    
  } catch (error) {
    console.error('Errore GET expense types:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// POST - Crea nuova natura spesa
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    // Solo master/admin
    const isMaster = isMasterAccount(session.user.email);
    if (!isMaster && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const body = await request.json();
    const { description, defaultAmount } = body;
    
    if (!description || defaultAmount === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: 'Descrizione e importo sono obbligatori' 
      }, { status: 400 });
    }
    
    // Trova l'ordine massimo attuale
    const maxOrder = await db.expenseType.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    
    const expenseType = await db.expenseType.create({
      data: {
        description,
        defaultAmount: new Decimal(defaultAmount.toFixed(2)),
        order: (maxOrder?.order ?? 0) + 1
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      expenseType: {
        ...expenseType,
        defaultAmount: Number(expenseType.defaultAmount)
      }
    });
    
  } catch (error) {
    console.error('Errore POST expense type:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// DELETE - Elimina natura spesa (soft delete)
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    // Solo master/admin
    const isMaster = isMasterAccount(session.user.email);
    if (!isMaster && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID mancante' }, { status: 400 });
    }
    
    // Soft delete: imposta isActive = false
    await db.expenseType.update({
      where: { id },
      data: { isActive: false }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Errore DELETE expense type:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}
