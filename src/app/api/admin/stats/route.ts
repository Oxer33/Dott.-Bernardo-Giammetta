// =============================================================================
// API: STATISTICHE ADMIN - DOTT. BERNARDO GIAMMETTA
// Endpoint per statistiche complete con dati reali dal database
// GET /api/admin/stats
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subWeeks,
  subMonths,
  format,
  getDay,
  getHours
} from 'date-fns';
import { it } from 'date-fns/locale';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Ottieni statistiche complete
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Verifica autenticazione admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 403 }
      );
    }

    const now = new Date();
    
    // Date ranges
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    
    // Settimana precedente per confronto
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    
    // Mese precedente per confronto
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // =========================================================================
    // CONTEGGI VISITE COMPLETATE (controlli effettuati)
    // =========================================================================
    
    // Settimanale
    const weeklyCompleted = await db.appointment.count({
      where: {
        status: 'COMPLETED',
        startTime: { gte: weekStart, lte: weekEnd }
      }
    });
    
    // Settimanale precedente (per trend)
    const lastWeekCompleted = await db.appointment.count({
      where: {
        status: 'COMPLETED',
        startTime: { gte: lastWeekStart, lte: lastWeekEnd }
      }
    });
    
    // Mensile
    const monthlyCompleted = await db.appointment.count({
      where: {
        status: 'COMPLETED',
        startTime: { gte: monthStart, lte: monthEnd }
      }
    });
    
    // Mese precedente (per trend)
    const lastMonthCompleted = await db.appointment.count({
      where: {
        status: 'COMPLETED',
        startTime: { gte: lastMonthStart, lte: lastMonthEnd }
      }
    });
    
    // Annuale
    const yearlyCompleted = await db.appointment.count({
      where: {
        status: 'COMPLETED',
        startTime: { gte: yearStart, lte: yearEnd }
      }
    });

    // =========================================================================
    // CONTEGGI VISITE CANCELLATE
    // =========================================================================
    
    const weeklyCancelled = await db.appointment.count({
      where: {
        status: 'CANCELLED',
        startTime: { gte: weekStart, lte: weekEnd }
      }
    });
    
    const monthlyCancelled = await db.appointment.count({
      where: {
        status: 'CANCELLED',
        startTime: { gte: monthStart, lte: monthEnd }
      }
    });
    
    const yearlyCancelled = await db.appointment.count({
      where: {
        status: 'CANCELLED',
        startTime: { gte: yearStart, lte: yearEnd }
      }
    });

    // =========================================================================
    // ANALISI FASCE ORARIE PIÙ FREQUENTATE
    // =========================================================================
    
    const allAppointments = await db.appointment.findMany({
      where: {
        status: { in: ['COMPLETED', 'CONFIRMED'] },
        startTime: { gte: yearStart }
      },
      select: { startTime: true }
    });
    
    // Conta per fascia oraria (08:30-20:00)
    const hourlyDistribution: { [key: string]: number } = {};
    for (let h = 8; h < 20; h++) {
      const key = `${h.toString().padStart(2, '0')}:00`;
      hourlyDistribution[key] = 0;
    }
    
    allAppointments.forEach(apt => {
      const hour = getHours(new Date(apt.startTime));
      const key = `${hour.toString().padStart(2, '0')}:00`;
      if (hourlyDistribution[key] !== undefined) {
        hourlyDistribution[key]++;
      }
    });
    
    // Trova fascia oraria più frequentata
    const peakHour = Object.entries(hourlyDistribution)
      .sort((a, b) => b[1] - a[1])[0];

    // =========================================================================
    // ANALISI GIORNI DELLA SETTIMANA
    // =========================================================================
    
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const dailyDistribution: { [key: string]: number } = {};
    dayNames.forEach(day => { dailyDistribution[day] = 0; });
    
    allAppointments.forEach(apt => {
      const dayIndex = getDay(new Date(apt.startTime));
      dailyDistribution[dayNames[dayIndex]]++;
    });
    
    // Trova giorno più frequentato (escludi domenica)
    const peakDay = Object.entries(dailyDistribution)
      .filter(([day]) => day !== 'Domenica')
      .sort((a, b) => b[1] - a[1])[0];

    // =========================================================================
    // ANALISI MESI
    // =========================================================================
    
    const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const monthlyDistribution: { [key: string]: number } = {};
    monthNames.forEach(month => { monthlyDistribution[month] = 0; });
    
    allAppointments.forEach(apt => {
      const monthIndex = new Date(apt.startTime).getMonth();
      monthlyDistribution[monthNames[monthIndex]]++;
    });
    
    // Trova mese più frequentato
    const peakMonth = Object.entries(monthlyDistribution)
      .sort((a, b) => b[1] - a[1])[0];

    // =========================================================================
    // STATISTICHE PAZIENTI
    // =========================================================================
    
    const totalPatients = await db.user.count({
      where: { role: 'PATIENT' }
    });
    
    const whitelistedPatients = await db.user.count({
      where: { role: 'PATIENT', isWhitelisted: true }
    });
    
    const pendingPatients = await db.user.count({
      where: { role: 'PATIENT', isWhitelisted: false }
    });
    
    // Nuovi pazienti questo mese
    const newPatientsThisMonth = await db.user.count({
      where: {
        role: 'PATIENT',
        createdAt: { gte: monthStart }
      }
    });
    
    // Punto 4: Statistiche maschi/femmine
    const malePatients = await db.user.count({
      where: { role: 'PATIENT', gender: 'M' }
    });
    
    const femalePatients = await db.user.count({
      where: { role: 'PATIENT', gender: 'F' }
    });
    
    const malePercentage = totalPatients > 0 ? Math.round((malePatients / totalPatients) * 100) : 0;
    const femalePercentage = totalPatients > 0 ? Math.round((femalePatients / totalPatients) * 100) : 0;

    // =========================================================================
    // TASSO DI COMPLETAMENTO
    // =========================================================================
    
    const totalScheduled = await db.appointment.count({
      where: {
        startTime: { gte: yearStart, lte: now }
      }
    });
    
    const completionRate = totalScheduled > 0 
      ? Math.round((yearlyCompleted / totalScheduled) * 100) 
      : 0;

    // =========================================================================
    // TREND MENSILE (ultimi 6 mesi)
    // =========================================================================
    
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const mStart = startOfMonth(monthDate);
      const mEnd = endOfMonth(monthDate);
      
      const completed = await db.appointment.count({
        where: {
          status: 'COMPLETED',
          startTime: { gte: mStart, lte: mEnd }
        }
      });
      
      const cancelled = await db.appointment.count({
        where: {
          status: 'CANCELLED',
          startTime: { gte: mStart, lte: mEnd }
        }
      });
      
      monthlyTrend.push({
        month: format(monthDate, 'MMM', { locale: it }),
        completed,
        cancelled
      });
    }

    // =========================================================================
    // RISPOSTA
    // =========================================================================
    
    return NextResponse.json({
      success: true,
      data: {
        // Visite completate
        completed: {
          weekly: weeklyCompleted,
          weeklyTrend: lastWeekCompleted > 0 
            ? Math.round(((weeklyCompleted - lastWeekCompleted) / lastWeekCompleted) * 100)
            : 0,
          monthly: monthlyCompleted,
          monthlyTrend: lastMonthCompleted > 0
            ? Math.round(((monthlyCompleted - lastMonthCompleted) / lastMonthCompleted) * 100)
            : 0,
          yearly: yearlyCompleted
        },
        // Visite cancellate
        cancelled: {
          weekly: weeklyCancelled,
          monthly: monthlyCancelled,
          yearly: yearlyCancelled
        },
        // Picchi
        peaks: {
          hour: peakHour ? { time: peakHour[0], count: peakHour[1] } : null,
          day: peakDay ? { name: peakDay[0], count: peakDay[1] } : null,
          month: peakMonth ? { name: peakMonth[0], count: peakMonth[1] } : null
        },
        // Distribuzioni per grafici
        distributions: {
          hourly: hourlyDistribution,
          daily: dailyDistribution,
          monthly: monthlyDistribution
        },
        // Pazienti
        patients: {
          total: totalPatients,
          whitelisted: whitelistedPatients,
          pending: pendingPatients,
          newThisMonth: newPatientsThisMonth,
          // Punto 4: maschi/femmine
          male: malePatients,
          female: femalePatients,
          malePercentage,
          femalePercentage
        },
        // Tassi
        rates: {
          completion: completionRate
        },
        // Trend mensile
        monthlyTrend
      }
    });

  } catch (error) {
    console.error('Errore statistiche:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero statistiche' },
      { status: 500 }
    );
  }
}
