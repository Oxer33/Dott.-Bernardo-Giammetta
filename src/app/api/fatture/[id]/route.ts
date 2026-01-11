// =============================================================================
// API FATTURA SINGOLA - DOTT. BERNARDO GIAMMETTA
// GET: Dettaglio, PUT: Modifica, DELETE: Elimina
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// GET - Dettaglio singola fattura
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    const fattura = await db.invoice.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            codiceFiscale: true,
          }
        }
      }
    });
    
    if (!fattura) {
      return NextResponse.json({ success: false, error: 'Fattura non trovata' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      fattura: {
        ...fattura,
        subtotal: Number(fattura.subtotal),
        contributo: Number(fattura.contributo),
        bollo: Number(fattura.bollo),
        total: Number(fattura.total),
      }
    });
    
  } catch (error) {
    console.error('Errore GET fattura:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// PUT - Modifica fattura (stato e metodo pagamento)
// =============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { status, paymentMethod } = body;
    
    // Verifica che la fattura esista
    const existing = await db.invoice.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Fattura non trovata' }, { status: 404 });
    }
    
    // Aggiorna solo i campi modificabili
    const updateData: Record<string, string> = {};
    if (status) updateData.status = status;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    
    const fattura = await db.invoice.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            codiceFiscale: true,
          }
        }
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      fattura: {
        ...fattura,
        subtotal: Number(fattura.subtotal),
        contributo: Number(fattura.contributo),
        bollo: Number(fattura.bollo),
        total: Number(fattura.total),
      }
    });
    
  } catch (error) {
    console.error('Errore PUT fattura:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// DELETE - Elimina fattura
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Verifica che la fattura esista
    const existing = await db.invoice.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Fattura non trovata' }, { status: 404 });
    }
    
    // Elimina la fattura
    await db.invoice.delete({ where: { id: params.id } });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Errore DELETE fattura:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}
