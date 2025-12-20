// =============================================================================
// WHITELIST MANAGER - DOTT. BERNARDO GIAMMETTA
// Gestione whitelist pazienti per admin (con API reali)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  MoreVertical,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';

// =============================================================================
// TIPI
// =============================================================================

interface Patient {
  id: string;
  name: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isWhitelisted: boolean;
  whitelistedAt: string | null;
  codiceFiscale: string | null;
  city: string | null;
  createdAt: string;
  lastVisitAt: string | null;
  _count: { appointments: number };
}

interface Stats {
  total: number;
  whitelisted: number;
  pending: number;
}

// =============================================================================
// COMPONENTE WHITELIST MANAGER
// =============================================================================

export function WhitelistManager() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, whitelisted: 0, pending: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'whitelisted' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Carica pazienti dal database
  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('filter', filter);
      if (searchQuery.length >= 2) params.set('search', searchQuery);
      
      const res = await fetch(`/api/admin/patients?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setPatients(data.patients);
        setStats(data.stats);
      } else {
        setError(data.error || 'Errore nel caricamento');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  // Carica al mount e quando cambiano i filtri
  useEffect(() => {
    loadPatients();
  }, [filter]);

  // Ricerca con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length >= 2) {
        loadPatients();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Azioni paziente
  const handleWhitelist = async (patientId: string, action: 'whitelist' | 'unwhitelist') => {
    setActionLoading(patientId);
    try {
      const res = await fetch('/api/admin/patients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, action }),
      });
      const data = await res.json();
      if (data.success) {
        loadPatients();
      } else {
        alert(data.error || 'Errore');
      }
    } catch (err) {
      alert('Errore di connessione');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (patientId: string) => {
    setActionLoading(patientId);
    try {
      const res = await fetch(`/api/admin/patients?id=${patientId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        loadPatients();
      } else {
        alert(data.error || 'Errore');
      }
    } catch (err) {
      alert('Errore di connessione');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats rapide */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-sage-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-900">{stats.whitelisted}</div>
              <div className="text-sm text-sage-600">In Whitelist</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-sage-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-900">{stats.pending}</div>
              <div className="text-sm text-sage-600">In Attesa</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-sage-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-900">{stats.total}</div>
              <div className="text-sm text-sage-600">Pazienti Totali</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtri */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
          <input
            type="text"
            placeholder="Cerca per nome o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'whitelisted', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === f
                  ? 'bg-sage-500 text-white'
                  : 'bg-white text-sage-600 border border-sage-200 hover:bg-sage-50'
              }`}
            >
              {f === 'all' ? 'Tutti' : f === 'whitelisted' ? 'Approvati' : 'In Attesa'}
            </button>
          ))}
          <button
            onClick={loadPatients}
            className="p-2 bg-white border border-sage-200 rounded-xl hover:bg-sage-50 transition-colors"
            title="Aggiorna"
          >
            <RefreshCw className={`w-5 h-5 text-sage-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Errore */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {/* Lista pazienti */}
      <div className="bg-white rounded-xl border border-sage-100 divide-y divide-sage-50">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-sage-400 animate-spin mx-auto mb-2" />
            <p className="text-sage-600">Caricamento pazienti...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center">
            <UserX className="w-12 h-12 text-sage-300 mx-auto mb-2" />
            <p className="text-sage-600">Nessun paziente trovato</p>
            <p className="text-sm text-sage-500">I pazienti appariranno qui dopo la registrazione</p>
          </div>
        ) : (
          patients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4 flex items-center justify-between hover:bg-sage-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  patient.isWhitelisted ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {patient.isWhitelisted ? (
                    <UserCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <UserPlus className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sage-800">
                    {patient.firstName && patient.lastName 
                      ? `${patient.firstName} ${patient.lastName}`
                      : patient.name || 'Nome non specificato'}
                  </div>
                  <div className="text-sm text-sage-500">{patient.email}</div>
                  {patient.phone && (
                    <div className="text-xs text-sage-400">{patient.phone}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Info aggiuntive */}
                <div className="hidden md:block text-right text-sm">
                  {patient._count.appointments > 0 && (
                    <div className="text-sage-600">{patient._count.appointments} appuntamenti</div>
                  )}
                  {patient.whitelistedAt && (
                    <div className="text-sage-400 text-xs">
                      Approvato: {new Date(patient.whitelistedAt).toLocaleDateString('it-IT')}
                    </div>
                  )}
                </div>
                
                {/* Azioni */}
                <div className="flex items-center gap-2">
                  {actionLoading === patient.id ? (
                    <Loader2 className="w-5 h-5 text-sage-400 animate-spin" />
                  ) : deleteConfirm === patient.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Conferma
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annulla
                      </button>
                    </>
                  ) : (
                    <>
                      {!patient.isWhitelisted ? (
                        <button
                          onClick={() => handleWhitelist(patient.id, 'whitelist')}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Approva
                        </button>
                      ) : (
                        <button
                          onClick={() => handleWhitelist(patient.id, 'unwhitelist')}
                          className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-lg hover:bg-orange-200 transition-colors"
                        >
                          Rimuovi
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(patient.id)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                        title="Elimina paziente"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
