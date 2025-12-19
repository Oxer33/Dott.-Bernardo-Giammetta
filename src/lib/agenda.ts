// =============================================================================
// AGENDA UTILITIES - DOTT. BERNARDO GIAMMETTA
// Funzioni per gestione agenda, fasce orarie e disponibilità
// =============================================================================

import { db } from '@/lib/db';
import { 
  addDays, 
  addMinutes, 
  format, 
  startOfDay, 
  endOfDay, 
  isBefore, 
  isAfter,
  parseISO,
  setHours,
  setMinutes,
  getDay,
  differenceInHours
} from 'date-fns';
import { it } from 'date-fns/locale';

// =============================================================================
// COSTANTI
// =============================================================================

// Orari di apertura studio (24h format)
export const STUDIO_HOURS = {
  start: 8,  // 08:00
  end: 20,   // 20:00
};

// Durata fasce orarie in minuti
export const SLOT_DURATION = 30;

// Durata visite
export const VISIT_DURATION = {
  FIRST_VISIT: 90,   // Prima visita: 90 minuti (3 slot)
  FOLLOW_UP: 60,     // Controllo: 60 minuti (2 slot)
};

// Preavviso minimo per prenotazioni (ore)
export const MIN_BOOKING_NOTICE_HOURS = 48;

// =============================================================================
// TIPI
// =============================================================================

export interface TimeSlot {
  time: string;          // "HH:MM"
  datetime: Date;        // Data e ora completa
  isAvailable: boolean;  // Disponibile per prenotazione
  isBlocked: boolean;    // Bloccato da impegno
  blockType?: 'recurring' | 'occasional' | 'appointment';
  blockNote?: string;    // Nota visibile solo al dottore
}

export interface DayAvailability {
  date: Date;
  dateString: string;    // "YYYY-MM-DD"
  dayName: string;       // "Lunedì", "Martedì", etc.
  slots: TimeSlot[];
}

// =============================================================================
// GENERA FASCE ORARIE BASE
// Crea tutte le fasce di 30 minuti per un giorno
// =============================================================================

export function generateBaseTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayStart = startOfDay(date);
  
  for (let hour = STUDIO_HOURS.start; hour < STUDIO_HOURS.end; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
      const datetime = setMinutes(setHours(dayStart, hour), minute);
      slots.push({
        time: format(datetime, 'HH:mm'),
        datetime,
        isAvailable: true,
        isBlocked: false,
      });
    }
  }
  
  return slots;
}

// =============================================================================
// OTTIENI DISPONIBILITÀ GIORNALIERA
// Calcola la disponibilità per una specifica data considerando tutti i blocchi
// =============================================================================

export async function getDayAvailability(
  date: Date,
  includeBlockNotes: boolean = false // true solo per admin
): Promise<DayAvailability> {
  const dateString = format(date, 'yyyy-MM-dd');
  const dayOfWeek = getDay(date); // 0 = Dom, 1 = Lun, ...
  
  // Genera slot base
  const slots = generateBaseTimeSlots(date);
  
  // Recupera blocchi ricorrenti per questo giorno della settimana
  const recurringBlocks = await db.timeBlock.findMany({
    where: {
      type: 'RECURRING',
      dayOfWeek: dayOfWeek,
      isActive: true,
    },
  });
  
  // Recupera blocchi occasionali per questa data specifica
  const occasionalBlocks = await db.timeBlock.findMany({
    where: {
      type: 'OCCASIONAL',
      specificDate: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      isActive: true,
    },
  });
  
  // Recupera appuntamenti per questa data
  const appointments = await db.appointment.findMany({
    where: {
      startTime: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      status: {
        in: ['CONFIRMED'],
      },
    },
  });
  
  // Applica blocchi ricorrenti
  for (const block of recurringBlocks) {
    const blockStart = block.startTime;
    const blockEnd = block.endTime;
    
    slots.forEach((slot, index) => {
      if (slot.time >= blockStart && slot.time < blockEnd) {
        slots[index].isAvailable = false;
        slots[index].isBlocked = true;
        slots[index].blockType = 'recurring';
        if (includeBlockNotes && block.note) {
          slots[index].blockNote = block.note;
        }
      }
    });
  }
  
  // Applica blocchi occasionali
  for (const block of occasionalBlocks) {
    const blockStart = block.startTime;
    const blockEnd = block.endTime;
    
    slots.forEach((slot, index) => {
      if (slot.time >= blockStart && slot.time < blockEnd) {
        slots[index].isAvailable = false;
        slots[index].isBlocked = true;
        slots[index].blockType = 'occasional';
        if (includeBlockNotes && block.note) {
          slots[index].blockNote = block.note;
        }
      }
    });
  }
  
  // Applica appuntamenti esistenti
  for (const appointment of appointments) {
    const appointmentStart = format(appointment.startTime, 'HH:mm');
    const appointmentEnd = format(
      addMinutes(appointment.startTime, appointment.duration),
      'HH:mm'
    );
    
    slots.forEach((slot, index) => {
      if (slot.time >= appointmentStart && slot.time < appointmentEnd) {
        slots[index].isAvailable = false;
        slots[index].isBlocked = true;
        slots[index].blockType = 'appointment';
      }
    });
  }
  
  // Blocca slot passati o troppo vicini (meno di 48h)
  const now = new Date();
  const minBookingTime = addDays(now, 2); // 48 ore di preavviso
  
  slots.forEach((slot, index) => {
    if (isBefore(slot.datetime, minBookingTime)) {
      slots[index].isAvailable = false;
    }
  });
  
  return {
    date,
    dateString,
    dayName: format(date, 'EEEE', { locale: it }),
    slots,
  };
}

// =============================================================================
// VERIFICA DISPONIBILITÀ PER PRENOTAZIONE
// Controlla se un utente può prenotare una specifica fascia oraria
// =============================================================================

export async function canUserBook(
  userId: string,
  startTime: Date,
  duration: number
): Promise<{ canBook: boolean; reason?: string }> {
  // 1. Verifica che l'utente sia in whitelist
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isWhitelisted: true, role: true },
  });
  
  if (!user) {
    return { canBook: false, reason: 'Utente non trovato' };
  }
  
  // Admin può sempre prenotare (per conto dei pazienti)
  if (user.role !== 'ADMIN' && !user.isWhitelisted) {
    return { 
      canBook: false, 
      reason: 'Devi essere un paziente registrato per prenotare. Contatta lo studio.' 
    };
  }
  
  // 2. Verifica preavviso minimo (48h)
  const now = new Date();
  const hoursUntilAppointment = differenceInHours(startTime, now);
  
  if (hoursUntilAppointment < MIN_BOOKING_NOTICE_HOURS) {
    return { 
      canBook: false, 
      reason: `Devi prenotare con almeno ${MIN_BOOKING_NOTICE_HOURS} ore di anticipo` 
    };
  }
  
  // 3. Verifica che l'utente non abbia già un appuntamento attivo
  const existingAppointment = await db.appointment.findFirst({
    where: {
      userId,
      status: 'CONFIRMED',
      startTime: {
        gte: now,
      },
    },
  });
  
  if (existingAppointment && user.role !== 'ADMIN') {
    return { 
      canBook: false, 
      reason: 'Hai già un appuntamento prenotato. Puoi avere solo una prenotazione attiva alla volta.' 
    };
  }
  
  // 4. Verifica disponibilità dello slot
  const dayAvailability = await getDayAvailability(startTime);
  const startTimeStr = format(startTime, 'HH:mm');
  const endTime = addMinutes(startTime, duration);
  const endTimeStr = format(endTime, 'HH:mm');
  
  // Controlla che tutti gli slot necessari siano disponibili
  const requiredSlots = dayAvailability.slots.filter(
    slot => slot.time >= startTimeStr && slot.time < endTimeStr
  );
  
  const allSlotsAvailable = requiredSlots.every(slot => slot.isAvailable);
  
  if (!allSlotsAvailable) {
    return { 
      canBook: false, 
      reason: 'Questa fascia oraria non è più disponibile' 
    };
  }
  
  return { canBook: true };
}

// =============================================================================
// CREA APPUNTAMENTO
// =============================================================================

export async function createAppointment(
  userId: string,
  startTime: Date,
  type: 'FIRST_VISIT' | 'FOLLOW_UP',
  notes?: string
) {
  const duration = type === 'FIRST_VISIT' 
    ? VISIT_DURATION.FIRST_VISIT 
    : VISIT_DURATION.FOLLOW_UP;
  
  // Verifica ancora una volta la disponibilità
  const canBook = await canUserBook(userId, startTime, duration);
  
  if (!canBook.canBook) {
    throw new Error(canBook.reason);
  }
  
  // Crea l'appuntamento
  const appointment = await db.appointment.create({
    data: {
      userId,
      startTime,
      duration,
      type,
      notes,
      status: 'CONFIRMED',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  
  return appointment;
}

// =============================================================================
// CANCELLA APPUNTAMENTO
// =============================================================================

export async function cancelAppointment(
  appointmentId: string,
  userId: string
) {
  // Verifica che l'appuntamento esista e appartenga all'utente (o sia admin)
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      user: {
        select: { id: true, role: true },
      },
    },
  });
  
  if (!appointment) {
    throw new Error('Appuntamento non trovato');
  }
  
  // Verifica permessi
  const requestingUser = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  if (appointment.userId !== userId && requestingUser?.role !== 'ADMIN') {
    throw new Error('Non hai i permessi per cancellare questo appuntamento');
  }
  
  // Cancella l'appuntamento
  const cancelled = await db.appointment.update({
    where: { id: appointmentId },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  });
  
  return cancelled;
}

// =============================================================================
// GESTIONE BLOCCHI ORARI (solo admin)
// =============================================================================

// Crea blocco ricorrente (es. ogni mercoledì 9-11)
export async function createRecurringBlock(
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  note?: string
) {
  return db.timeBlock.create({
    data: {
      type: 'RECURRING',
      dayOfWeek,
      startTime,
      endTime,
      note,
      isActive: true,
    },
  });
}

// Crea blocco occasionale (una specifica data)
export async function createOccasionalBlock(
  specificDate: Date,
  startTime: string,
  endTime: string,
  note?: string
) {
  return db.timeBlock.create({
    data: {
      type: 'OCCASIONAL',
      specificDate,
      startTime,
      endTime,
      note,
      isActive: true,
    },
  });
}

// Rimuovi/disattiva blocco
export async function removeTimeBlock(blockId: string) {
  return db.timeBlock.update({
    where: { id: blockId },
    data: { isActive: false },
  });
}

// =============================================================================
// OTTIENI SETTIMANA DISPONIBILITÀ
// Ritorna la disponibilità per i prossimi 7 giorni (o range specificato)
// =============================================================================

export async function getWeekAvailability(
  startDate: Date,
  days: number = 7,
  includeBlockNotes: boolean = false
): Promise<DayAvailability[]> {
  const availability: DayAvailability[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const dayAvailability = await getDayAvailability(date, includeBlockNotes);
    availability.push(dayAvailability);
  }
  
  return availability;
}

// =============================================================================
// FORMATTA APPUNTAMENTO PER DISPLAY
// =============================================================================

export function formatAppointmentForDisplay(appointment: {
  startTime: Date;
  duration: number;
  type: string;
}) {
  const endTime = addMinutes(appointment.startTime, appointment.duration);
  
  return {
    date: format(appointment.startTime, 'EEEE d MMMM yyyy', { locale: it }),
    startTime: format(appointment.startTime, 'HH:mm'),
    endTime: format(endTime, 'HH:mm'),
    type: appointment.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Visita di Controllo',
    duration: `${appointment.duration} minuti`,
  };
}
