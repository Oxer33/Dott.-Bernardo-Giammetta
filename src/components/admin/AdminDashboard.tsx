// =============================================================================
// ADMIN DASHBOARD - DOTT. BERNARDO GIAMMETTA
// Dashboard principale per amministrazione
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Lock, 
  BarChart3,
  UserCheck,
  Home,
  CalendarDays,
  UserMinus
} from 'lucide-react';
import Link from 'next/link';
import { AppointmentsList } from './AppointmentsList';
import { WhitelistManager } from './WhitelistManager';
import { TimeBlocksManager } from './TimeBlocksManager';
import { AdminStats } from './AdminStats';
import { BlacklistManager } from './BlacklistManager';

// =============================================================================
// TIPI
// =============================================================================

type TabType = 'appointments' | 'whitelist' | 'timeblocks' | 'stats' | 'blacklist';

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
  { id: 'whitelist' as TabType, label: 'Elenco Pazienti', icon: UserCheck },
  { id: 'timeblocks' as TabType, label: 'Blocchi Orari', icon: Lock },
  { id: 'stats' as TabType, label: 'Statistiche', icon: BarChart3 },
  { id: 'blacklist' as TabType, label: 'Blacklist', icon: UserMinus },
];

// =============================================================================
// COMPONENTE DASHBOARD
// =============================================================================

export function AdminDashboard({ user, initialTab }: AdminDashboardProps) {
  // Punto 5: usa initialTab se fornito, altrimenti default appointments
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'appointments');
  const [blacklistCount, setBlacklistCount] = useState(0);

  // Fetch conteggio blacklist per badge dinamico
  useEffect(() => {
    const fetchBlacklistCount = async () => {
      try {
        const res = await fetch('/api/admin/blacklist');
        const data = await res.json();
        if (data.success) {
          setBlacklistCount(data.blacklisted?.length || 0);
        }
      } catch (err) {
        console.error('Errore fetch blacklist count:', err);
      }
    };
    fetchBlacklistCount();
  }, [activeTab]); // Ricarica quando cambia tab
  
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
            {/* Bottoni navigazione rapida */}
            <div className="flex items-center gap-3">
              <Link href="/agenda">
                <button className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-xl hover:bg-sage-200 transition-colors">
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">Agenda</span>
                </button>
              </Link>
              <button
                onClick={() => setActiveTab('blacklist')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  blacklistCount > 0
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                }`}
              >
                <UserMinus className="w-4 h-4" />
                <span className="hidden sm:inline">Blacklist</span>
                {blacklistCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {blacklistCount}
                  </span>
                )}
              </button>
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
          
          {tabs.map((tab) => {
            // Stile speciale per Blacklist: rosso solo se ci sono pazienti
            const isBlacklist = tab.id === 'blacklist';
            const hasBlacklistedPatients = blacklistCount > 0;
            
            let buttonClass = '';
            if (activeTab === tab.id) {
              // Tab attivo
              buttonClass = isBlacklist && hasBlacklistedPatients
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-sage-500 text-white shadow-md';
            } else {
              // Tab non attivo
              buttonClass = isBlacklist && hasBlacklistedPatients
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-100';
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all ${buttonClass}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {tab.label}
                  {isBlacklist && ` (${blacklistCount})`}
                </span>
                {/* Badge mobile per blacklist */}
                {isBlacklist && hasBlacklistedPatients && (
                  <span className="sm:hidden ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                    {blacklistCount}
                  </span>
                )}
              </button>
            );
          })}
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
          {activeTab === 'blacklist' && <BlacklistManager />}
        </motion.div>
      </div>
    </div>
  );
}
