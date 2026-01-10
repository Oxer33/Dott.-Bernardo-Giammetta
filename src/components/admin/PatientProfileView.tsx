// =============================================================================
// PATIENT PROFILE VIEW - ADMIN
// Visualizzazione profilo paziente per admin con questionari e appuntamenti
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  ChevronLeft,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Filter,
  XCircle,
  Eye,
  X,
} from 'lucide-react';

// =============================================================================
// TIPI
// =============================================================================

interface Appointment {
  id: string;
  startTime: string;
  duration: number;
  type: string;
  status: string;
  notes: string | null;
  cancelledAt: string | null;
}

interface Questionnaire {
  id: string;
  dietType: string;
  createdAt: string;
  privacyConsent: boolean;
  commonAnswers: string;   // JSON stringificato
  dietAnswers: string;     // JSON stringificato
  billingData: string;     // JSON stringificato
}

interface PatientData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  contactEmail: string | null; // Email per comunicazioni (può differire da email login)
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  codiceFiscale: string | null;
  address: string | null;
  addressNumber: string | null;
  city: string | null;
  cap: string | null;
  isWhitelisted: boolean;
  whitelistedAt: string | null;
  createdAt: string;
  lastVisitAt: string | null;
  appointments: Appointment[];
  questionnaires: Questionnaire[];
}

interface PatientProfileViewProps {
  patient: PatientData;
}

// =============================================================================
// COMPONENTE
// =============================================================================

// Tipo filtro appuntamenti
type AppointmentFilter = 'all' | 'confirmed' | 'completed' | 'cancelled';

export function PatientProfileView({ patient }: PatientProfileViewProps) {
  const router = useRouter();
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentFilter>('all');
  // State per visualizzare questionario
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  
  // Calcola contatori per ogni filtro
  const confirmedCount = patient.appointments.filter(apt => apt.status === 'CONFIRMED').length;
  const completedCount = patient.appointments.filter(apt => apt.status === 'COMPLETED').length;
  const cancelledCount = patient.appointments.filter(apt => apt.status === 'CANCELLED').length;
  
  // Filtra appuntamenti in base al filtro selezionato
  const filteredAppointments = patient.appointments.filter(apt => {
    if (appointmentFilter === 'all') return true;
    if (appointmentFilter === 'confirmed') return apt.status === 'CONFIRMED';
    if (appointmentFilter === 'completed') return apt.status === 'COMPLETED';
    if (appointmentFilter === 'cancelled') return apt.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-lavender-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Header con bottone indietro */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Torna indietro
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center text-white font-bold text-2xl">
              {(patient.firstName?.[0] || patient.name?.[0] || patient.email[0]).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-sage-900">
                {patient.firstName && patient.lastName 
                  ? `${patient.firstName} ${patient.lastName}`
                  : patient.name || 'Nome non specificato'}
              </h1>
              <p className="text-sage-600">{patient.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {patient.isWhitelisted ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Approvato
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    In attesa
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonna sinistra - Dati personali */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dati Anagrafici */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft p-6"
            >
              <h2 className="text-lg font-semibold text-sage-800 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-lavender-500" />
                Dati Anagrafici
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-sage-500">Nome</p>
                  <p className="font-medium text-sage-800">{patient.firstName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Cognome</p>
                  <p className="font-medium text-sage-800">{patient.lastName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Email login</p>
                  <p className="font-medium text-sage-800">{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Email contatto</p>
                  <p className="font-medium text-sage-800">{patient.contactEmail || patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Telefono</p>
                  <p className="font-medium text-sage-800">{patient.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Data di nascita</p>
                  <p className="font-medium text-sage-800">
                    {patient.birthDate 
                      ? format(parseISO(patient.birthDate), 'd MMMM yyyy', { locale: it })
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Luogo di nascita</p>
                  <p className="font-medium text-sage-800">{patient.birthPlace || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Codice Fiscale</p>
                  <p className="font-medium text-sage-800 font-mono">{patient.codiceFiscale || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-sage-500">Indirizzo</p>
                  <p className="font-medium text-sage-800">
                    {patient.address 
                      ? `${patient.address} ${patient.addressNumber || ''}, ${patient.cap || ''} ${patient.city || ''}`
                      : '-'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Appuntamenti */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-sage-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-lavender-500" />
                  Appuntamenti ({filteredAppointments.length}/{patient.appointments.length})
                </h2>
                {/* Filtri con contatori */}
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setAppointmentFilter('all')}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      appointmentFilter === 'all'
                        ? 'bg-sage-500 text-white'
                        : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                    }`}
                  >
                    Tutti ({patient.appointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter('confirmed')}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      appointmentFilter === 'confirmed'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    Confermati ({confirmedCount})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter('completed')}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      appointmentFilter === 'completed'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    Completati ({completedCount})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter('cancelled')}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      appointmentFilter === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    Cancellati ({cancelledCount})
                  </button>
                </div>
              </div>
              
              {filteredAppointments.length === 0 ? (
                <p className="text-sage-500 text-center py-4">
                  {appointmentFilter === 'all' 
                    ? 'Nessun appuntamento' 
                    : `Nessun appuntamento ${appointmentFilter === 'confirmed' ? 'confermato' : appointmentFilter === 'completed' ? 'completato' : 'cancellato'}`}
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className={`p-3 rounded-xl border ${
                        apt.status === 'CANCELLED'
                          ? 'bg-red-50 border-red-100'
                          : apt.status === 'CONFIRMED'
                          ? 'bg-green-50 border-green-100'
                          : apt.status === 'COMPLETED'
                          ? 'bg-blue-50 border-blue-100'
                          : 'bg-sage-50 border-sage-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sage-800">
                            {apt.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Controllo'}
                          </p>
                          <p className="text-sm text-sage-600">
                            {format(parseISO(apt.startTime), "EEEE d MMMM yyyy 'ore' HH:mm", { locale: it })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-sage-500">{apt.duration} min</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            apt.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : apt.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-700'
                              : apt.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-sage-100 text-sage-700'
                          }`}>
                            {apt.status === 'CANCELLED' ? 'Cancellato' : apt.status === 'CONFIRMED' ? 'Confermato' : apt.status === 'COMPLETED' ? 'Completato' : apt.status}
                          </span>
                        </div>
                      </div>
                      {apt.notes && (
                        <p className="mt-2 text-sm text-sage-600 bg-white/50 p-2 rounded">
                          📝 {apt.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Colonna destra - Questionari */}
          <div className="space-y-6">
            {/* Card Questionari */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-soft p-6"
            >
              <h2 className="text-lg font-semibold text-sage-800 flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-sage-500" />
                Questionari ({patient.questionnaires.length})
              </h2>
              
              {patient.questionnaires.length === 0 ? (
                <div className="text-center py-6">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-sage-300" />
                  <p className="text-sage-500">Nessun questionario compilato</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patient.questionnaires.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-sage-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sage-700">{q.dietType}</p>
                          <p className="text-xs text-sage-500">
                            {format(parseISO(q.createdAt), "d MMM yyyy 'alle' HH:mm", { locale: it })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              Ultimo
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedQuestionnaire(q)}
                            className="p-1.5 bg-lavender-100 text-lavender-700 rounded-lg hover:bg-lavender-200 transition-colors"
                            title="Visualizza questionario"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info Account */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
            >
              <h3 className="font-semibold text-lavender-800 mb-3">Info Account</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-lavender-600">Registrato il</span>
                  <span className="text-lavender-800">
                    {format(parseISO(patient.createdAt), 'd MMM yyyy', { locale: it })}
                  </span>
                </div>
                {patient.whitelistedAt && (
                  <div className="flex justify-between">
                    <span className="text-lavender-600">Approvato il</span>
                    <span className="text-lavender-800">
                      {format(parseISO(patient.whitelistedAt), 'd MMM yyyy', { locale: it })}
                    </span>
                  </div>
                )}
                {patient.lastVisitAt && (
                  <div className="flex justify-between">
                    <span className="text-lavender-600">Ultima visita</span>
                    <span className="text-lavender-800">
                      {format(parseISO(patient.lastVisitAt), 'd MMM yyyy', { locale: it })}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modal Visualizza Questionario */}
        {selectedQuestionnaire && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between p-6 border-b border-sage-100">
                <div>
                  <h2 className="text-xl font-semibold text-sage-900">
                    Questionario - {selectedQuestionnaire.dietType}
                  </h2>
                  <p className="text-sm text-sage-500">
                    Compilato il {format(parseISO(selectedQuestionnaire.createdAt), "d MMMM yyyy 'alle' HH:mm", { locale: it })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedQuestionnaire(null)}
                  className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-sage-600" />
                </button>
              </div>

              {/* Contenuto Modal - Scrollabile */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Risposte Comuni */}
                <div>
                  <h3 className="font-semibold text-sage-800 mb-3 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-lavender-500" />
                    Stile di Vita e Salute
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(JSON.parse(selectedQuestionnaire.commonAnswers || '{}')).map(([key, value]) => (
                      <div key={key} className="bg-sage-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-sage-500 mb-1">Domanda {key.replace('q', '')}</p>
                        <p className="text-sage-800 whitespace-pre-wrap">{String(value) || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risposte Specifiche Dieta */}
                <div>
                  <h3 className="font-semibold text-sage-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-lavender-500" />
                    Preferenze Alimentari ({selectedQuestionnaire.dietType})
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(JSON.parse(selectedQuestionnaire.dietAnswers || '{}')).map(([key, value]) => (
                      <div key={key} className="bg-sage-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-sage-500 mb-1">Domanda {key.replace('q', '')}</p>
                        <p className="text-sage-800 whitespace-pre-wrap">{String(value) || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dati Fatturazione */}
                <div>
                  <h3 className="font-semibold text-sage-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-lavender-500" />
                    Dati Fatturazione
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(JSON.parse(selectedQuestionnaire.billingData || '{}')).map(([key, value]) => {
                      const labels: Record<string, string> = {
                        billingBirthPlace: 'Luogo di nascita',
                        billingAddress: 'Indirizzo',
                        billingAddressNumber: 'Numero civico',
                        billingCap: 'CAP',
                        billingCity: 'Città',
                        billingCodiceFiscale: 'Codice Fiscale',
                      };
                      return (
                        <div key={key} className="bg-sage-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-sage-500 mb-1">{labels[key] || key}</p>
                          <p className="text-sage-800">{String(value) || '-'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Consenso privacy: {selectedQuestionnaire.privacyConsent ? 'Autorizzato' : 'Non autorizzato'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="p-4 border-t border-sage-100 bg-sage-50">
                <button
                  onClick={() => setSelectedQuestionnaire(null)}
                  className="w-full py-2 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
