// =============================================================================
// API: DISPONIBILITÀ AGENDA - DOTT. BERNARDO GIAMMETTA
// Endpoint per ottenere la disponibilità delle fasce orarie
// GET /api/agenda/availability?date=2024-01-15&days=7
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { parseISO, startOfDay, addDays, format, setHours, setMinutes } from 'date-fns';
import { it } from 'date-fns/locale';

// Force dynamic rendering per evitare errori di static generation
export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Ottieni disponibilità
// =============================================================================

// =============================================================================
// GENERA DISPONIBILITÀ STATICA (fallback senza database)
// =============================================================================

function generateStaticAvailability(startDate: Date, days: number) {
  const availability = [];
  
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const dayOfWeek = date.getDay(); // 0 = Dom, 6 = Sab
    
    // Genera slot per questo giorno
    const slots = [];
    
    // Domenica chiuso
    if (dayOfWeek === 0) {
      availability.push({
        date: date.toISOString(),
        dateString: format(date, 'yyyy-MM-dd'),
        dayName: format(date, 'EEEE', { locale: it }),
        slots: [],
      });
      continue;
    }
    
    // Orari: 08:30 - 20:00 (Sabato fino alle 13:00)
    const endHour = dayOfWeek === 6 ? 13 : 20;
    
    for (let hour = 8; hour < endHour; hour++) {
      for (let minute = (hour === 8 ? 30 : 0); minute < 60; minute += 30) {
        if (hour === endHour - 1 && minute >= 30) continue;
        
        const slotTime = setMinutes(setHours(date, hour), minute);
        const timeStr = format(slotTime, 'HH:mm');
        
        // Simula disponibilità (80% disponibile)
        const isAvailable = Math.random() > 0.2;
        
        slots.push({
          time: timeStr,
          datetime: slotTime.toISOString(),
          isAvailable: isAvailable && slotTime > new Date(),
          isBlocked: !isAvailable,
          blockType: !isAvailable ? 'appointment' : undefined,
        });
      }
    }
    
    availability.push({
      date: date.toISOString(),
      dateString: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEEE', { locale: it }),
      slots,
    });
  }
  
  return availability;
}

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
    
    // Prova a usare il database, altrimenti fallback a dati statici
    let availability;
    
    try {
      // Importazione dinamica per evitare errori se Prisma non è configurato
      const { getWeekAvailability, getDayAvailability } = await import('@/lib/agenda');
      const { getServerSession } = await import('next-auth');
      const { authOptions } = await import('@/lib/auth');
      
      const session = await getServerSession(authOptions);
      const isAdmin = session?.user?.role === 'ADMIN';
      
      if (days === 1) {
        availability = await getDayAvailability(startDate, isAdmin);
      } else {
        availability = await getWeekAvailability(startDate, days, isAdmin);
      }
    } catch (dbError) {
      // Fallback a disponibilità statica se database non disponibile
      console.log('Database non disponibile, uso disponibilità statica');
      availability = generateStaticAvailability(startDate, days);
    }
    
    return NextResponse.json({
      success: true,
      data: availability,
    });
    
  } catch (error) {
    console.error('Errore nel recupero disponibilità:', error);
    
    // Ultimo fallback: genera disponibilità statica
    const startDate = startOfDay(new Date());
    const availability = generateStaticAvailability(startDate, 7);
    
    return NextResponse.json({
      success: true,
      data: availability,
    });
  }
}
