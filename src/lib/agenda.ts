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
import { isItalianHoliday, HolidayInfo } from '@/lib/italian-holidays';

// =============================================================================
// COSTANTI
// =============================================================================

// Orari di apertura studio (24h format)
export const STUDIO_HOURS = {
  startHour: 8,     // Ora inizio
  startMinute: 30,  // Minuto inizio (08:30)
  end: 20,          // 20:00
};

// Importa funzione verifica master da config (usa lista completa account master)
import { isMasterAccount } from '@/lib/config';

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
  // Info paziente (solo per admin quando blockType='appointment')
  patientName?: string;
  patientSurname?: string;
  // Durata appuntamento per colori differenziati (60=lilla, 90=viola scuro)
  appointmentDuration?: number;
  // ID appuntamento per permettere eliminazione dall'agenda (solo admin)
  appointmentId?: string;
}

export interface DayAvailability {
  date: Date;
  dateString: string;    // "YYYY-MM-DD"
  dayName: string;       // "Lunedì", "Martedì", etc.
  slots: TimeSlot[];
  isHoliday: boolean;    // Se è festa/domenica
  holidayName?: string;  // Nome della festa
}

// =============================================================================
// GENERA FASCE ORARIE BASE
// Crea tutte le fasce di 30 minuti per un giorno
// =============================================================================

export function generateBaseTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayStart = startOfDay(date);
  
  // Inizia da 08:30
  let isFirstSlot = true;
  
  for (let hour = STUDIO_HOURS.startHour; hour < STUDIO_HOURS.end; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
      // Salta 08:00 - inizia da 08:30
      if (hour === STUDIO_HOURS.startHour && minute < STUDIO_HOURS.startMinute) {
        continue;
      }
      
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
  
  // Verifica se è una festa italiana o domenica
  const holidayInfo: HolidayInfo = isItalianHoliday(date);
  
  // Se è festa, ritorna giorno vuoto (non prenotabile)
  if (holidayInfo.isHoliday) {
    return {
      date,
      dateString,
      dayName: format(date, 'EEEE', { locale: it }),
      slots: [], // Nessuno slot disponibile
      isHoliday: true,
      holidayName: holidayInfo.name,
    };
  }
  
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
  
  // Recupera appuntamenti per questa data (con dati paziente per admin)
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
    include: includeBlockNotes ? {
      user: {
        select: {
          name: true,
          firstName: true,
          lastName: true,
        }
      }
    } : undefined,
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
    
    // Estrai nome paziente se disponibile (solo per admin)
    const user = (appointment as any).user;
    const patientName = user?.firstName || user?.name?.split(' ')[0] || '';
    const patientSurname = user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '';
    
    slots.forEach((slot, index) => {
      if (slot.time >= appointmentStart && slot.time < appointmentEnd) {
        slots[index].isAvailable = false;
        slots[index].isBlocked = true;
        slots[index].blockType = 'appointment';
        // Aggiungi durata per colori differenziati (90min viola, 60min lilla)
        slots[index].appointmentDuration = appointment.duration;
        // Aggiungi info paziente e ID appuntamento solo per admin
        if (includeBlockNotes) {
          if (patientName || patientSurname) {
            slots[index].patientName = patientName;
            slots[index].patientSurname = patientSurname;
          }
          // ID appuntamento per permettere eliminazione dall'agenda
          slots[index].appointmentId = appointment.id;
        }
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
    isHoliday: false,
  };
}

// =============================================================================
// VERIFICA DISPONIBILITÀ PER PRENOTAZIONE
// Controlla se un utente può prenotare una specifica fascia oraria
// =============================================================================

export async function canUserBook(
  userId: string,
  startTime: Date,
  duration: number,
  callerEmail?: string // Email di chi sta effettuando la prenotazione (master/admin)
): Promise<{ canBook: boolean; reason?: string; gapWarning?: string; warning?: string }> {
  // 1. Verifica che l'utente target esista
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isWhitelisted: true, role: true, email: true },
  });
  
  if (!user) {
    return { canBook: false, reason: 'Utente non trovato' };
  }
  
  // Verifica se chi chiama è l'account master (callerEmail) o se l'utente target è master
  // CRITICO: Usa lista completa account master da config.ts
  // NOTA: 'MASTER_OVERRIDE' è un flag esplicito passato dall'API quando il ruolo è ADMIN
  const isMasterCalling = callerEmail === 'MASTER_OVERRIDE' || isMasterAccount(callerEmail);
  const isUserMaster = isMasterAccount(user.email);
  const isMaster = isMasterCalling || isUserMaster;
  
  console.log('[canUserBook] callerEmail:', callerEmail, 'isMasterCalling:', isMasterCalling, 'isMaster:', isMaster);
  
  // Prepara warning per paziente non in whitelist (solo se master prenota per lui)
  let patientWarning: string | undefined;
  
  // Admin/Master può sempre prenotare per qualsiasi paziente
  // Se il paziente non è in whitelist, mostra solo un avviso
  if (user.role !== 'ADMIN' && !isMaster && !user.isWhitelisted) {
    if (isMasterCalling) {
      // Master può prenotare ma viene avvisato
      patientWarning = 'Attenzione: questo paziente non è ancora stato approvato nella whitelist.';
    } else {
      return { 
        canBook: false, 
        reason: 'Devi essere un paziente registrato per prenotare. Contatta lo studio.' 
      };
    }
  }
  
  // 2. Verifica preavviso minimo (48h) - Master esente (può anche prenotare nel passato)
  const now = new Date();
  const hoursUntilAppointment = differenceInHours(startTime, now);
  
  // Master può prenotare anche su date passate (punto 8)
  if (!isMaster && hoursUntilAppointment < MIN_BOOKING_NOTICE_HOURS) {
    return { 
      canBook: false, 
      reason: `Devi prenotare con almeno ${MIN_BOOKING_NOTICE_HOURS} ore di anticipo` 
    };
  }
  
  // 3. Verifica che l'utente non abbia già un appuntamento attivo - Master esente
  if (!isMaster) {
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
  }
  
  // 4. Verifica disponibilità dello slot - MASTER ESENTE (può forzare qualsiasi slot)
  // Il master ha libertà totale: date passate, prossime 48h, slot occupati
  if (isMaster) {
    // Master può prenotare OVUNQUE - restituisci subito OK con eventuale warning
    return { canBook: true, warning: patientWarning };
  }
  
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
  
  // 5. LOGICA ANTI-BUCHI: avviso gentile (non vincolo) - Master esente
  // Verifica se la prenotazione crea buchi di 30 minuti
  // Restituisce un warning ma permette comunque la prenotazione
  let gapWarning: string | undefined;
  if (!isMaster) {
    const antiGapCheck = await checkNoGapPolicy(startTime, duration, dayAvailability);
    if (!antiGapCheck.allowed) {
      // Solo un avviso, non blocchiamo più la prenotazione
      gapWarning = antiGapCheck.reason;
    }
  }
  
  return { canBook: true, gapWarning, warning: patientWarning };
}

// =============================================================================
// LOGICA ANTI-BUCHI
// Evita che gli utenti lascino buchi di 30 minuti nell'agenda
// =============================================================================

async function checkNoGapPolicy(
  startTime: Date,
  duration: number,
  dayAvailability: DayAvailability
): Promise<{ allowed: boolean; reason?: string }> {
  const startTimeStr = format(startTime, 'HH:mm');
  const endTime = addMinutes(startTime, duration);
  const endTimeStr = format(endTime, 'HH:mm');
  
  // Trova tutti gli slot occupati (appuntamenti) nel giorno
  const occupiedSlots = dayAvailability.slots.filter(
    slot => !slot.isAvailable && slot.blockType === 'appointment'
  );
  
  // Se non ci sono appuntamenti, qualsiasi orario va bene
  if (occupiedSlots.length === 0) {
    return { allowed: true };
  }
  
  // Trova il primo e ultimo slot occupato
  const occupiedTimes = occupiedSlots.map(s => s.time).sort();
  
  // Cerca appuntamenti adiacenti
  for (const occupiedTime of occupiedTimes) {
    // Se c'è un appuntamento che finisce 30 min prima del nostro inizio = buco!
    // Esempio: appuntamento finisce 14:30, utente vuole 15:00 = buco di 30 min
    const thirtyMinAfterOccupied = format(addMinutes(parseTimeToDate(occupiedTime, startTime), SLOT_DURATION), 'HH:mm');
    
    if (thirtyMinAfterOccupied === startTimeStr) {
      // C'è un buco di 30 minuti! L'utente dovrebbe prenotare alle occupiedTime
      // o 1 ora dopo
      return {
        allowed: false,
        reason: `Per ottimizzare l'agenda, prenota alle ${occupiedTime} (subito dopo l'appuntamento precedente) oppure alle ${format(addMinutes(parseTimeToDate(startTimeStr, startTime), SLOT_DURATION), 'HH:mm')}`
      };
    }
  }
  
  // Verifica anche se la fine della prenotazione crea un buco
  for (const occupiedTime of occupiedTimes) {
    // Se c'è un appuntamento che inizia 30 min dopo la nostra fine = buco!
    const thirtyMinAfterEnd = format(addMinutes(parseTimeToDate(endTimeStr, startTime), SLOT_DURATION), 'HH:mm');
    
    if (occupiedTime === thirtyMinAfterEnd) {
      return {
        allowed: false,
        reason: `Per ottimizzare l'agenda, prenota alle ${format(addMinutes(parseTimeToDate(startTimeStr, startTime), -SLOT_DURATION), 'HH:mm')} o alle ${format(addMinutes(parseTimeToDate(startTimeStr, startTime), SLOT_DURATION), 'HH:mm')}`
      };
    }
  }
  
  return { allowed: true };
}

// Helper per convertire stringa orario in Date
function parseTimeToDate(timeStr: string, referenceDate: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return setMinutes(setHours(startOfDay(referenceDate), hours), minutes);
}

// =============================================================================
// CREA APPUNTAMENTO
// =============================================================================

export async function createAppointment(
  userId: string,
  startTime: Date,
  type: 'FIRST_VISIT' | 'FOLLOW_UP',
  notes?: string,
  callerEmail?: string // CRITICO: Email del chiamante per bypass master
) {
  const duration = type === 'FIRST_VISIT' 
    ? VISIT_DURATION.FIRST_VISIT 
    : VISIT_DURATION.FOLLOW_UP;
  
  // Verifica ancora una volta la disponibilità
  // IMPORTANTE: Passa callerEmail per permettere bypass master
  const canBook = await canUserBook(userId, startTime, duration, callerEmail);
  
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

// Costanti per limite anti-spam
const MAX_CANCELLATIONS_IN_PERIOD = 3;  // Massimo 3 cancellazioni
const CANCELLATION_PERIOD_DAYS = 30;     // In 30 giorni

export async function cancelAppointment(
  appointmentId: string,
  userId: string
) {
  // Verifica che l'appuntamento esista e appartenga all'utente (o sia admin)
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      user: {
        select: { id: true, role: true, email: true },
      },
    },
  });
  
  if (!appointment) {
    throw new Error('Appuntamento non trovato');
  }
  
  // Verifica permessi
  const requestingUser = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });
  
  const isAdmin = requestingUser?.role === 'ADMIN' || 
    (requestingUser?.email && isMasterAccount(requestingUser.email));
  
  if (appointment.userId !== userId && !isAdmin) {
    throw new Error('Non hai i permessi per cancellare questo appuntamento');
  }
  
  // Anti-spam: Se è un paziente (non admin), verifica limite cancellazioni
  if (!isAdmin) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - CANCELLATION_PERIOD_DAYS);
    
    // Conta cancellazioni negli ultimi 30 giorni
    const recentCancellations = await db.appointment.count({
      where: {
        userId: appointment.userId,
        status: 'CANCELLED',
        cancelledAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    
    if (recentCancellations >= MAX_CANCELLATIONS_IN_PERIOD) {
      throw new Error(
        `Hai raggiunto il limite di ${MAX_CANCELLATIONS_IN_PERIOD} cancellazioni negli ultimi ${CANCELLATION_PERIOD_DAYS} giorni. ` +
        `Per prenotare nuovamente, contatta lo studio al numero 392 0979135.`
      );
    }
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
