// =============================================================================
// AGENDA CALENDAR - DOTT. BERNARDO GIAMMETTA
// Componente calendario per visualizzare e prenotare appuntamenti
// =============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  FileText,
  Plus
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MasterBookingModal } from './MasterBookingModal';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// TYPES
// =============================================================================

interface TimeSlot {
  time: string;
  datetime: string;
  isAvailable: boolean;
  isBlocked: boolean;
  blockType?: 'recurring' | 'occasional' | 'appointment';
  blockNote?: string;
  patientName?: string;
  patientSurname?: string;
  // Durata appuntamento per colori differenziati (60=lilla, 90=viola scuro)
  appointmentDuration?: number;
  // ID appuntamento per eliminazione dall'agenda (solo admin)
  appointmentId?: string;
  // Note appuntamento per tooltip (solo admin)
  appointmentNotes?: string;
  // Stato appuntamento (CONFIRMED/COMPLETED) per mostrare € se pagato
  appointmentStatus?: string;
}

interface DayAvailability {
  date: string;
  dateString: string;
  dayName: string;
  slots: TimeSlot[];
  isHoliday?: boolean;
  holidayName?: string;
}

// =============================================================================
// AGENDA CALENDAR COMPONENT
// =============================================================================

export function AgendaCalendar() {
  const { data: session, status } = useSession();
  
  // Verifica se l'utente è master/admin (definito prima per usarlo nell'inizializzazione)
  const isMaster = session?.user?.role === 'ADMIN' || 
    (session?.user?.email && isMasterAccount(session.user.email));
  
  // Per i pazienti: calcola la data minima prenotabile (48h nel futuro)
  // Per gli admin: mostra da oggi
  const getMinBookableDate = useCallback(() => {
    if (isMaster) {
      return new Date();
    }
    // Pazienti: 48 ore nel futuro
    return addDays(new Date(), 2);
  }, [isMaster]);
  
  // Inizializza la settimana partendo dalla data minima prenotabile
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const minDate = isMaster ? new Date() : addDays(new Date(), 2);
    return startOfWeek(minDate, { weekStartsOn: 1 });
  });
  
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; appointmentId?: string } | null>(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [masterModal, setMasterModal] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  
  // Stati per finestra note dopo prenotazione
  const [notesModal, setNotesModal] = useState(false);
  const [newAppointmentId, setNewAppointmentId] = useState<string | null>(null);
  const [patientNotes, setPatientNotes] = useState<string[]>(['']);
  const [savingNotes, setSavingNotes] = useState(false);

  // Fetch disponibilità
  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dateStr = format(currentWeekStart, 'yyyy-MM-dd');
      const response = await fetch(`/api/agenda/availability?date=${dateStr}&days=7`);
      const data = await response.json();
      
      if (data.success) {
        setAvailability(data.data);
      } else {
        setError(data.error || 'Errore nel caricamento');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);
  
  // Fetch prossimo appuntamento del paziente (solo per non-admin)
  const fetchNextAppointment = useCallback(async () => {
    if (!session?.user || isMaster) return;
    
    try {
      // No-cache per avere sempre dati freschi (evita problemi dopo cancellazione da altra pagina)
      const response = await fetch('/api/agenda/appointments?status=upcoming', {
        cache: 'no-store',
      });
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        // Prendi il primo appuntamento futuro confermato
        const apt = data.data[0];
        const startDate = new Date(apt.startTime);
        const endDate = new Date(startDate.getTime() + apt.duration * 60 * 1000);
        
        setNextAppointment({
          id: apt.id,
          date: format(startDate, 'dd/MM/yyyy'),
          startTime: format(startDate, 'HH:mm'),
          endTime: format(endDate, 'HH:mm'),
        });
      } else {
        setNextAppointment(null);
      }
    } catch (err) {
      console.error('Errore fetch appuntamento:', err);
    }
  }, [session?.user, isMaster]);
  
  useEffect(() => {
    fetchNextAppointment();
  }, [fetchNextAppointment]);

  // Cancella appuntamento paziente
  const handleCancelAppointment = async () => {
    if (!nextAppointment) return;
    
    setCancelLoading(true);
    try {
      // Usa il percorso corretto con ID nel path (non query param)
      const response = await fetch(`/api/agenda/appointments/${nextAppointment.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setNextAppointment(null);
        setCancelConfirm(false);
        fetchAvailability(); // Refresh disponibilità
      } else {
        setError(data.error || 'Errore durante la cancellazione');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setCancelLoading(false);
    }
  };
  
  // Vai alla data dell'appuntamento
  const goToAppointmentDate = () => {
    if (!nextAppointment) return;
    
    // Parse la data dd/MM/yyyy
    const [day, month, year] = nextAppointment.date.split('/').map(Number);
    const appointmentDate = new Date(year, month - 1, day);
    const weekStart = startOfWeek(appointmentDate, { weekStartsOn: 1 });
    setCurrentWeekStart(weekStart);
  };

  // Navigazione settimane
  // Per pazienti: non permettere di tornare prima della settimana con 48h minime
  const minWeekStart = startOfWeek(getMinBookableDate(), { weekStartsOn: 1 });
  
  const canGoPreviousWeek = isMaster || currentWeekStart > minWeekStart;
  
  const goToPreviousWeek = () => {
    if (!canGoPreviousWeek) return;
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const goToCurrentWeek = () => {
    // Per pazienti: vai alla settimana minima prenotabile (48h)
    // Per admin: vai alla settimana corrente
    setCurrentWeekStart(minWeekStart);
  };

  // Gestione selezione slot
  const handleSlotClick = (date: string, time: string, isAvailable: boolean, appointmentId?: string) => {
    // Per utenti master, apri sempre il modal speciale (anche su slot occupati per vedere/gestire)
    if (isMaster) {
      setSelectedSlot({ date, time, appointmentId });
      setMasterModal(true);
      return;
    }
    
    // Per utenti normali
    if (!isAvailable) return;
    
    if (!session) {
      // Apri modal login
      signIn('google');
      return;
    }
    
    if (!session.user.isWhitelisted && session.user.role !== 'ADMIN') {
      setError('Per prenotare devi essere un paziente registrato. Contatta lo studio.');
      return;
    }
    
    setSelectedSlot({ date, time });
    setBookingModal(true);
  };

  // Conferma prenotazione
  const confirmBooking = async () => {
    if (!selectedSlot) return;
    
    setBookingLoading(true);
    setError(null);
    
    try {
      // FIX BUG TIMEZONE: Passiamo data e ora come stringa ISO senza conversione timezone
      // Formato: YYYY-MM-DDTHH:MM:00.000Z ma con l'ora locale desiderata
      // Il server interpreterà questa come l'ora esatta che l'utente ha selezionato
      const startTimeISO = `${selectedSlot.date}T${selectedSlot.time}:00.000Z`;
      
      const response = await fetch('/api/agenda/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: startTimeISO,
          type: 'FOLLOW_UP', // Default per pazienti in whitelist
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBookingSuccess(true);
        fetchAvailability(); // Ricarica disponibilità
        fetchNextAppointment(); // Aggiorna card prossimo appuntamento
        
        // Per pazienti (non admin): apri finestra note dopo 1.5 secondi
        if (!isMaster && data.appointment?.id) {
          setNewAppointmentId(data.appointment.id);
          setTimeout(() => {
            setBookingModal(false);
            setBookingSuccess(false);
            setNotesModal(true);
            setPatientNotes(['']); // Reset note
          }, 1500);
        }
      } else {
        setError(data.error || 'Errore nella prenotazione');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setBookingLoading(false);
    }
  };

  // Salva note paziente per appuntamento
  const savePatientNotes = async () => {
    if (!newAppointmentId) return;
    
    setSavingNotes(true);
    try {
      // Filtra note vuote e unisci con newline
      const notesText = patientNotes.filter(n => n.trim()).join('\n');
      
      const response = await fetch(`/api/agenda/appointments/${newAppointmentId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesText }),
      });
      
      const data = await response.json();
      if (!data.success) {
        setError(data.error || 'Errore nel salvataggio note');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setSavingNotes(false);
      setNotesModal(false);
      setNewAppointmentId(null);
      setPatientNotes(['']);
    }
  };

  // Aggiungi nuova nota
  const addNote = () => {
    setPatientNotes([...patientNotes, '']);
  };

  // Aggiorna nota specifica
  const updateNote = (index: number, value: string) => {
    const updated = [...patientNotes];
    updated[index] = value;
    setPatientNotes(updated);
  };

  // Elimina nota specifica
  const removeNote = (index: number) => {
    const updated = patientNotes.filter((_, i) => i !== index);
    setPatientNotes(updated.length > 0 ? updated : ['']);
  };

  // Chiudi modal
  const closeModal = () => {
    setBookingModal(false);
    setSelectedSlot(null);
    setBookingSuccess(false);
    setError(null);
  };

  // Determina colore slot
  // Punto 6: 90min viola scuro, 60min lilla, 120min rosso
  const getSlotColor = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      return 'bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer border-green-200';
    }
    if (slot.blockType === 'recurring') {
      return 'bg-sage-200 text-sage-600 cursor-not-allowed';
    }
    if (slot.blockType === 'occasional') {
      return 'bg-amber-100 text-amber-700 cursor-not-allowed';
    }
    if (slot.blockType === 'appointment') {
      // Colori differenziati per durata
      if (slot.appointmentDuration && slot.appointmentDuration >= 120) {
        return 'bg-red-200 text-red-800 cursor-not-allowed'; // 120min = rosso
      }
      if (slot.appointmentDuration && slot.appointmentDuration >= 90) {
        return 'bg-purple-300 text-purple-900 cursor-not-allowed'; // 90min = viola scuro
      }
      return 'bg-lavender-100 text-lavender-700 cursor-not-allowed'; // 60min = lilla
    }
    return 'bg-gray-100 text-gray-400 cursor-not-allowed';
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
      {/* Card Prossimo Appuntamento - Solo per pazienti con appuntamento */}
      {!isMaster && nextAppointment && (
        <div className="p-4 bg-gradient-to-r from-sage-50 to-cream-50 border-b border-sage-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sage-100 rounded-xl">
                <Calendar className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <p className="text-sm text-sage-600 font-medium">Il tuo prossimo appuntamento</p>
                <p className="text-lg font-semibold text-sage-900">
                  {nextAppointment.date} • {nextAppointment.startTime} - {nextAppointment.endTime}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={goToAppointmentDate}
                className="flex-1 sm:flex-none px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm font-medium"
              >
                Vai alla data
              </button>
              
              {cancelConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelAppointment}
                    disabled={cancelLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {cancelLoading ? 'Annullo...' : 'Conferma'}
                  </button>
                  <button
                    onClick={() => setCancelConfirm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCancelConfirm(true)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Annulla appuntamento
                </button>
              )}
            </div>
          </div>
          
          {/* Avviso anti-spam */}
          {cancelConfirm && (
            <p className="mt-3 text-xs text-sage-600 bg-sage-100/50 p-2 rounded-lg">
              ⚠️ Ti ricordiamo che cancellazioni frequenti potrebbero limitare temporaneamente la tua possibilità di prenotare.
            </p>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="p-6 border-b border-sage-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-semibold text-sage-900">
              Disponibilità Settimanale
            </h2>
            {/* Descrizione nascosta per account master */}
            {!isMaster && (
              <p className="text-sage-600 text-sm mt-1">
                Seleziona una fascia oraria disponibile (verde) per prenotare
              </p>
            )}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={goToPreviousWeek}
              disabled={!canGoPreviousWeek}
              className={`p-2 rounded-lg transition-colors ${
                canGoPreviousWeek 
                  ? 'hover:bg-sage-50 text-sage-600' 
                  : 'opacity-30 cursor-not-allowed text-sage-400'
              }`}
              aria-label="Settimana precedente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToCurrentWeek}
              className="px-4 py-2 text-sm font-medium text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
            >
              Oggi
            </button>
            
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
              aria-label="Settimana successiva"
            >
              <ChevronRight className="w-5 h-5 text-sage-600" />
            </button>
            
            {/* Vai alla data - visibile per master e pazienti whitelist (punto 11) */}
            {(isMaster || session?.user?.isWhitelisted) && (
              <div className="flex items-center gap-1 ml-2">
                <input
                  type="date"
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                  min="2020-01-01"
                  max="2099-12-31"
                  onChange={(e) => {
                    if (e.target.value) {
                      const year = parseInt(e.target.value.split('-')[0]);
                      if (year >= 2020 && year <= 2099) {
                        setCurrentWeekStart(startOfWeek(new Date(e.target.value), { weekStartsOn: 1 }));
                      }
                    }
                  }}
                  className="px-2 py-1.5 text-sm border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Week range display - GRANDE e CENTRATO per il dottore :D */}
        <p className="text-sage-600 text-2xl font-semibold mt-3 text-center">
          {format(currentWeekStart, "d MMMM", { locale: it })} - {format(addDays(currentWeekStart, 6), "d MMMM yyyy", { locale: it })}
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
          </div>
        ) : error && !bookingModal ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-sage-700">{error}</p>
            <Button variant="secondary" className="mt-4" onClick={fetchAvailability}>
              Riprova
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {/* Day Headers */}
              {availability.map((day) => (
                <div key={day.dateString} className="text-center pb-4">
                  <p className="text-sage-500 text-xs uppercase tracking-wide">
                    {day.dayName.slice(0, 3)}
                  </p>
                  <p className={cn(
                    'text-lg font-semibold mt-1',
                    isSameDay(new Date(day.date), new Date()) 
                      ? 'text-sage-600' 
                      : 'text-sage-900'
                  )}>
                    {format(new Date(day.date), 'd')}
                  </p>
                </div>
              ))}
              
              {/* Time Slots o Feste */}
              {(() => {
                // FIX BUG PASQUA: Trova il primo giorno con slots (non festivo) per riferimento
                const referenceDay = availability.find(day => !day.isHoliday && day.slots.length > 0);
                const maxSlots = referenceDay?.slots.length || 23; // 23 slot default (08:30-20:00)
                
                // Se tutti i giorni sono feste, mostra messaggio
                if (!referenceDay) {
                  return (
                    <div className="col-span-7 py-10 text-center text-sage-500">
                      Nessuno slot disponibile in questa settimana (festività)
                    </div>
                  );
                }
                
                // Genera griglia con tutti gli slot
                return referenceDay.slots.map((refSlot, slotIndex) => (
                  availability.map((day) => {
                    // Se è festa, mostra banner solo al primo slot
                    if (day.isHoliday) {
                      return slotIndex === 0 ? (
                        <div
                          key={`${day.dateString}-holiday`}
                          className="p-2 bg-red-50 rounded-xl text-center border border-red-100 flex items-center justify-center"
                          style={{ gridRow: `span ${maxSlots}` }}
                        >
                          <p className="text-red-600 font-medium text-xs writing-mode-vertical">
                            {day.holidayName || 'Chiuso'}
                          </p>
                        </div>
                      ) : null;
                    }
                    
                    const slot = day.slots[slotIndex];
                    if (!slot) return <div key={`${day.dateString}-empty-${slotIndex}`} />;
                    
                    return (
                      <button
                        key={`${day.dateString}-${slot.time}`}
                        onClick={() => handleSlotClick(day.dateString, slot.time, slot.isAvailable, slot.appointmentId)}
                        disabled={!slot.isAvailable && !isMaster}
                        title={isMaster ? (slot.appointmentNotes || slot.blockNote || undefined) : undefined}
                        className={cn(
                          'p-1 text-xs rounded-lg border transition-all duration-200 flex flex-col items-center justify-center min-h-[52px]',
                          'focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-1',
                          isMaster ? 'cursor-pointer hover:opacity-80' : '',
                          getSlotColor(slot)
                        )}
                      >
                        <span className="font-medium">{slot.time}</span>
                        {/* Mostra nome paziente per master se è un appuntamento */}
                        {isMaster && slot.blockType === 'appointment' && slot.patientName && (
                          <>
                            <span className="text-[10px] truncate max-w-full leading-tight">
                              {slot.appointmentStatus === 'COMPLETED' ? '€ ' : ''}{slot.patientName}{slot.appointmentNotes ? ' *' : ''}
                            </span>
                            {slot.patientSurname && (
                              <span className="text-[10px] truncate max-w-full leading-tight">{slot.patientSurname}</span>
                            )}
                          </>
                        )}
                        {/* Mostra nota blocco per master */}
                        {isMaster && slot.blockNote && slot.blockType !== 'appointment' && (
                          <span className="text-[10px] truncate max-w-full leading-tight opacity-75">
                            {slot.blockNote.slice(0, 10)}{slot.blockNote.length > 10 ? '...' : ''}
                          </span>
                        )}
                      </button>
                    );
                  })
                ));
              })()}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-sage-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
            <span className="text-sage-600 text-xs">Disponibile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blush-100 border border-blush-200" />
            <span className="text-sage-600 text-xs">Prenotato</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sage-200 border border-sage-300" />
            <span className="text-sage-600 text-xs">Non disponibile</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/30 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {bookingSuccess ? (
                // Success State
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-sage-900 mb-2">
                    Prenotazione Confermata!
                  </h3>
                  <p className="text-sage-600 mb-6">
                    Riceverai una email di conferma con tutti i dettagli.
                  </p>
                  <Button variant="primary" onClick={closeModal}>
                    Chiudi
                  </Button>
                </div>
              ) : (
                // Booking Form
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-semibold text-sage-900">
                      Conferma Prenotazione
                    </h3>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-sage-600" />
                    </button>
                  </div>

                  {selectedSlot && (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-4 bg-sage-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-sage-600" />
                        <div>
                          <p className="text-sage-900 font-medium">
                            {format(new Date(selectedSlot.date), "EEEE d MMMM yyyy", { locale: it })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-sage-50 rounded-xl">
                        <Clock className="w-5 h-5 text-sage-600" />
                        <div>
                          <p className="text-sage-900 font-medium">
                            Ore {selectedSlot.time}
                          </p>
                          <p className="text-sage-600 text-sm">Durata: 60 minuti</p>
                        </div>
                      </div>

                      {session?.user && (
                        <div className="flex items-center gap-3 p-4 bg-sage-50 rounded-xl">
                          <User className="w-5 h-5 text-sage-600" />
                          <div>
                            <p className="text-sage-900 font-medium">
                              {session.user.name}
                            </p>
                            <p className="text-sage-600 text-sm">{session.user.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={closeModal}
                      className="flex-1"
                      disabled={bookingLoading}
                    >
                      Annulla
                    </Button>
                    <Button
                      variant="primary"
                      onClick={confirmBooking}
                      className="flex-1"
                      isLoading={bookingLoading}
                      loadingText="Prenotando..."
                    >
                      Conferma
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Master Booking Modal - per account medico */}
      {selectedSlot && (
        <MasterBookingModal
          isOpen={masterModal}
          onClose={() => {
            setMasterModal(false);
            setSelectedSlot(null);
          }}
          selectedDate={selectedSlot.date}
          selectedTime={selectedSlot.time}
          appointmentId={selectedSlot.appointmentId}
          onSuccess={() => {
            fetchAvailability();
            setMasterModal(false);
            setSelectedSlot(null);
          }}
        />
      )}

      {/* Modal Note Paziente - dopo prenotazione */}
      <AnimatePresence>
        {notesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-sage-900">
                    Note per la prossima visita
                  </h3>
                  <p className="text-sage-500 text-sm">
                    Modificabile dalla tua Area Personale
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {patientNotes.map((note, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-sage-700">
                        Nota {index + 1}
                      </label>
                      {patientNotes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNote(index)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Elimina
                        </button>
                      )}
                    </div>
                    <textarea
                      value={note}
                      onChange={(e) => updateNote(index, e.target.value)}
                      placeholder="Scrivi qui ciò che vorresti modificare o aggiungere al piano"
                      className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addNote}
                className="w-full mb-4 py-2 border-2 border-dashed border-sage-200 rounded-xl text-sage-500 hover:border-sage-400 hover:text-sage-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Aggiungi nota
              </button>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setNotesModal(false);
                    setNewAppointmentId(null);
                    setPatientNotes(['']);
                  }}
                  className="flex-1"
                >
                  Salta
                </Button>
                <Button
                  variant="primary"
                  onClick={savePatientNotes}
                  className="flex-1"
                  isLoading={savingNotes}
                  loadingText="Salvando..."
                >
                  Salva e chiudi
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
