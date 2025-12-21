// =============================================================================
// MASTER DASHBOARD - AREA PERSONALE
// Dashboard completa per account master/admin
// Gestione appuntamenti, whitelist, blocchi orari, statistiche
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Clock, 
  Settings,
  BarChart3,
  UserPlus,
  UserMinus,
  CalendarPlus,
  CalendarX,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format, startOfWeek, endOfWeek, isToday, isTomorrow } from 'date-fns';
import { it } from 'date-fns/locale';

// =============================================================================
// TIPI
// =============================================================================

interface Appointment {
  id: string;
  startTime: Date;
  duration: number;
  type: string;
  status: string;
  notes?: string | null;
}

interface MasterDashboardProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    appointments: Appointment[];
  };
}

// =============================================================================
// COMPONENTE STAT CARD
// =============================================================================

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'sage',
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  color?: 'sage' | 'lavender' | 'orange';
  trend?: string;
}) {
  const colorClasses = {
    sage: 'bg-sage-100 text-sage-600',
    lavender: 'bg-lavender-100 text-lavender-600',
    orange: 'bg-orange-100 text-orange-500',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-sage-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sage-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-sage-900">{value}</p>
          {trend && (
            <p className="text-xs text-sage-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function MasterDashboard({ user }: MasterDashboardProps) {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    weekAppointments: 0,
    totalPatients: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  // Carica statistiche reali dal database
  useEffect(() => {
    async function loadStats() {
      try {
        // Carica statistiche pazienti da API
        const res = await fetch('/api/admin/patients?filter=all');
        const data = await res.json();
        
        const weekAppointments = user.appointments.filter(a => {
          const date = new Date(a.startTime);
          const now = new Date();
          const weekStart = startOfWeek(now, { locale: it });
          const weekEnd = endOfWeek(now, { locale: it });
          return date >= weekStart && date <= weekEnd;
        }).length;
        
        setStats({
          totalAppointments: user.appointments.length,
          weekAppointments,
          totalPatients: data.success ? data.stats.whitelisted : 0,
          pendingRequests: data.success ? data.stats.pending : 0,
        });
      } catch (error) {
        // Log solo in development
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error loading stats:', error);
        }
        // Fallback senza dati mock
        setStats({
          totalAppointments: user.appointments.length,
          weekAppointments: 0,
          totalPatients: 0,
          pendingRequests: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user.appointments]);

  // Appuntamenti di oggi e domani
  const todayAppointments = user.appointments.filter(a => 
    isToday(new Date(a.startTime))
  );
  const tomorrowAppointments = user.appointments.filter(a => 
    isTomorrow(new Date(a.startTime))
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                <Settings className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-sage-900">
                  Dashboard Master
                </h1>
                <p className="text-sage-600">Benvenuto, {user.name?.split(' ')[0] || 'Admin'}!</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/admin">
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Button>
              </Link>
              <Link href="/agenda">
                <Button className="bg-lavender-500 hover:bg-lavender-600" size="sm">
                  <CalendarPlus className="w-4 h-4" />
                  <span>Nuovo Appuntamento</span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Statistiche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            title="Appuntamenti Totali"
            value={stats.totalAppointments}
            icon={Calendar}
            color="sage"
          />
          <StatCard
            title="Questa Settimana"
            value={stats.weekAppointments}
            icon={Activity}
            color="lavender"
          />
          <StatCard
            title="Pazienti Attivi"
            value={stats.totalPatients}
            icon={Users}
            color="sage"
          />
          <StatCard
            title="Richieste in Attesa"
            value={stats.pendingRequests}
            icon={UserPlus}
            color="orange"
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonna principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appuntamenti di oggi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-lavender-100"
            >
              <h2 className="text-xl font-semibold text-sage-800 flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-lavender-500" />
                Appuntamenti Oggi
                <span className="ml-auto text-sm font-normal text-sage-500">
                  {format(new Date(), "EEEE d MMMM", { locale: it })}
                </span>
              </h2>

              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-4 bg-sage-50 rounded-xl border border-sage-100"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-sage-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sage-800">
                          {format(new Date(appointment.startTime), "HH:mm")} - {appointment.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Controllo'}
                        </p>
                        <p className="text-sm text-sage-600">
                          Durata: {appointment.duration} minuti
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {appointment.status === 'CONFIRMED' ? 'Confermato' : appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sage-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-sage-300" />
                  <p>Nessun appuntamento per oggi</p>
                </div>
              )}
            </motion.div>

            {/* Appuntamenti di domani */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-sage-100"
            >
              <h2 className="text-xl font-semibold text-sage-800 flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-sage-500" />
                Domani
              </h2>

              {tomorrowAppointments.length > 0 ? (
                <div className="space-y-3">
                  {tomorrowAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-3 bg-cream-50 rounded-lg"
                    >
                      <Clock className="w-5 h-5 text-sage-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-sage-700">
                          {format(new Date(appointment.startTime), "HH:mm")} - {appointment.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Controllo'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-sage-500 text-sm">
                  Nessun appuntamento per domani
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Azioni rapide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-lavender-100"
            >
              <h3 className="font-semibold text-sage-800 mb-4">Azioni Rapide</h3>
              <div className="space-y-3">
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-sage-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center group-hover:bg-sage-200 transition-colors">
                    <Users className="w-5 h-5 text-sage-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sage-800">Gestisci Whitelist</p>
                    <p className="text-xs text-sage-500">Aggiungi o rimuovi pazienti</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sage-400" />
                </Link>
                
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-lavender-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center group-hover:bg-lavender-200 transition-colors">
                    <CalendarX className="w-5 h-5 text-lavender-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sage-800">Blocca Orari</p>
                    <p className="text-xs text-sage-500">Imposta indisponibilità</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sage-400" />
                </Link>

                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sage-800">Statistiche</p>
                    <p className="text-xs text-sage-500">Report e analisi</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sage-400" />
                </Link>
              </div>
            </motion.div>

            {/* Info account */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-lavender-100 to-lavender-50 rounded-2xl p-6 border border-lavender-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-lavender-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-lavender-800 mb-1">Account Master</h4>
                  <p className="text-sm text-lavender-700">
                    Hai accesso completo a tutte le funzionalità. Puoi prenotare senza restrizioni.
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
