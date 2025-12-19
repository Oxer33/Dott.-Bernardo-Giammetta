// =============================================================================
// TIME BLOCKS MANAGER - DOTT. BERNARDO GIAMMETTA
// Gestione blocchi orari per admin
// =============================================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Clock,
  Calendar,
  Repeat,
  Trash2,
  Edit2
} from 'lucide-react';

// =============================================================================
// DATI MOCK
// =============================================================================

const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

const mockTimeBlocks = [
  {
    id: '1',
    type: 'RECURRING',
    dayOfWeek: 3, // Mercoledì
    startTime: '12:00',
    endTime: '14:00',
    note: 'Pausa pranzo',
  },
  {
    id: '2',
    type: 'RECURRING',
    dayOfWeek: 0, // Domenica
    startTime: '08:00',
    endTime: '20:00',
    note: 'Giorno di chiusura',
  },
  {
    id: '3',
    type: 'OCCASIONAL',
    specificDate: '2024-01-25',
    startTime: '14:00',
    endTime: '18:00',
    note: 'Congresso medico',
  },
  {
    id: '4',
    type: 'OCCASIONAL',
    specificDate: '2024-02-01',
    startTime: '08:00',
    endTime: '20:00',
    note: 'Ferie',
  },
];

// =============================================================================
// COMPONENTE TIME BLOCKS MANAGER
// =============================================================================

export function TimeBlocksManager() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  const recurringBlocks = mockTimeBlocks.filter(b => b.type === 'RECURRING');
  const occasionalBlocks = mockTimeBlocks.filter(b => b.type === 'OCCASIONAL');
  
  return (
    <div className="space-y-6">
      {/* Header con azione */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-sage-800">Gestione Blocchi Orari</h2>
          <p className="text-sage-600 text-sm">
            Configura gli orari in cui non sei disponibile per visite.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuovo Blocco
        </button>
      </div>
      
      {/* Blocchi Ricorrenti */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-medium text-sage-800 mb-4">
          <Repeat className="w-5 h-5 text-sage-500" />
          Blocchi Ricorrenti (Settimanali)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recurringBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-sage-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Repeat className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-sage-800">
                    {days[block.dayOfWeek!]}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-sage-100 rounded transition-colors">
                    <Edit2 className="w-4 h-4 text-sage-500" />
                  </button>
                  <button className="p-1 hover:bg-red-100 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
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
      </div>
      
      {/* Blocchi Occasionali */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-medium text-sage-800 mb-4">
          <Calendar className="w-5 h-5 text-sage-500" />
          Blocchi Occasionali (Date Specifiche)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {occasionalBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                      month: 'short'
                    })}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-sage-100 rounded transition-colors">
                    <Edit2 className="w-4 h-4 text-sage-500" />
                  </button>
                  <button className="p-1 hover:bg-red-100 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
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
