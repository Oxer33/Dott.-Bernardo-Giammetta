// =============================================================================
// WHITELIST MANAGER - DOTT. BERNARDO GIAMMETTA
// Gestione whitelist pazienti per admin (con API reali)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
  AlertCircle,
  ExternalLink
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
  const [filter, setFilter] = useState<'all' | 'whitelisted' | 'pending' | 'pending_with_visits' | 'pending_without_visits'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Modal di conferma centrale
  const [showConfirmModal, setShowConfirmModal] = useState<{
    type: 'remove' | 'delete';
    patientId: string;
    patientName: string;
  } | null>(null);

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
        setActionError(data.error || 'Errore');
      }
    } catch (err) {
      setActionError('Errore di connessione');
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
        setActionError(data.error || 'Errore');
      }
    } catch (err) {
      setActionError('Errore di connessione');
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
        <div className="flex flex-wrap gap-2">
          {/* Filtri principali */}
          {(['all', 'whitelisted', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-sage-500 text-white'
                  : 'bg-white text-sage-600 border border-sage-200 hover:bg-sage-50'
              }`}
            >
              {f === 'all' ? 'Tutti' : f === 'whitelisted' ? 'Approvati' : 'In Attesa'}
            </button>
          ))}
          {/* Filtri avanzati per pazienti in attesa (punto 10) */}
          <button
            onClick={() => setFilter('pending_with_visits')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === 'pending_with_visits'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50'
            }`}
            title="In attesa con visite prenotate"
          >
            <span className="hidden sm:inline">Attesa + Visite</span>
            <span className="sm:hidden">📅</span>
          </button>
          <button
            onClick={() => setFilter('pending_without_visits')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === 'pending_without_visits'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50'
            }`}
            title="In attesa senza visite"
          >
            <span className="hidden sm:inline">Attesa No Visite</span>
            <span className="sm:hidden">⏳</span>
          </button>
          <button
            onClick={loadPatients}
            className="p-2 bg-white border border-sage-200 rounded-xl hover:bg-sage-50 transition-colors"
            title="Aggiorna"
          >
            <RefreshCw className={`w-5 h-5 text-sage-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Errore caricamento */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Errore azione */}
      {actionError && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="text-orange-700">{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-orange-500 hover:text-orange-700">✕</button>
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
              {/* Bottone Apri a sinistra */}
              <Link
                href={`/admin/paziente/${patient.id}`}
                className="px-3 py-1.5 bg-lavender-100 text-lavender-700 text-sm rounded-lg hover:bg-lavender-200 transition-colors whitespace-nowrap flex items-center gap-1 mr-4"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Apri</span>
              </Link>
              
              <div className="flex items-center gap-4 flex-1">
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
                    <div className="flex flex-wrap gap-1 justify-end">
                      {!patient.isWhitelisted ? (
                        <button
                          onClick={() => handleWhitelist(patient.id, 'whitelist')}
                          className="px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                        >
                          Approva
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowConfirmModal({
                            type: 'remove',
                            patientId: patient.id,
                            patientName: patient.firstName && patient.lastName 
                              ? `${patient.firstName} ${patient.lastName}`
                              : patient.name || patient.email
                          })}
                          className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-600 text-xs sm:text-sm rounded-lg hover:bg-orange-200 transition-colors whitespace-nowrap"
                        >
                          Rimuovi
                        </button>
                      )}
                      <button
                        onClick={() => setShowConfirmModal({
                          type: 'delete',
                          patientId: patient.id,
                          patientName: patient.firstName && patient.lastName 
                            ? `${patient.firstName} ${patient.lastName}`
                            : patient.name || patient.email
                        })}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                        title="Elimina paziente"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Modal di conferma centrale */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              {showConfirmModal.type === 'remove' ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <UserX className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-900 mb-2">
                    Rimuovere {showConfirmModal.patientName}?
                  </h3>
                  <p className="text-sage-600 mb-6">
                    Questa azione <strong>toglierà al paziente la possibilità di prenotare visite</strong>. 
                    Il paziente dovrà essere nuovamente approvato per poter accedere all&apos;agenda.
                    I suoi dati e lo storico appuntamenti verranno mantenuti.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-900 mb-2">
                    Eliminare {showConfirmModal.patientName}?
                  </h3>
                  <p className="text-sage-600 mb-2">
                    <strong className="text-red-600">⚠️ ATTENZIONE: Azione irreversibile!</strong>
                  </p>
                  <p className="text-sage-600 mb-6">
                    Questa azione <strong>eliminerà definitivamente tutti i dati del paziente</strong>, 
                    inclusi questionari, appuntamenti e storico visite. 
                    Non sarà possibile recuperare questi dati.
                  </p>
                </>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmModal(null)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={async () => {
                    if (showConfirmModal.type === 'remove') {
                      await handleWhitelist(showConfirmModal.patientId, 'unwhitelist');
                    } else {
                      await handleDelete(showConfirmModal.patientId);
                    }
                    setShowConfirmModal(null);
                  }}
                  className={`px-6 py-2.5 text-white rounded-xl font-medium transition-colors ${
                    showConfirmModal.type === 'remove' 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {showConfirmModal.type === 'remove' ? 'Rimuovi' : 'Elimina definitivamente'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
