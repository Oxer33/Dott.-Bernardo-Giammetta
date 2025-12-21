// =============================================================================
// ADMIN STATS - DOTT. BERNARDO GIAMMETTA
// Statistiche e panoramica per la dashboard admin (DATI REALI)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Check,
  X,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

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
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
  };
}

interface Stats {
  todayCount: number;
  weekCount: number;
  totalPatients: number;
  attendanceRate: number;
}

interface Activity {
  action: string;
  details: string;
  time: string;
}

// =============================================================================
// COMPONENTE ADMIN STATS
// =============================================================================

export function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ todayCount: 0, weekCount: 0, totalPatients: 0, attendanceRate: 0 });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Carica dati reali
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/appointments?filter=today');
      const data = await res.json();
      
      if (data.success) {
        setAppointments(data.appointments);
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      // Log solo in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Errore caricamento stats:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Azioni rapide sugli appuntamenti
  const handleAction = async (appointmentId: string, action: 'confirm' | 'cancel' | 'complete') => {
    setActionLoading(appointmentId);
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, action }),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (error) {
      // Log solo in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Errore azione:', error);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Helper per nome paziente
  const getPatientName = (apt: Appointment) => {
    if (apt.user.firstName && apt.user.lastName) {
      return `${apt.user.firstName} ${apt.user.lastName}`;
    }
    return apt.user.name || apt.user.email.split('@')[0];
  };

  // Helper per tipo visita
  const getVisitType = (type: string) => {
    switch (type) {
      case 'FIRST_VISIT': return 'Prima Visita';
      case 'FOLLOW_UP': return 'Controllo';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 border border-sage-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-sage-100">
              <Calendar className="w-5 h-5 text-sage-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sage-900 mb-1">{stats.todayCount}</div>
          <div className="text-sm text-sage-600">Appuntamenti Oggi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-sage-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sage-900 mb-1">{stats.weekCount}</div>
          <div className="text-sm text-sage-600">Appuntamenti Settimana</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-sage-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sage-900 mb-1">{stats.totalPatients}</div>
          <div className="text-sm text-sage-600">Pazienti Attivi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 border border-sage-100 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sage-900 mb-1">{stats.attendanceRate}%</div>
          <div className="text-sm text-sage-600">Tasso Presenze</div>
        </motion.div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appuntamenti oggi */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-sage-100 shadow-sm"
        >
          <div className="p-5 border-b border-sage-100 flex items-center justify-between">
            <h3 className="font-semibold text-sage-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sage-500" />
              Appuntamenti di Oggi
            </h3>
            <button onClick={loadData} className="p-1 hover:bg-sage-100 rounded">
              <RefreshCw className="w-4 h-4 text-sage-500" />
            </button>
          </div>
          <div className="divide-y divide-sage-50">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-sage-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-sage-300" />
                <p>Nessun appuntamento per oggi</p>
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-sage-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-sage-500 w-14">
                      {format(new Date(apt.startTime), 'HH:mm')}
                    </div>
                    <div>
                      <div className="font-medium text-sage-800">{getPatientName(apt)}</div>
                      <div className="text-sm text-sage-500">{getVisitType(apt.type)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {actionLoading === apt.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-sage-400" />
                    ) : (
                      <>
                        {apt.status === 'CONFIRMED' && (
                          <>
                            <span className="flex items-center gap-1 text-green-600 text-sm mr-2">
                              <CheckCircle className="w-4 h-4" />
                            </span>
                            <button
                              onClick={() => handleAction(apt.id, 'complete')}
                              className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              title="Segna come completato"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(apt.id, 'cancel')}
                              className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Cancella"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {apt.status === 'COMPLETED' && (
                          <span className="flex items-center gap-1 text-blue-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Completato
                          </span>
                        )}
                        {apt.status === 'CANCELLED' && (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <XCircle className="w-4 h-4" />
                            Cancellato
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
        
        {/* Attività recenti */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl border border-sage-100 shadow-sm"
        >
          <div className="p-5 border-b border-sage-100">
            <h3 className="font-semibold text-sage-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sage-500" />
              Attività Recenti
            </h3>
          </div>
          <div className="divide-y divide-sage-50">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-sage-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-sage-300" />
                <p>Nessuna attività recente</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-sage-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sage-800">{activity.action}</div>
                      <div className="text-sm text-sage-500">{activity.details}</div>
                    </div>
                    <div className="text-xs text-sage-400">{activity.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
