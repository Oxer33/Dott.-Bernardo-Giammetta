// =============================================================================
// ADMIN STATS - DOTT. BERNARDO GIAMMETTA
// Statistiche e panoramica per la dashboard admin
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// =============================================================================
// DATI MOCK (da sostituire con dati reali dal database)
// =============================================================================

const stats = [
  {
    label: 'Appuntamenti Oggi',
    value: '4',
    change: '+2 da ieri',
    trend: 'up',
    icon: Calendar,
    color: 'sage',
  },
  {
    label: 'Appuntamenti Settimana',
    value: '18',
    change: '+5 da settimana scorsa',
    trend: 'up',
    icon: Clock,
    color: 'blue',
  },
  {
    label: 'Pazienti Totali',
    value: '156',
    change: '+12 questo mese',
    trend: 'up',
    icon: Users,
    color: 'purple',
  },
  {
    label: 'Tasso Presenze',
    value: '94%',
    change: '+2% da mese scorso',
    trend: 'up',
    icon: TrendingUp,
    color: 'green',
  },
];

const todayAppointments = [
  { time: '09:00', patient: 'Mario Rossi', type: 'Controllo', status: 'confirmed' },
  { time: '10:30', patient: 'Laura Bianchi', type: 'Prima Visita', status: 'confirmed' },
  { time: '14:00', patient: 'Giuseppe Verdi', type: 'Controllo', status: 'pending' },
  { time: '16:00', patient: 'Anna Neri', type: 'Controllo', status: 'confirmed' },
];

const recentActivity = [
  { action: 'Nuova prenotazione', details: 'Mario Rossi - 20 Gen 09:00', time: '5 min fa' },
  { action: 'Cancellazione', details: 'Lucia Gialli - 22 Gen 11:00', time: '1 ora fa' },
  { action: 'Nuovo paziente whitelist', details: 'Paolo Azzurri', time: '2 ore fa' },
  { action: 'Visita completata', details: 'Sara Marroni', time: '3 ore fa' },
];

// =============================================================================
// COMPONENTE ADMIN STATS
// =============================================================================

export function AdminStats() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 border border-sage-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-sage-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-sage-600">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appuntamenti oggi */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-sage-100 shadow-sm"
        >
          <div className="p-5 border-b border-sage-100">
            <h3 className="font-semibold text-sage-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sage-500" />
              Appuntamenti di Oggi
            </h3>
          </div>
          <div className="divide-y divide-sage-50">
            {todayAppointments.map((apt, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-sage-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-sage-500 w-14">
                    {apt.time}
                  </div>
                  <div>
                    <div className="font-medium text-sage-800">{apt.patient}</div>
                    <div className="text-sm text-sage-500">{apt.type}</div>
                  </div>
                </div>
                <div>
                  {apt.status === 'confirmed' ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Confermato
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      In attesa
                    </span>
                  )}
                </div>
              </div>
            ))}
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
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-sage-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sage-800">{activity.action}</div>
                    <div className="text-sm text-sage-500">{activity.details}</div>
                  </div>
                  <div className="text-xs text-sage-400">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
