// =============================================================================
// API FATTURE PAZIENTE - DOTT. BERNARDO GIAMMETTA
// GET: Lista fatture del paziente corrente (solo visualizzazione)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    // Trova l'utente corrente
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utente non trovato' }, { status: 404 });
    }
    
    // Recupera le fatture del paziente
    const fatture = await db.invoice.findMany({
      where: { userId: user.id },
      orderBy: { invoiceDate: 'desc' },
      select: {
        id: true,
        invoiceNumber: true,
        invoiceDate: true,
        subtotal: true,
        contributo: true,
        bollo: true,
        total: true,
        status: true,
        paymentMethod: true,
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      fatture: fatture.map(f => ({
        ...f,
        subtotal: Number(f.subtotal),
        contributo: Number(f.contributo),
        bollo: Number(f.bollo),
        total: Number(f.total),
      }))
    });
    
  } catch (error) {
    console.error('Errore GET fatture paziente:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}
