// =============================================================================
// API FATTURE - DOTT. BERNARDO GIAMMETTA
// GET: Lista fatture, POST: Crea nuova fattura
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
import { Decimal } from '@prisma/client/runtime/library';

// =============================================================================
// GET - Lista tutte le fatture
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    // Solo master/admin possono vedere le fatture
    const isMaster = isMasterAccount(session.user.email);
    if (!isMaster && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    // Recupera tutte le fatture con dati paziente
    const fatture = await db.invoice.findMany({
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
        },
        items: true
      },
      orderBy: { invoiceDate: 'desc' }
    });
    
    // Calcola statistiche
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    const stats = {
      totale: fatture.length,
      emesse: fatture.filter(f => f.status === 'EMESSA').length,
      pagate: fatture.filter(f => f.status === 'PAGATA').length,
      // Fatture per periodo
      settimana: {
        count: fatture.filter(f => new Date(f.invoiceDate) >= startOfWeek).length,
        total: fatture
          .filter(f => new Date(f.invoiceDate) >= startOfWeek)
          .reduce((sum, f) => sum + Number(f.total), 0)
      },
      mese: {
        count: fatture.filter(f => new Date(f.invoiceDate) >= startOfMonth).length,
        total: fatture
          .filter(f => new Date(f.invoiceDate) >= startOfMonth)
          .reduce((sum, f) => sum + Number(f.total), 0)
      },
      anno: {
        count: fatture.filter(f => new Date(f.invoiceDate) >= startOfYear).length,
        total: fatture
          .filter(f => new Date(f.invoiceDate) >= startOfYear)
          .reduce((sum, f) => sum + Number(f.total), 0)
      },
      incassato: fatture
        .filter(f => f.status === 'PAGATA')
        .reduce((sum, f) => sum + Number(f.total), 0)
    };
    
    return NextResponse.json({ 
      success: true, 
      fatture: fatture.map(f => ({
        ...f,
        subtotal: Number(f.subtotal),
        contributo: Number(f.contributo),
        bollo: Number(f.bollo),
        total: Number(f.total),
        items: f.items.map(i => ({
          ...i,
          amount: Number(i.amount)
        }))
      })),
      stats 
    });
    
  } catch (error) {
    console.error('Errore GET fatture:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}

// =============================================================================
// POST - Crea nuova fattura
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    // Solo master/admin possono creare fatture
    const isMaster = isMasterAccount(session.user.email);
    if (!isMaster && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 403 });
    }
    
    const body = await request.json();
    const { 
      userId, 
      invoiceDate, 
      invoiceNumber,
      items, // Array di { description, amount }
      paymentMethod = 'MP05',
      status = 'EMESSA'
    } = body;
    
    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dati mancanti: userId e items sono obbligatori' 
      }, { status: 400 });
    }
    
    // Calcola totali
    const subtotal = items.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);
    const contributo = subtotal * 0.04; // ENPAB 4%
    const totaleLordo = subtotal + contributo;
    const bollo = totaleLordo > 77.47 ? 2 : 0;
    const total = totaleLordo + bollo;
    
    // Determina anno e numero progressivo
    const anno = new Date(invoiceDate).getFullYear();
    
    let finalInvoiceNumber = invoiceNumber;
    
    // Se non è specificato, genera numero progressivo
    if (!invoiceNumber) {
      const lastInvoice = await db.invoice.findFirst({
        where: { invoiceYear: anno },
        orderBy: { invoiceNumber: 'desc' }
      });
      
      let progressivo = 1;
      if (lastInvoice) {
        const match = lastInvoice.invoiceNumber.match(/^(\d+)\//);
        if (match) {
          progressivo = parseInt(match[1]) + 1;
        }
      }
      finalInvoiceNumber = `${progressivo}/${anno}`;
    }
    
    // Crea fattura con righe
    const fattura = await db.invoice.create({
      data: {
        userId,
        invoiceNumber: finalInvoiceNumber,
        invoiceYear: anno,
        invoiceDate: new Date(invoiceDate),
        subtotal: new Decimal(subtotal.toFixed(2)),
        contributo: new Decimal(contributo.toFixed(2)),
        bollo: new Decimal(bollo.toFixed(2)),
        total: new Decimal(total.toFixed(2)),
        paymentMethod,
        status,
        items: {
          create: items.map((item: { description: string; amount: number }, index: number) => ({
            description: item.description,
            amount: new Decimal(item.amount.toFixed(2)),
            order: index
          }))
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            codiceFiscale: true,
          }
        },
        items: true
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
        items: fattura.items.map(i => ({
          ...i,
          amount: Number(i.amount)
        }))
      }
    });
    
  } catch (error) {
    console.error('Errore POST fattura:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}
