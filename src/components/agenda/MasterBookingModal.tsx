// =============================================================================
// MASTER BOOKING MODAL - DOTT. BERNARDO GIAMMETTA
// Finestra speciale per account master/medico
// Funzionalità: prenotazione per pazienti, blocchi orari, durata variabile
// =============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  User,
  Clock,
  Calendar,
  CalendarOff,
  Repeat,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface Patient {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  isWhitelisted?: boolean;
}

interface MasterBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string; // HH:MM
  onSuccess: () => void;
  appointmentId?: string; // ID appuntamento esistente per eliminazione
}

type ActionType = 'appointment' | 'block_occasional' | 'block_recurring' | 'delete_appointment' | 'hard_delete';

// =============================================================================
// COSTANTI
// =============================================================================

const DURATIONS = [
  { value: 60, label: '60 minuti', description: 'Visita di controllo' },
  { value: 90, label: '90 minuti', description: 'Prima visita' },
  { value: 120, label: '120 minuti', description: 'Visita approfondita' },
];

// Genera tutte le fasce orarie dalle 08:30 alle 20:00
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 8 && minute === 0) continue; // Skip 08:00
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunedì' },
  { value: 2, label: 'Martedì' },
  { value: 3, label: 'Mercoledì' },
  { value: 4, label: 'Giovedì' },
  { value: 5, label: 'Venerdì' },
  { value: 6, label: 'Sabato' },
];

// =============================================================================
// COMPONENTE
// =============================================================================

export function MasterBookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onSuccess,
  appointmentId,
}: MasterBookingModalProps) {
  // Stati
  const [actionType, setActionType] = useState<ActionType>('appointment');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState(selectedTime);
  const [endTime, setEndTime] = useState('');
  const [blockNote, setBlockNote] = useState('');
  const [recurringDay, setRecurringDay] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset quando si apre il modal
  useEffect(() => {
    if (isOpen) {
      // Se c'è un appuntamento esistente, mostra opzione eliminazione
      setActionType(appointmentId ? 'delete_appointment' : 'appointment');
      setConfirmDelete(false);
      setSearchQuery('');
      setPatients([]);
      setSelectedPatient(null);
      setDuration(60);
      setStartTime(selectedTime);
      setEndTime(calculateEndTime(selectedTime, 60));
      setBlockNote('');
      setSuccess(false);
      setError(null);
      
      // Imposta il giorno della settimana corrente per blocchi ricorrenti
      const dayOfWeek = new Date(selectedDate).getDay();
      setRecurringDay(dayOfWeek === 0 ? 1 : dayOfWeek);
    }
  }, [isOpen, selectedTime, selectedDate, appointmentId]);

  // Calcola orario fine quando cambia inizio o durata
  useEffect(() => {
    if (actionType === 'appointment') {
      setEndTime(calculateEndTime(startTime, duration));
    }
  }, [startTime, duration, actionType]);

  // Calcola orario fine
  const calculateEndTime = (start: string, durationMin: number): string => {
    const [hours, minutes] = start.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMin;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Cerca pazienti (include anche quelli in attesa di whitelist)
  const searchPatients = useCallback(async (query: string) => {
    if (query.length < 2) {
      setPatients([]);
      return;
    }

    setSearchLoading(true);
    try {
      // Usa filter=all per includere TUTTI i pazienti (anche non whitelisted)
      const response = await fetch(`/api/admin/patients?filter=all&search=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success && data.patients) {
        // Mappa i dati nel formato corretto
        setPatients(data.patients.map((p: any) => ({
          id: p.id,
          name: p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.name,
          email: p.email,
          phone: p.phone,
          isWhitelisted: p.isWhitelisted,
        })));
      }
    } catch (err) {
      console.error('Errore ricerca pazienti:', err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounce ricerca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchPatients(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchPatients]);

  // Conferma azione
  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      if (actionType === 'appointment') {
        // Prenotazione per paziente
        if (!selectedPatient) {
          setError('Seleziona un paziente');
          setLoading(false);
          return;
        }

        // Non usare Z (UTC) - l'orario deve essere interpretato come locale italiano
        const startTimeISO = `${selectedDate}T${startTime}:00`;
        
        const response = await fetch('/api/agenda/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startTime: startTimeISO,
            type: duration === 90 ? 'FIRST_VISIT' : 'FOLLOW_UP',
            userId: selectedPatient.id,
            duration: duration, // Passa durata esplicita per 120min
          }),
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Errore nella prenotazione');
        }
      } else if (actionType === 'block_occasional') {
        // Blocco occasionale
        const response = await fetch('/api/agenda/blocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'OCCASIONAL',
            specificDate: selectedDate,
            startTime,
            endTime,
            note: blockNote || undefined,
          }),
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Errore nella creazione del blocco');
        }
      } else if (actionType === 'block_recurring') {
        // Blocco ricorrente
        const response = await fetch('/api/agenda/blocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'RECURRING',
            dayOfWeek: recurringDay,
            startTime,
            endTime,
            note: blockNote || undefined,
          }),
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Errore nella creazione del blocco');
        }
      } else if (actionType === 'delete_appointment' && appointmentId) {
        // Annulla appuntamento (tracciato) - imposta status CANCELLED
        const response = await fetch(`/api/agenda/appointments/${appointmentId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Errore nell\'annullamento dell\'appuntamento');
        }
      } else if (actionType === 'hard_delete' && appointmentId) {
        // Elimina completamente (non tracciato) - rimuove dal database
        const response = await fetch(`/api/agenda/appointments/${appointmentId}?hard=true`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Errore nell\'eliminazione dell\'appuntamento');
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {success ? (
            // Successo
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-sage-900 mb-2">
                {actionType === 'appointment' ? 'Appuntamento Creato!' : 'Blocco Creato!'}
              </h3>
              <p className="text-sage-600">
                L'operazione è stata completata con successo.
              </p>
            </div>
          ) : (
            <>
              {/* Header con DATA e ORA BEN EVIDENTI */}
              <div className="p-6 border-b border-sage-100 bg-gradient-to-r from-sage-50 to-lavender-50">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-sage-600" />
                </button>
                
                {/* Data e ora come titolo principale */}
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-sage-900 capitalize">
                    {format(new Date(selectedDate), "EEEE d MMMM", { locale: it })}
                  </p>
                  <p className="text-4xl font-bold text-sage-700 mt-1">
                    {selectedTime}
                  </p>
                  <p className="text-sm text-sage-500 mt-1">
                    {format(new Date(selectedDate), "yyyy", { locale: it })}
                  </p>
                </div>
              </div>

              {/* Selezione tipo azione - UI diversa se c'è appuntamento esistente */}
              <div className="p-6 border-b border-sage-100">
                <label className="block text-sm font-medium text-sage-700 mb-3">
                  Cosa vuoi fare?
                </label>
                
                {/* Se c'è un appuntamento esistente, mostra solo 2 opzioni */}
                {appointmentId ? (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Annullato dal paziente - mantiene record nel sistema */}
                    <button
                      onClick={() => setActionType('delete_appointment')}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        actionType === 'delete_appointment'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-sage-200 hover:border-orange-300'
                      )}
                    >
                      <X className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                      <span className="text-sm font-medium text-orange-700">Annullato</span>
                      <span className="block text-xs text-orange-500">dal paziente</span>
                    </button>
                    {/* Eliminato da me - rimuove completamente */}
                    <button
                      onClick={() => setActionType('hard_delete')}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        actionType === 'hard_delete'
                          ? 'border-red-500 bg-red-50'
                          : 'border-sage-200 hover:border-red-300'
                      )}
                    >
                      <Trash2 className="w-6 h-6 mx-auto mb-2 text-red-600" />
                      <span className="text-sm font-medium text-red-700">Eliminato</span>
                      <span className="block text-xs text-red-500">da me</span>
                    </button>
                  </div>
                ) : (
                  /* Se slot vuoto, mostra opzioni per creare */
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setActionType('appointment')}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-center',
                        actionType === 'appointment'
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-sage-200 hover:border-sage-300'
                      )}
                    >
                      <Users className="w-5 h-5 mx-auto mb-1 text-sage-600" />
                      <span className="text-xs font-medium text-sage-700">Appuntamento</span>
                    </button>
                    <button
                      onClick={() => setActionType('block_occasional')}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-center',
                        actionType === 'block_occasional'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-sage-200 hover:border-sage-300'
                      )}
                    >
                      <CalendarOff className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                      <span className="text-xs font-medium text-sage-700">Blocco</span>
                    </button>
                    <button
                      onClick={() => setActionType('block_recurring')}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-center',
                        actionType === 'block_recurring'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-sage-200 hover:border-sage-300'
                      )}
                    >
                      <Repeat className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                      <span className="text-xs font-medium text-sage-700">Ricorrente</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Content in base al tipo */}
              <div className="p-6 space-y-4">
                {/* Annulla appuntamento (tracciato) */}
                {actionType === 'delete_appointment' && appointmentId && (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                      <X className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">
                      Annullare questo appuntamento?
                    </h3>
                    <p className="text-sage-600 mb-4">
                      L'appuntamento verrà segnato come <strong>annullato</strong> e rimarrà visibile nello storico.
                    </p>
                    {!confirmDelete ? (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium"
                      >
                        Sì, annulla appuntamento
                      </button>
                    ) : (
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={handleConfirm}
                          disabled={loading}
                          className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Conferma annullamento
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                        >
                          Indietro
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Elimina appuntamento (non tracciato) */}
                {actionType === 'hard_delete' && appointmentId && (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">
                      Eliminare definitivamente?
                    </h3>
                    <p className="text-sage-600 mb-4">
                      L'appuntamento verrà <strong>eliminato completamente</strong> dal sistema. Non sarà più visibile nello storico.
                    </p>
                    {!confirmDelete ? (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium"
                      >
                        Sì, elimina definitivamente
                      </button>
                    ) : (
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={handleConfirm}
                          disabled={loading}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Conferma eliminazione
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                        >
                          Indietro
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {actionType === 'appointment' && (
                  <>
                    {/* Ricerca paziente */}
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Cerca Paziente
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Nome, email o telefono..."
                          className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
                        />
                        {searchLoading && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 animate-spin" />
                        )}
                      </div>

                      {/* Lista pazienti trovati */}
                      {patients.length > 0 && !selectedPatient && (
                        <div className="mt-2 border border-sage-200 rounded-xl max-h-48 overflow-y-auto">
                          {patients.map((patient) => (
                            <button
                              key={patient.id}
                              onClick={() => {
                                setSelectedPatient(patient);
                                setSearchQuery('');
                                setPatients([]);
                              }}
                              className="w-full p-3 text-left hover:bg-sage-50 border-b border-sage-100 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sage-900">{patient.name || 'Senza nome'}</p>
                                  <p className="text-sm text-sage-600">{patient.email}</p>
                                </div>
                                {!patient.isWhitelisted && (
                                  <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">In attesa</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Paziente selezionato */}
                      {selectedPatient && (
                        <div className="mt-2 p-3 bg-sage-50 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-sage-600" />
                            <div>
                              <p className="font-medium text-sage-900">{selectedPatient.name || 'Senza nome'}</p>
                              <p className="text-sm text-sage-600">{selectedPatient.email}</p>
                              {!selectedPatient.isWhitelisted && (
                                <span className="text-xs text-orange-600">⚠️ Paziente in attesa di approvazione</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPatient(null)}
                            className="p-1 hover:bg-sage-200 rounded-lg"
                          >
                            <X className="w-4 h-4 text-sage-600" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Durata */}
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Durata Visita
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {DURATIONS.map((d) => (
                          <button
                            key={d.value}
                            onClick={() => setDuration(d.value)}
                            className={cn(
                              'p-3 rounded-xl border-2 transition-all text-center',
                              duration === d.value
                                ? 'border-sage-500 bg-sage-50'
                                : 'border-sage-200 hover:border-sage-300'
                            )}
                          >
                            <p className="font-semibold text-sage-900">{d.value} min</p>
                            <p className="text-xs text-sage-600">{d.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Orario inizio/fine - NON mostrare se c'è appuntamento esistente */}
                {!appointmentId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Ora Inizio
                      </label>
                      <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full p-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
                      >
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Ora Fine
                      </label>
                      {actionType === 'appointment' ? (
                        <div className="p-3 bg-sage-50 border border-sage-200 rounded-xl text-sage-700">
                          {endTime} (automatico)
                        </div>
                      ) : (
                        <select
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full p-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
                        >
                          {TIME_SLOTS.filter(t => t > startTime).map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}

                {/* Giorno settimana per ricorrenti */}
                {actionType === 'block_recurring' && (
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      <Repeat className="w-4 h-4 inline mr-1" />
                      Ripeti ogni
                    </label>
                    <select
                      value={recurringDay}
                      onChange={(e) => setRecurringDay(Number(e.target.value))}
                      className="w-full p-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day.value} value={day.value}>{day.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Questo blocco si ripeterà ogni settimana nello stesso orario
                    </p>
                  </div>
                )}

                {/* Nota per blocchi */}
                {(actionType === 'block_occasional' || actionType === 'block_recurring') && (
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Nota (opzionale)
                    </label>
                    <input
                      type="text"
                      value={blockNote}
                      onChange={(e) => setBlockNote(e.target.value)}
                      placeholder="Es: Convegno, Vacanza, Altro impegno..."
                      className="w-full p-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
                    />
                  </div>
                )}

                {/* Errore */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Footer - NON mostrare bottone Crea Blocco se c'è appuntamento esistente */}
              {!appointmentId && (
                <div className="p-6 border-t border-sage-100 flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Annulla
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirm}
                    className="flex-1"
                    isLoading={loading}
                    loadingText="Salvataggio..."
                  >
                    {actionType === 'appointment' ? 'Prenota' : 'Crea Blocco'}
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MasterBookingModal;
