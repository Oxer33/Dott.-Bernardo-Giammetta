// =============================================================================
// TIME BLOCKS MANAGER - DOTT. BERNARDO GIAMMETTA
// Gestione blocchi orari per admin (DATI REALI)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Clock,
  Calendar,
  Repeat,
  Trash2,
  Edit2,
  Loader2,
  RefreshCw,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

// =============================================================================
// COSTANTI
// =============================================================================

const DAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

// =============================================================================
// TIPI
// =============================================================================

interface TimeBlock {
  id: string;
  type: 'RECURRING' | 'OCCASIONAL';
  dayOfWeek: number | null;
  startTime: string;
  endTime: string;
  specificDate: string | null;
  note: string | null;
}

// =============================================================================
// COMPONENTE TIME BLOCKS MANAGER
// =============================================================================

export function TimeBlocksManager() {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Form state
  const [formType, setFormType] = useState<'RECURRING' | 'OCCASIONAL'>('RECURRING');
  const [formDayOfWeek, setFormDayOfWeek] = useState(1);
  const [formStartTime, setFormStartTime] = useState('12:00');
  const [formEndTime, setFormEndTime] = useState('14:00');
  const [formDate, setFormDate] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formError, setFormError] = useState('');

  // Carica blocchi
  const loadTimeBlocks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/timeblocks');
      const data = await res.json();
      if (data.success) {
        setTimeBlocks(data.timeBlocks);
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
    loadTimeBlocks();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormType('RECURRING');
    setFormDayOfWeek(1);
    setFormStartTime('12:00');
    setFormEndTime('14:00');
    setFormDate('');
    setFormNote('');
    setFormError('');
    setEditingBlock(null);
  };

  // Apri modal per edit
  const openEditModal = (block: TimeBlock) => {
    setEditingBlock(block);
    setFormType(block.type);
    setFormDayOfWeek(block.dayOfWeek || 1);
    setFormStartTime(block.startTime);
    setFormEndTime(block.endTime);
    setFormDate(block.specificDate ? block.specificDate.split('T')[0] : '');
    setFormNote(block.note || '');
    setShowAddModal(true);
  };

  // Salva blocco
  const handleSave = async () => {
    setFormError('');
    
    if (formType === 'OCCASIONAL' && !formDate) {
      setFormError('Data richiesta per blocchi occasionali');
      return;
    }
    
    setActionLoading('save');
    try {
      const body = {
        id: editingBlock?.id,
        type: formType,
        dayOfWeek: formType === 'RECURRING' ? formDayOfWeek : null,
        startTime: formStartTime,
        endTime: formEndTime,
        specificDate: formType === 'OCCASIONAL' ? formDate : null,
        note: formNote || null,
      };
      
      const res = await fetch('/api/admin/timeblocks', {
        method: editingBlock ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        resetForm();
        loadTimeBlocks();
      } else {
        setFormError(data.error || 'Errore nel salvataggio');
      }
    } catch (error) {
      setFormError('Errore di connessione');
    } finally {
      setActionLoading(null);
    }
  };

  // Elimina blocco
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/timeblocks?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        loadTimeBlocks();
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

  const recurringBlocks = timeBlocks.filter(b => b.type === 'RECURRING');
  const occasionalBlocks = timeBlocks.filter(b => b.type === 'OCCASIONAL');
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modal Aggiungi/Modifica */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sage-800">
                {editingBlock ? 'Modifica Blocco' : 'Nuovo Blocco Orario'}
              </h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-1 hover:bg-sage-100 rounded">
                <X className="w-5 h-5 text-sage-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Tipo</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormType('RECURRING')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      formType === 'RECURRING' ? 'bg-purple-100 text-purple-700' : 'bg-sage-100 text-sage-600'
                    }`}
                  >
                    <Repeat className="w-4 h-4 inline mr-1" /> Ricorrente
                  </button>
                  <button
                    onClick={() => setFormType('OCCASIONAL')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      formType === 'OCCASIONAL' ? 'bg-orange-100 text-orange-700' : 'bg-sage-100 text-sage-600'
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-1" /> Occasionale
                  </button>
                </div>
              </div>
              
              {/* Giorno/Data */}
              {formType === 'RECURRING' ? (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Giorno della settimana</label>
                  <select
                    value={formDayOfWeek}
                    onChange={(e) => setFormDayOfWeek(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {DAYS.map((day, i) => (
                      <option key={i} value={i}>{day}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* Orari */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Ora inizio</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Ora fine</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Note (opzionale)</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Es: Pausa pranzo, Ferie, Congresso..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              {/* Errore */}
              {formError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {formError}
                </div>
              )}
              
              {/* Azioni */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 py-2 px-4 border border-sage-200 rounded-lg text-sage-600 hover:bg-sage-50"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  disabled={actionLoading === 'save'}
                  className="flex-1 py-2 px-4 bg-sage-500 text-white rounded-lg hover:bg-sage-600 flex items-center justify-center gap-2"
                >
                  {actionLoading === 'save' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Salva
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header con azione */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-sage-800">Gestione Blocchi Orari</h2>
          <p className="text-sage-600 text-sm">
            Configura gli orari in cui non sei disponibile per visite.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadTimeBlocks} className="p-2 hover:bg-sage-100 rounded-xl">
            <RefreshCw className={`w-5 h-5 text-sage-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuovo Blocco
          </button>
        </div>
      </div>
      
      {/* Blocchi Ricorrenti */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-medium text-sage-800 mb-4">
          <Repeat className="w-5 h-5 text-purple-500" />
          Blocchi Ricorrenti (Settimanali)
        </h3>
        {recurringBlocks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-sage-500 border border-sage-100">
            <Repeat className="w-12 h-12 mx-auto mb-2 text-sage-300" />
            <p>Nessun blocco ricorrente configurato</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recurringBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-sage-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Repeat className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-sage-800">
                      {DAYS[block.dayOfWeek!]}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {actionLoading === block.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-sage-400" />
                    ) : deleteConfirm === block.id ? (
                      <>
                        <button onClick={() => handleDelete(block.id)} className="p-1 bg-red-100 text-red-600 rounded text-xs">Sì</button>
                        <button onClick={() => setDeleteConfirm(null)} className="p-1 bg-gray-100 text-gray-600 rounded text-xs">No</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openEditModal(block)} className="p-1 hover:bg-sage-100 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-sage-500" />
                        </button>
                        <button onClick={() => setDeleteConfirm(block.id)} className="p-1 hover:bg-red-100 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sage-600 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  {block.startTime} - {block.endTime}
                </div>
                {block.note && (
                  <p className="text-sm text-sage-500 bg-sage-50 p-2 rounded">
                    {block.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Blocchi Occasionali */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-medium text-sage-800 mb-4">
          <Calendar className="w-5 h-5 text-orange-500" />
          Blocchi Occasionali (Date Specifiche)
        </h3>
        {occasionalBlocks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-sage-500 border border-sage-100">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-sage-300" />
            <p>Nessun blocco occasionale configurato</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {occasionalBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-sage-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="font-medium text-sage-800">
                      {new Date(block.specificDate!).toLocaleDateString('it-IT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {actionLoading === block.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-sage-400" />
                    ) : deleteConfirm === block.id ? (
                      <>
                        <button onClick={() => handleDelete(block.id)} className="p-1 bg-red-100 text-red-600 rounded text-xs">Sì</button>
                        <button onClick={() => setDeleteConfirm(null)} className="p-1 bg-gray-100 text-gray-600 rounded text-xs">No</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openEditModal(block)} className="p-1 hover:bg-sage-100 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-sage-500" />
                        </button>
                        <button onClick={() => setDeleteConfirm(block.id)} className="p-1 hover:bg-red-100 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sage-600 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  {block.startTime} - {block.endTime}
                </div>
                {block.note && (
                  <p className="text-sm text-sage-500 bg-sage-50 p-2 rounded">
                    {block.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="bg-cream-50 rounded-xl p-4 border border-sage-100">
        <h4 className="font-medium text-sage-800 mb-2">Informazioni</h4>
        <ul className="text-sm text-sage-600 space-y-1">
          <li>• <strong>Blocchi Ricorrenti:</strong> Si ripetono ogni settimana allo stesso giorno e orario.</li>
          <li>• <strong>Blocchi Occasionali:</strong> Validi solo per una specifica data (ferie, impegni, ecc.).</li>
          <li>• Gli slot bloccati non saranno disponibili per le prenotazioni dei pazienti.</li>
        </ul>
      </div>
    </div>
  );
}
