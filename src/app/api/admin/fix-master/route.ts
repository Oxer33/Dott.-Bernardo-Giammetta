// =============================================================================
// API: FIX MASTER ACCOUNT - DOTT. BERNARDO GIAMMETTA
// Endpoint per aggiornare gli account master nel database
// =============================================================================

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isMasterAccount } from '@/lib/config';

export const dynamic = 'force-dynamic';

// =============================================================================
// POST - Aggiorna account corrente a ADMIN se è master
// =============================================================================

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    const email = session.user.email;
    
    // Verifica se è un account master
    if (!isMasterAccount(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Non sei un account master' 
      }, { status: 403 });
    }
    
    // Aggiorna nel database
    const { db } = await import('@/lib/db');
    
    const user = await db.user.upsert({
      where: { email },
      update: {
        role: 'ADMIN',
        isWhitelisted: true,
      },
      create: {
        email,
        name: session.user.name,
        image: session.user.image,
        role: 'ADMIN',
        isWhitelisted: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Account master aggiornato!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isWhitelisted: user.isWhitelisted,
      }
    });
    
  } catch (error) {
    console.error('Errore fix master:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Errore database' 
    }, { status: 500 });
  }
}

// =============================================================================
// GET - Verifica stato account master
// =============================================================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }
    
    const email = session.user.email;
    const isMaster = isMasterAccount(email);
    
    if (!isMaster) {
      return NextResponse.json({ 
        success: true, 
        isMaster: false,
        message: 'Non sei un account master'
      });
    }
    
    // Leggi dal database
    const { db } = await import('@/lib/db');
    
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        isWhitelisted: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      isMaster: true,
      user,
      needsFix: user ? (user.role !== 'ADMIN' || !user.isWhitelisted) : true,
    });
    
  } catch (error) {
    console.error('Errore verifica master:', error);
    return NextResponse.json({ success: false, error: 'Errore' }, { status: 500 });
  }
}
