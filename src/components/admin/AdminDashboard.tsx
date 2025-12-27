// =============================================================================
// ADMIN DASHBOARD - DOTT. BERNARDO GIAMMETTA
// Dashboard principale per amministrazione
// =============================================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Clock, 
  BarChart3,
  UserCheck,
  Home,
  CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import { AppointmentsList } from './AppointmentsList';
import { WhitelistManager } from './WhitelistManager';
import { TimeBlocksManager } from './TimeBlocksManager';
import { AdminStats } from './AdminStats';

// =============================================================================
// TIPI
// =============================================================================

type TabType = 'appointments' | 'whitelist' | 'timeblocks' | 'stats';

interface AdminDashboardProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: 'ADMIN' | 'PATIENT';
  };
  initialTab?: TabType; // Punto 5: tab iniziale da query string
}

// =============================================================================
// TABS NAVIGATION
// =============================================================================

const tabs = [
  { id: 'appointments' as TabType, label: 'Appuntamenti', icon: Calendar },
  { id: 'whitelist' as TabType, label: 'Whitelist', icon: UserCheck },
  { id: 'timeblocks' as TabType, label: 'Blocchi Orari', icon: Clock },
  { id: 'stats' as TabType, label: 'Statistiche', icon: BarChart3 },
];

// =============================================================================
// COMPONENTE DASHBOARD
// =============================================================================

export function AdminDashboard({ user, initialTab }: AdminDashboardProps) {
  // Punto 5: usa initialTab se fornito, altrimenti default appointments
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'appointments');
  
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-100 sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-sage-900">
                Dashboard Admin
              </h1>
              <p className="text-sage-600 text-sm">
                Benvenuto, {user.name || 'Dottore'}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-custom py-8">
        {/* Tabs Navigation - Responsive */}
        <div className="flex flex-wrap gap-2 mb-8">
          {/* Bottone Dashboard (torna ad area-personale) */}
          <Link
            href="/area-personale"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all bg-lavender-100 text-lavender-700 hover:bg-lavender-200 border border-lavender-200"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          
          {/* Bottone Agenda (punto 4) */}
          <Link
            href="/agenda"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Agenda</span>
          </Link>
          
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sage-500 text-white shadow-md'
                  : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'appointments' && <AppointmentsList />}
          {activeTab === 'whitelist' && <WhitelistManager />}
          {activeTab === 'timeblocks' && <TimeBlocksManager />}
          {activeTab === 'stats' && <AdminStats />}
        </motion.div>
      </div>
    </div>
  );
}
