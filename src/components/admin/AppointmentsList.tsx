// =============================================================================
// APPOINTMENTS LIST - DOTT. BERNARDO GIAMMETTA
// Lista e gestione appuntamenti per admin (DATI REALI)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Check,
  X,
  Trash2,
  FileText,
  Edit3,
  Phone,
  Mail
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
    codiceFiscale: string | null;
  };
}

// =============================================================================
// COMPONENTE APPOINTMENTS LIST
// =============================================================================

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  // Carica appuntamenti
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('filter', timeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.length >= 2) params.set('search', searchQuery);
      
      const res = await fetch(`/api/admin/appointments?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      // Log solo in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Errore caricamento:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [timeFilter, statusFilter]);

  // Ricerca con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length >= 2) {
        loadAppointments();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Azioni
  const handleAction = async (appointmentId: string, action: string, data?: any) => {
    setActionLoading(appointmentId);
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, action, data }),
      });
      const result = await res.json();
      if (result.success) {
        loadAppointments();
        setEditingNotes(null);
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

  const handleDelete = async (appointmentId: string) => {
    setActionLoading(appointmentId);
    try {
      const res = await fetch(`/api/admin/appointments?id=${appointmentId}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setDeleteConfirm(null);
        loadAppointments();
      }
    } catch (error) {
      // Log solo in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Errore eliminazione:', error);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Helper
  const getPatientName = (apt: Appointment) => {
    if (apt.user.firstName && apt.user.lastName) {
      return `${apt.user.firstName} ${apt.user.lastName}`;
    }
    return apt.user.name || apt.user.email.split('@')[0];
  };

  const getVisitType = (type: string) => {
    switch (type) {
      case 'FIRST_VISIT': return 'Prima Visita';
      case 'FOLLOW_UP': return 'Controllo';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Confermato</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" /> Cancellato</span>;
      case 'COMPLETED':
        return <span className="flex items-center gap-1 text-blue-600"><CheckCircle className="w-4 h-4" /> Completato</span>;
      default:
        return <span className="text-sage-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtri */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
          <input
            type="text"
            placeholder="Cerca paziente per nome o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
          >
            <option value="all">Tutti</option>
            <option value="today">Oggi</option>
            <option value="week">Questa settimana</option>
            <option value="upcoming">Prossimi</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
          >
            <option value="all">Tutti gli stati</option>
            <option value="CONFIRMED">Confermati</option>
            <option value="CANCELLED">Cancellati</option>
            <option value="COMPLETED">Completati</option>
          </select>
          <button
            onClick={loadAppointments}
            className="p-2 bg-white border border-sage-200 rounded-xl hover:bg-sage-50"
          >
            <RefreshCw className={`w-5 h-5 text-sage-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Lista */}
      <div className="bg-white rounded-xl border border-sage-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-sage-400 animate-spin mx-auto mb-2" />
            <p className="text-sage-600">Caricamento appuntamenti...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-2" />
            <p className="text-sage-600">Nessun appuntamento trovato</p>
            <p className="text-sm text-sage-500">Gli appuntamenti appariranno qui dopo le prenotazioni</p>
          </div>
        ) : (
          <>
            {/* Vista Mobile - Cards */}
            <div className="block lg:hidden divide-y divide-sage-100">
              {appointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 space-y-3"
                >
                  {/* Header con paziente e stato */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-sage-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sage-800 truncate">{getPatientName(apt)}</div>
                        <div className="text-xs text-sage-500 truncate">{apt.user.email}</div>
                      </div>
                    </div>
                    <div className="text-xs">{getStatusBadge(apt.status)}</div>
                  </div>
                  
                  {/* Info appuntamento */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1 text-sage-700 bg-sage-50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(apt.startTime), 'dd/MM/yy', { locale: it })}
                    </div>
                    <div className="flex items-center gap-1 text-sage-700 bg-sage-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      {format(new Date(apt.startTime), 'HH:mm')}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      apt.type === 'FIRST_VISIT' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {getVisitType(apt.type)}
                    </span>
                  </div>
                  
                  {/* Note */}
                  {editingNotes === apt.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg"
                        placeholder="Aggiungi nota..."
                        autoFocus
                      />
                      <button onClick={() => handleAction(apt.id, 'update_notes', { notes: notesText })} className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingNotes(null)} className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : apt.notes ? (
                    <p onClick={() => { setEditingNotes(apt.id); setNotesText(apt.notes || ''); }} className="text-sm text-sage-600 bg-sage-50 p-2 rounded-lg cursor-pointer">
                      {apt.notes}
                    </p>
                  ) : null}
                  
                  {/* Azioni */}
                  <div className="flex gap-2 pt-2 border-t border-sage-100">
                    {actionLoading === apt.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-sage-400" />
                    ) : deleteConfirm === apt.id ? (
                      <>
                        <button onClick={() => handleDelete(apt.id)} className="flex-1 py-2 bg-red-500 text-white text-sm rounded-lg">Elimina</button>
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg">Annulla</button>
                      </>
                    ) : (
                      <>
                        {!apt.notes && (
                          <button onClick={() => { setEditingNotes(apt.id); setNotesText(''); }} className="p-2 bg-sage-100 text-sage-600 rounded-lg" title="Nota">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <>
                            <button onClick={() => handleAction(apt.id, 'complete')} className="p-2 bg-green-100 text-green-600 rounded-lg" title="Completato">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleAction(apt.id, 'cancel')} className="p-2 bg-orange-100 text-orange-600 rounded-lg" title="Cancella">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {apt.status === 'CANCELLED' && (
                          <button onClick={() => handleAction(apt.id, 'confirm')} className="p-2 bg-green-100 text-green-600 rounded-lg" title="Riconferma">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setDeleteConfirm(apt.id)} className="p-2 bg-red-100 text-red-600 rounded-lg ml-auto" title="Elimina">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Vista Desktop - Tabella */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sage-50 border-b border-sage-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Paziente</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Data</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Ora</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Tipo</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Stato</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Note</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {appointments.map((apt, index) => (
                    <motion.tr
                      key={apt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-sage-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-sage-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sage-800">{getPatientName(apt)}</div>
                            <div className="text-sm text-sage-500 flex items-center gap-2">
                              <Mail className="w-3 h-3" /> {apt.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sage-700">
                          <Calendar className="w-4 h-4 text-sage-400" />
                          {format(new Date(apt.startTime), 'dd/MM/yyyy', { locale: it })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sage-700">
                          <Clock className="w-4 h-4 text-sage-400" />
                          {format(new Date(apt.startTime), 'HH:mm')}
                        </div>
                        <div className="text-xs text-sage-500">{apt.duration} min</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.type === 'FIRST_VISIT' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getVisitType(apt.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(apt.status)}</td>
                      <td className="px-4 py-3 max-w-[200px]">
                        {editingNotes === apt.id ? (
                          <div className="flex gap-1">
                            <input type="text" value={notesText} onChange={(e) => setNotesText(e.target.value)} className="flex-1 px-2 py-1 text-sm border rounded" autoFocus />
                            <button onClick={() => handleAction(apt.id, 'update_notes', { notes: notesText })} className="p-1 bg-green-100 text-green-600 rounded"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingNotes(null)} className="p-1 bg-gray-100 text-gray-600 rounded"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div onClick={() => { setEditingNotes(apt.id); setNotesText(apt.notes || ''); }} className="text-sm text-sage-600 cursor-pointer hover:text-sage-800 flex items-center gap-1">
                            {apt.notes ? <span className="truncate">{apt.notes}</span> : <span className="text-sage-400 italic flex items-center gap-1"><Edit3 className="w-3 h-3" /> Aggiungi</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {actionLoading === apt.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-sage-400" />
                        ) : deleteConfirm === apt.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDelete(apt.id)} className="px-2 py-1 bg-red-500 text-white text-xs rounded">Sì</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">No</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            {apt.status === 'CONFIRMED' && (
                              <>
                                <button onClick={() => handleAction(apt.id, 'complete')} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Completato"><Check className="w-4 h-4" /></button>
                                <button onClick={() => handleAction(apt.id, 'cancel')} className="p-1.5 bg-orange-100 text-orange-600 rounded hover:bg-orange-200" title="Cancella"><X className="w-4 h-4" /></button>
                              </>
                            )}
                            {apt.status === 'CANCELLED' && (
                              <button onClick={() => handleAction(apt.id, 'confirm')} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Riconferma"><Check className="w-4 h-4" /></button>
                            )}
                            <button onClick={() => setDeleteConfirm(apt.id)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Elimina"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
