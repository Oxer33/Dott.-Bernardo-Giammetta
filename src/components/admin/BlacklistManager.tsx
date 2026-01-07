// =============================================================================
// BLACKLIST MANAGER - GESTIONE PAZIENTI IN BLACKLIST
// Visualizza pazienti bloccati e recidivi (rientrati in blacklist più volte)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  UserMinus, 
  UserPlus, 
  AlertTriangle, 
  RefreshCw,
  Calendar,
  Home,
  CalendarPlus,
  UserCheck,
  Lock,
  BarChart3,
  Users,
  Mail,
  Phone,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// =============================================================================
// TIPI
// =============================================================================

interface BlacklistedUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  isWhitelisted: boolean;
  whitelistedAt: string | null;
  createdAt: string;
  // Conteggio cancellazioni recenti (ultimi 30gg)
  recentCancellations: number;
  // Storico: quante volte è stato in blacklist
  blacklistCount: number;
  // Ultima cancellazione
  lastCancellationDate: string | null;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export function BlacklistManager() {
  const [blacklistedUsers, setBlacklistedUsers] = useState<BlacklistedUser[]>([]);
  const [recidivists, setRecidivists] = useState<BlacklistedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch dati blacklist
  const fetchBlacklist = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/blacklist');
      const data = await response.json();
      
      if (data.success) {
        setBlacklistedUsers(data.blacklisted || []);
        setRecidivists(data.recidivists || []);
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
    fetchBlacklist();
  }, []);

  // Rimuovi dalla blacklist (riporta in whitelist)
  const handleRemoveFromBlacklist = async (userId: string) => {
    setActionLoading(userId);
    
    try {
      const response = await fetch('/api/admin/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'remove' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchBlacklist(); // Ricarica
      } else {
        setError(data.error || 'Errore');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-lavender-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <UserMinus className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-sage-900">
                Gestione Blacklist
              </h1>
              <p className="text-sage-600">
                Pazienti bloccati per troppe cancellazioni
              </p>
            </div>
          </div>
        </motion.div>

        {/* Menu navigazione */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/area-personale"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/agenda"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
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
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Blocchi</span>
          </Link>
          <Link
            href="/admin?tab=stats"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Statistiche</span>
          </Link>
          <Link
            href="/admin?tab=blacklist"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-red-500 text-white shadow-md"
          >
            <UserMinus className="w-4 h-4" />
            <span className="hidden sm:inline">Blacklist</span>
          </Link>
        </div>

        {/* Errore */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
            <button onClick={() => setError(null)} className="ml-2 underline">Chiudi</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-sage-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Sezione: Pazienti in Blacklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-sage-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-sage-800 flex items-center gap-2">
                  <UserMinus className="w-5 h-5 text-red-500" />
                  Pazienti in Blacklist
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-sm rounded-full">
                    {blacklistedUsers.length}
                  </span>
                </h2>
                <Button variant="secondary" size="sm" onClick={fetchBlacklist}>
                  <RefreshCw className="w-4 h-4" />
                  Aggiorna
                </Button>
              </div>

              {blacklistedUsers.length === 0 ? (
                <div className="text-center py-8 text-sage-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p>Nessun paziente in blacklist</p>
                  <p className="text-sm">Ottimo! Tutti i pazienti sono in regola.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blacklistedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 bg-red-50 rounded-xl border border-red-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sage-800">
                              {user.name || 'Nome non disponibile'}
                            </p>
                            <p className="text-sm text-sage-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-red-600">
                              {user.recentCancellations} cancellazioni
                            </p>
                            <p className="text-xs text-sage-500">negli ultimi 30gg</p>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleRemoveFromBlacklist(user.id)}
                            isLoading={actionLoading === user.id}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <UserPlus className="w-4 h-4" />
                            Sblocca
                          </Button>
                        </div>
                      </div>
                      
                      {/* Dettagli espandibili */}
                      <button
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        className="mt-2 text-sm text-sage-500 flex items-center gap-1 hover:text-sage-700"
                      >
                        {expandedUser === user.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expandedUser === user.id ? 'Nascondi dettagli' : 'Mostra dettagli'}
                      </button>
                      
                      {expandedUser === user.id && (
                        <div className="mt-3 pt-3 border-t border-red-200 grid sm:grid-cols-2 gap-2 text-sm">
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sage-600">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sage-600">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          {user.lastCancellationDate && (
                            <div className="flex items-center gap-2 text-sage-600">
                              <Calendar className="w-4 h-4" />
                              Ultima cancellazione: {format(new Date(user.lastCancellationDate), 'd MMM yyyy', { locale: it })}
                            </div>
                          )}
                          {user.blacklistCount > 1 && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <AlertTriangle className="w-4 h-4" />
                              Recidivo: {user.blacklistCount} volte in blacklist
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Sezione: Pazienti Recidivi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-orange-100"
            >
              <h2 className="text-xl font-semibold text-sage-800 flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-orange-500" />
                Pazienti Recidivi
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-sm rounded-full">
                  {recidivists.length}
                </span>
              </h2>
              
              <p className="text-sage-600 text-sm mb-4">
                Pazienti che sono stati in blacklist più di una volta. Tieni d&apos;occhio questi pazienti.
              </p>

              {recidivists.length === 0 ? (
                <div className="text-center py-8 text-sage-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-sage-300" />
                  <p>Nessun paziente recidivo</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sage-100">
                        <th className="text-left py-2 px-3 text-sage-600 font-medium">Paziente</th>
                        <th className="text-left py-2 px-3 text-sage-600 font-medium">Email</th>
                        <th className="text-center py-2 px-3 text-sage-600 font-medium">Volte in Blacklist</th>
                        <th className="text-center py-2 px-3 text-sage-600 font-medium">Stato Attuale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recidivists.map((user) => (
                        <tr key={user.id} className="border-b border-sage-50 hover:bg-sage-50">
                          <td className="py-3 px-3 font-medium">{user.name || 'N/D'}</td>
                          <td className="py-3 px-3 text-sage-600">{user.email}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                              {user.blacklistCount}x
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {user.isWhitelisted ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                In whitelist
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                In blacklist
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Info box */}
            <div className="p-4 bg-lavender-50 rounded-xl border border-lavender-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-lavender-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-lavender-800">
                  <p className="font-medium mb-1">Come funziona la blacklist?</p>
                  <ul className="list-disc list-inside space-y-1 text-lavender-700">
                    <li>Un paziente entra in blacklist dopo 3 cancellazioni di appuntamenti futuri in 30 giorni</li>
                    <li>Quando prenoti un appuntamento per un paziente, il suo contatore si azzera automaticamente</li>
                    <li>I pazienti recidivi sono quelli che sono entrati in blacklist più di una volta</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
