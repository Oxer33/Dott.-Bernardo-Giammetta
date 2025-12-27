// =============================================================================
// ADMIN STATS - DOTT. BERNARDO GIAMMETTA
// Statistiche complete con grafici e dati reali dal database
// Punto 4: Contatori visite, cancellazioni, picchi orari/giorni/mesi
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  BarChart3,
  CalendarDays,
  UserPlus
} from 'lucide-react';

// =============================================================================
// TIPI
// =============================================================================

interface StatsData {
  completed: {
    weekly: number;
    weeklyTrend: number;
    monthly: number;
    monthlyTrend: number;
    yearly: number;
  };
  cancelled: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
  peaks: {
    hour: { time: string; count: number } | null;
    day: { name: string; count: number } | null;
    month: { name: string; count: number } | null;
  };
  distributions: {
    hourly: { [key: string]: number };
    daily: { [key: string]: number };
    monthly: { [key: string]: number };
  };
  patients: {
    total: number;
    whitelisted: number;
    pending: number;
    newThisMonth: number;
    // Punto 4: maschi/femmine
    male: number;
    female: number;
    malePercentage: number;
    femalePercentage: number;
  };
  rates: {
    completion: number;
  };
  monthlyTrend: Array<{ month: string; completed: number; cancelled: number }>;
}

// =============================================================================
// COMPONENTE STAT CARD
// =============================================================================

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  trend,
  subtitle
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType;
  color: string;
  trend?: number;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-sage-100 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && trend !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-sage-900">{value}</div>
      <div className="text-sm text-sage-600">{title}</div>
      {subtitle && <div className="text-xs text-sage-400 mt-1">{subtitle}</div>}
    </div>
  );
}

// =============================================================================
// COMPONENTE MINI BAR CHART
// =============================================================================

function MiniBarChart({ data, label }: { data: { [key: string]: number }; label: string }) {
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([, v]) => v), 1);
  
  return (
    <div className="bg-white rounded-xl p-4 border border-sage-100 shadow-sm">
      <h4 className="text-sm font-medium text-sage-700 mb-3">{label}</h4>
      <div className="flex items-end gap-1 h-24">
        {entries.map(([key, value]) => (
          <div key={key} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-sage-200 rounded-t transition-all hover:bg-sage-300"
              style={{ height: `${(value / maxValue) * 100}%`, minHeight: value > 0 ? '4px' : '0' }}
              title={`${key}: ${value}`}
            />
            <span className="text-[9px] text-sage-500 mt-1 truncate w-full text-center">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTE TREND CHART
// =============================================================================

function TrendChart({ data }: { data: Array<{ month: string; completed: number; cancelled: number }> }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.completed, d.cancelled)), 1);
  
  return (
    <div className="bg-white rounded-xl p-4 border border-sage-100 shadow-sm">
      <h4 className="text-sm font-medium text-sage-700 mb-3">Trend Ultimi 6 Mesi</h4>
      <div className="flex items-end gap-2 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex gap-0.5 w-full items-end h-24">
              <div 
                className="flex-1 bg-green-300 rounded-t"
                style={{ height: `${(item.completed / maxValue) * 100}%`, minHeight: item.completed > 0 ? '4px' : '0' }}
                title={`Completate: ${item.completed}`}
              />
              <div 
                className="flex-1 bg-red-300 rounded-t"
                style={{ height: `${(item.cancelled / maxValue) * 100}%`, minHeight: item.cancelled > 0 ? '4px' : '0' }}
                title={`Cancellate: ${item.cancelled}`}
              />
            </div>
            <span className="text-[10px] text-sage-500">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-300 rounded" /> Completate</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-300 rounded" /> Cancellate</span>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTE ADMIN STATS
// =============================================================================

export function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carica dati statistiche
  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Errore nel caricamento');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-red-300 mx-auto mb-2" />
        <p className="text-sage-600">{error || 'Impossibile caricare le statistiche'}</p>
        <button onClick={loadStats} className="mt-4 px-4 py-2 bg-sage-100 rounded-lg text-sage-700 hover:bg-sage-200">
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-sage-800">Statistiche Complete</h2>
        <button 
          onClick={loadStats} 
          className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
          title="Aggiorna"
        >
          <RefreshCw className="w-5 h-5 text-sage-500" />
        </button>
      </div>

      {/* Sezione: Visite Completate */}
      <div>
        <h3 className="text-sm font-medium text-sage-600 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Visite Completate
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard 
            title="Questa Settimana" 
            value={stats.completed.weekly}
            icon={Calendar}
            color="bg-green-100 text-green-600"
            trend={stats.completed.weeklyTrend}
            subtitle="vs settimana scorsa"
          />
          <StatCard 
            title="Questo Mese" 
            value={stats.completed.monthly}
            icon={CalendarDays}
            color="bg-green-100 text-green-600"
            trend={stats.completed.monthlyTrend}
            subtitle="vs mese scorso"
          />
          <StatCard 
            title="Quest'Anno" 
            value={stats.completed.yearly}
            icon={BarChart3}
            color="bg-green-100 text-green-600"
          />
        </div>
      </div>

      {/* Sezione: Visite Cancellate */}
      <div>
        <h3 className="text-sm font-medium text-sage-600 mb-3 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-500" />
          Visite Cancellate
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard 
            title="Questa Settimana" 
            value={stats.cancelled.weekly}
            icon={Calendar}
            color="bg-red-100 text-red-600"
          />
          <StatCard 
            title="Questo Mese" 
            value={stats.cancelled.monthly}
            icon={CalendarDays}
            color="bg-red-100 text-red-600"
          />
          <StatCard 
            title="Quest'Anno" 
            value={stats.cancelled.yearly}
            icon={BarChart3}
            color="bg-red-100 text-red-600"
          />
        </div>
      </div>

      {/* Sezione: Picchi di Affluenza */}
      <div>
        <h3 className="text-sm font-medium text-sage-600 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          Picchi di Affluenza
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {stats.peaks.hour && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Fascia Oraria Top</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{stats.peaks.hour.time}</div>
              <div className="text-sm text-blue-600">{stats.peaks.hour.count} visite</div>
            </div>
          )}
          {stats.peaks.day && (
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Giorno Top</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{stats.peaks.day.name}</div>
              <div className="text-sm text-purple-600">{stats.peaks.day.count} visite</div>
            </div>
          )}
          {stats.peaks.month && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Mese Top</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{stats.peaks.month.name}</div>
              <div className="text-sm text-orange-600">{stats.peaks.month.count} visite</div>
            </div>
          )}
        </div>
      </div>

      {/* Grafici Distribuzioni */}
      <div className="grid lg:grid-cols-3 gap-4">
        <MiniBarChart data={stats.distributions.hourly} label="Distribuzione Oraria" />
        <MiniBarChart data={stats.distributions.daily} label="Distribuzione Settimanale" />
        <MiniBarChart data={stats.distributions.monthly} label="Distribuzione Mensile" />
      </div>

      {/* Trend Mensile */}
      <TrendChart data={stats.monthlyTrend} />

      {/* Sezione: Pazienti */}
      <div>
        <h3 className="text-sm font-medium text-sage-600 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-500" />
          Pazienti
        </h3>
        <div className="grid sm:grid-cols-4 gap-4">
          <StatCard 
            title="Totali" 
            value={stats.patients.total}
            icon={Users}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard 
            title="Approvati" 
            value={stats.patients.whitelisted}
            icon={CheckCircle}
            color="bg-green-100 text-green-600"
          />
          <StatCard 
            title="In Attesa" 
            value={stats.patients.pending}
            icon={Clock}
            color="bg-orange-100 text-orange-600"
          />
          <StatCard 
            title="Nuovi Questo Mese" 
            value={stats.patients.newThisMonth}
            icon={UserPlus}
            color="bg-blue-100 text-blue-600"
          />
        </div>
        
        {/* Punto 4: Card Maschi/Femmine */}
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Maschi</p>
                <p className="text-2xl font-bold text-blue-900">{stats.patients.male}</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-700">{stats.patients.malePercentage}%</span>
                </div>
              </div>
            </div>
            <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${stats.patients.malePercentage}%` }}
              />
            </div>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-800">Femmine</p>
                <p className="text-2xl font-bold text-pink-900">{stats.patients.female}</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-pink-700">{stats.patients.femalePercentage}%</span>
                </div>
              </div>
            </div>
            <div className="mt-2 bg-pink-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${stats.patients.femalePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasso Completamento */}
      <div className="bg-gradient-to-r from-sage-500 to-sage-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Tasso di Completamento</h3>
            <p className="text-sage-100 text-sm">Percentuale visite completate su totale prenotate (anno corrente)</p>
          </div>
          <div className="text-4xl font-bold">{stats.rates.completion}%</div>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${stats.rates.completion}%` }}
          />
        </div>
      </div>
    </div>
  );
}
