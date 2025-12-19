// =============================================================================
// API: DISPONIBILITÀ AGENDA - DOTT. BERNARDO GIAMMETTA
// Endpoint per ottenere la disponibilità delle fasce orarie
// GET /api/agenda/availability?date=2024-01-15&days=7
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { parseISO, startOfDay } from 'date-fns';

// Force dynamic rendering per evitare errori di static generation
export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Ottieni disponibilità
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Parametri query
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const daysParam = searchParams.get('days');
    
    // Data di partenza (default: oggi)
    const startDate = dateParam 
      ? startOfDay(parseISO(dateParam))
      : startOfDay(new Date());
    
    // Numero di giorni (default: 7)
    const days = daysParam ? parseInt(daysParam, 10) : 7;
    
    // Usa il database reale - nessun fallback simulato
    const { getWeekAvailability, getDayAvailability } = await import('@/lib/agenda');
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';
    
    let availability;
    if (days === 1) {
      availability = await getDayAvailability(startDate, isAdmin);
    } else {
      availability = await getWeekAvailability(startDate, days, isAdmin);
    }
    
    return NextResponse.json({
      success: true,
      data: availability,
    });
    
  } catch (error) {
    console.error('Errore nel recupero disponibilità:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database non configurato. Contatta l\'amministratore per configurare il database PostgreSQL su AWS RDS.' 
      },
      { status: 500 }
    );
  }
}
