// =============================================================================
// PATIENT DASHBOARD - AREA PERSONALE
// Dashboard per pazienti in whitelist
// =============================================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  MapPin,
  FileText,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format, isPast, isFuture } from 'date-fns';
import { it } from 'date-fns/locale';

// =============================================================================
// TIPI
// =============================================================================

interface Appointment {
  id: string;
  startTime: Date;
  duration: number;
  type: string;
  status: string; // CONFIRMED | CANCELLED | COMPLETED | NO_SHOW
  notes?: string | null;
  cancelledAt?: Date | null;
}

interface PatientDashboardProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    firstName?: string | null;
    lastName?: string | null;
    appointments: Appointment[];
  };
}

// Helper per ottenere il nome da mostrare
const getDisplayName = (user: PatientDashboardProps['user']): string => {
  // Priorità: firstName, poi name (primo nome), poi email prima della @
  if (user.firstName) {
    return user.firstName;
  }
  if (user.name) {
    return user.name.split(' ')[0];
  }
  if (user.email) {
    return user.email.split('@')[0];
  }
  return 'Paziente';
};

// Helper per ottenere l'iniziale
const getInitial = (user: PatientDashboardProps['user']): string => {
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  if (user.name) {
    return user.name.charAt(0).toUpperCase();
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return 'P';
};

// =============================================================================
// COMPONENTE
// =============================================================================

export function PatientDashboard({ user }: PatientDashboardProps) {
  // Stati per gestione cancellazione
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Funzione per cancellare appuntamento
  const handleCancelAppointment = async (appointmentId: string) => {
    setCancellingId(appointmentId);
    setCancelError(null);
    
    try {
      const response = await fetch(`/api/agenda/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCancelSuccess(true);
        setConfirmCancelId(null);
        // Ricarica la pagina per aggiornare i dati
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setCancelError(data.error || 'Errore nella cancellazione');
      }
    } catch (error) {
      setCancelError('Errore di connessione. Riprova.');
    } finally {
      setCancellingId(null);
    }
  };

  // Separa appuntamenti per stato e data
  const upcomingAppointments = user.appointments.filter(a => 
    isFuture(new Date(a.startTime)) && a.status === 'CONFIRMED'
  );
  
  // Storico: visite passate (completate, confermate passate, no-show)
  const pastAppointments = user.appointments.filter(a => 
    isPast(new Date(a.startTime)) && a.status !== 'CANCELLED'
  );
  
  // Visite cancellate (per trasparenza)
  const cancelledAppointments = user.appointments.filter(a => 
    a.status === 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-lavender-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-bold text-xl">
              {getInitial(user)}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-sage-900">
                Benvenuto, {getDisplayName(user)}!
              </h1>
              <p className="text-sage-600">{user.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonna principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prossimi appuntamenti */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-lavender-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-sage-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-lavender-500" />
                  Prossimi Appuntamenti
                </h2>
                <Link href="/agenda">
                  <Button variant="secondary" size="sm">
                    <span>Prenota</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Messaggio successo cancellazione */}
              {cancelSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700">Appuntamento cancellato con successo!</p>
                </div>
              )}

              {/* Errore cancellazione */}
              {cancelError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">{cancelError}</p>
                  <button onClick={() => setCancelError(null)} className="ml-auto">
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              )}

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-sage-50 rounded-xl border border-sage-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-sage-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sage-800">
                            {appointment.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Controllo'}
                          </p>
                          <p className="text-sm text-sage-600">
                            {format(new Date(appointment.startTime), "EEEE d MMMM 'alle' HH:mm", { locale: it })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-sage-500">
                          <Clock className="w-4 h-4" />
                          {appointment.duration} min
                        </div>
                      </div>
                      
                      {/* Bottone cancella / conferma */}
                      <div className="mt-3 pt-3 border-t border-sage-200">
                        {confirmCancelId === appointment.id ? (
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-sm text-red-600 mr-2">Confermi la cancellazione?</span>
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              disabled={cancellingId === appointment.id}
                              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                              {cancellingId === appointment.id ? 'Cancellando...' : 'Sì, cancella'}
                            </button>
                            <button
                              onClick={() => setConfirmCancelId(null)}
                              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmCancelId(appointment.id)}
                            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 ml-auto"
                          >
                            <X className="w-4 h-4" />
                            Cancella appuntamento
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-lavender-100 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-lavender-400" />
                  </div>
                  <p className="text-sage-600 mb-4">Nessun appuntamento in programma</p>
                  <Link href="/agenda">
                    <Button className="bg-lavender-500 hover:bg-lavender-600">
                      Prenota una Visita
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Storico Visite Completate */}
            {pastAppointments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-soft border border-sage-100"
              >
                <h2 className="text-xl font-semibold text-sage-800 flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-sage-500" />
                  Storico Visite ({pastAppointments.length})
                </h2>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-3 bg-cream-50 rounded-lg"
                    >
                      <CheckCircle className={`w-5 h-5 ${
                        appointment.status === 'COMPLETED' ? 'text-green-500' : 
                        appointment.status === 'NO_SHOW' ? 'text-red-400' : 'text-sage-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-sage-700">
                          {appointment.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Controllo'}
                          {appointment.status === 'COMPLETED' && <span className="ml-2 text-xs text-green-600">(Completata)</span>}
                          {appointment.status === 'NO_SHOW' && <span className="ml-2 text-xs text-red-500">(Non presentato)</span>}
                        </p>
                        <p className="text-xs text-sage-500">
                          {format(new Date(appointment.startTime), "EEEE d MMMM yyyy 'alle' HH:mm", { locale: it })}
                        </p>
                      </div>
                      <div className="text-xs text-sage-400">
                        {appointment.duration} min
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Visite Cancellate */}
            {cancelledAppointments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-soft border border-red-100"
              >
                <h2 className="text-lg font-semibold text-sage-800 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Visite Cancellate ({cancelledAppointments.length})
                </h2>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cancelledAppointments.slice(0, 10).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-3 p-2 bg-red-50 rounded-lg text-sm"
                    >
                      <X className="w-4 h-4 text-red-400" />
                      <div className="flex-1">
                        <span className="text-sage-600">
                          {appointment.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Controllo'}
                        </span>
                        <span className="text-sage-400 ml-2">
                          {format(new Date(appointment.startTime), "d MMM yyyy", { locale: it })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info contatto */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-lavender-100"
            >
              <h3 className="font-semibold text-sage-800 mb-4">Contatta lo Studio</h3>
              <div className="space-y-4">
                <a
                  href="tel:+393920979135"
                  className="flex items-center gap-3 text-sage-600 hover:text-sage-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-sm">+39 392 0979135</span>
                </a>
                <a
                  href="mailto:info@bernardogiammetta.com"
                  className="flex items-center gap-3 text-sage-600 hover:text-sage-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-sage-500" />
                  </div>
                  <span className="text-sm">info@bernardogiammetta.com</span>
                </a>
              </div>
            </motion.div>

            {/* Note */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-lavender-100 to-lavender-50 rounded-2xl p-6 border border-lavender-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-lavender-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-lavender-800 mb-1">Promemoria</h4>
                  <p className="text-sm text-lavender-700">
                    Per cancellare o modificare un appuntamento, contatta lo studio almeno 24 ore prima.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
