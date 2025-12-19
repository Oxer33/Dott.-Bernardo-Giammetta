// =============================================================================
// WHITELIST MANAGER - DOTT. BERNARDO GIAMMETTA
// Gestione whitelist pazienti per admin
// =============================================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  MoreVertical
} from 'lucide-react';

// =============================================================================
// DATI MOCK
// =============================================================================

const mockUsers = [
  {
    id: '1',
    name: 'Mario Rossi',
    email: 'mario@email.com',
    isWhitelisted: true,
    whitelistedAt: '2024-01-10',
    lastVisit: '2024-01-15',
  },
  {
    id: '2',
    name: 'Laura Bianchi',
    email: 'laura@email.com',
    isWhitelisted: true,
    whitelistedAt: '2024-01-05',
    lastVisit: '2024-01-12',
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    email: 'giuseppe@email.com',
    isWhitelisted: false,
    whitelistedAt: null,
    lastVisit: null,
  },
  {
    id: '4',
    name: 'Anna Neri',
    email: 'anna@email.com',
    isWhitelisted: true,
    whitelistedAt: '2023-12-20',
    lastVisit: '2024-01-18',
  },
];

// =============================================================================
// COMPONENTE WHITELIST MANAGER
// =============================================================================

export function WhitelistManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'whitelisted' | 'pending'>('all');
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'whitelisted' && user.isWhitelisted) ||
                         (filter === 'pending' && !user.isWhitelisted);
    return matchesSearch && matchesFilter;
  });
  
  const whitelistedCount = mockUsers.filter(u => u.isWhitelisted).length;
  const pendingCount = mockUsers.filter(u => !u.isWhitelisted).length;
  
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
              <div className="text-2xl font-bold text-sage-900">{whitelistedCount}</div>
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
              <div className="text-2xl font-bold text-sage-900">{pendingCount}</div>
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
              <div className="text-2xl font-bold text-sage-900">{mockUsers.length}</div>
              <div className="text-sm text-sage-600">Utenti Totali</div>
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
        </div>
      </div>
      
      {/* Lista utenti */}
      <div className="bg-white rounded-xl border border-sage-100 divide-y divide-sage-50">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 flex items-center justify-between hover:bg-sage-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user.isWhitelisted ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {user.isWhitelisted ? (
                  <UserCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <UserPlus className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div>
                <div className="font-medium text-sage-800">{user.name}</div>
                <div className="text-sm text-sage-500">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {user.whitelistedAt && (
                <div className="hidden sm:block text-sm text-sage-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Approvato: {new Date(user.whitelistedAt).toLocaleDateString('it-IT')}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {!user.isWhitelisted && (
                  <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                    Approva
                  </button>
                )}
                {user.isWhitelisted && (
                  <button className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors">
                    Rimuovi
                  </button>
                )}
                <button className="p-1 hover:bg-sage-100 rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-sage-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
