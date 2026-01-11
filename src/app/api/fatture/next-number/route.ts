// =============================================================================
// API PROSSIMO NUMERO FATTURA - DOTT. BERNARDO GIAMMETTA
// GET: Restituisce il prossimo numero fattura disponibile
// =============================================================================

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';

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
    
    const anno = new Date().getFullYear();
    
    // Cerca l'ultima fattura dell'anno corrente
    const lastInvoice = await db.invoice.findFirst({
      where: {
        invoiceNumber: {
          endsWith: `/${anno}`
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    let progressivo = 1;
    
    if (lastInvoice) {
      // Estrai il numero dalla stringa "X/ANNO"
      const match = lastInvoice.invoiceNumber.match(/^(\d+)\//);
      if (match) {
        progressivo = parseInt(match[1]) + 1;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      nextNumber: `${progressivo}/${anno}`,
      progressivo,
      anno
    });
    
  } catch (error) {
    console.error('Errore GET next-number:', error);
    // Fallback
    const anno = new Date().getFullYear();
    return NextResponse.json({ 
      success: true, 
      nextNumber: `1/${anno}`,
      progressivo: 1,
      anno
    });
  }
}
