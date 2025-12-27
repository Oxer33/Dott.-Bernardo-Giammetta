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
  Activity,
  Home,
  UserCheck
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
    pendingWithVisits: 0, // Punto 3: pazienti in attesa con visite effettuate
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
        
        // Punto 3: Carica anche pazienti in attesa con visite
        const resPendingWithVisits = await fetch('/api/admin/patients?filter=pending_with_visits');
        const dataPendingWithVisits = await resPendingWithVisits.json();
        
        setStats({
          totalAppointments: user.appointments.length,
          weekAppointments,
          totalPatients: data.success ? data.stats.whitelisted : 0,
          pendingRequests: data.success ? data.stats.pending : 0,
          pendingWithVisits: dataPendingWithVisits.success ? dataPendingWithVisits.patients.length : 0,
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
          pendingWithVisits: 0,
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
            <Link href="/agenda">
              <Button className="bg-lavender-500 hover:bg-lavender-600" size="sm">
                <CalendarPlus className="w-4 h-4" />
                <span>Nuova Prenotazione</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Bottoni navigazione master (come in admin) - punto 2 e 6 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/area-personale"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-sage-500 text-white shadow-md"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/agenda"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-lavender-100 text-lavender-700 hover:bg-lavender-200 border border-lavender-200"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Agenda</span>
          </Link>
          <Link
            href="/admin?tab=appointments"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Appuntamenti</span>
          </Link>
          <Link
            href="/admin?tab=whitelist"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Whitelist</span>
          </Link>
          <Link
            href="/admin?tab=timeblocks"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Blocchi</span>
          </Link>
          <Link
            href="/admin?tab=stats"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Statistiche</span>
          </Link>
        </div>

        {/* Cards statistiche in attesa */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Richieste in Attesa */}
          {stats.pendingRequests > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/admin?tab=whitelist">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 hover:bg-orange-100 transition-colors cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                        <UserPlus className="w-7 h-7 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Richieste in Attesa</p>
                        <p className="text-3xl font-bold text-orange-700">{stats.pendingRequests}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
          
          {/* Punto 3: In Attesa con Visita Effettuata */}
          {stats.pendingWithVisits > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Link href="/admin?tab=whitelist">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 hover:bg-purple-100 transition-colors cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm font-medium">In Attesa con Visita</p>
                        <p className="text-3xl font-bold text-purple-700">{stats.pendingWithVisits}</p>
                        <p className="text-xs text-purple-500">Da approvare dopo visita</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
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
      </div>
    </div>
  );
}
