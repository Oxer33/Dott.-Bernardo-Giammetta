// =============================================================================
// APPOINTMENTS LIST - DOTT. BERNARDO GIAMMETTA
// Lista e gestione appuntamenti per admin
// =============================================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

// =============================================================================
// DATI MOCK
// =============================================================================

const mockAppointments = [
  {
    id: '1',
    patient: { name: 'Mario Rossi', email: 'mario@email.com' },
    date: '2024-01-20',
    time: '09:00',
    type: 'FOLLOW_UP',
    status: 'CONFIRMED',
    notes: 'Controllo peso',
  },
  {
    id: '2',
    patient: { name: 'Laura Bianchi', email: 'laura@email.com' },
    date: '2024-01-20',
    time: '10:30',
    type: 'FIRST_VISIT',
    status: 'CONFIRMED',
    notes: 'Prima visita - problemi digestivi',
  },
  {
    id: '3',
    patient: { name: 'Giuseppe Verdi', email: 'giuseppe@email.com' },
    date: '2024-01-21',
    time: '14:00',
    type: 'FOLLOW_UP',
    status: 'CONFIRMED',
    notes: '',
  },
  {
    id: '4',
    patient: { name: 'Anna Neri', email: 'anna@email.com' },
    date: '2024-01-22',
    time: '11:00',
    type: 'FOLLOW_UP',
    status: 'CANCELLED',
    notes: 'Cancellato dal paziente',
  },
];

// =============================================================================
// COMPONENTE APPOINTMENTS LIST
// =============================================================================

export function AppointmentsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredAppointments = mockAppointments.filter(apt => {
    const matchesSearch = apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      {/* Filtri */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
          <input
            type="text"
            placeholder="Cerca paziente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-sage-500" />
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
        </div>
      </div>
      
      {/* Lista */}
      <div className="bg-white rounded-xl border border-sage-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sage-50 border-b border-sage-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Paziente</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Data</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Ora</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Tipo</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Stato</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-sage-600">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-50">
              {filteredAppointments.map((apt, index) => (
                <motion.tr
                  key={apt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-sage-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-sage-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sage-800">{apt.patient.name}</div>
                        <div className="text-sm text-sage-500">{apt.patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sage-700">
                      <Calendar className="w-4 h-4 text-sage-400" />
                      {new Date(apt.date).toLocaleDateString('it-IT')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sage-700">
                      <Clock className="w-4 h-4 text-sage-400" />
                      {apt.time}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apt.type === 'FIRST_VISIT' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {apt.type === 'FIRST_VISIT' ? 'Prima Visita' : 'Controllo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-sm ${
                      apt.status === 'CONFIRMED' ? 'text-green-600' :
                      apt.status === 'CANCELLED' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {apt.status === 'CONFIRMED' && <CheckCircle className="w-4 h-4" />}
                      {apt.status === 'CANCELLED' && <XCircle className="w-4 h-4" />}
                      {apt.status === 'CONFIRMED' ? 'Confermato' :
                       apt.status === 'CANCELLED' ? 'Cancellato' : apt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-sage-100 rounded transition-colors">
                        <Eye className="w-4 h-4 text-sage-600" />
                      </button>
                      <button className="p-1 hover:bg-sage-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-sage-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
