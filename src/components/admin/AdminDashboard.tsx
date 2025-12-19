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
  Mail, 
  Settings,
  BarChart3,
  UserCheck,
  CalendarDays
} from 'lucide-react';
import { AppointmentsList } from './AppointmentsList';
import { WhitelistManager } from './WhitelistManager';
import { TimeBlocksManager } from './TimeBlocksManager';
import { AdminStats } from './AdminStats';

// =============================================================================
// TIPI
// =============================================================================

interface AdminDashboardProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: 'ADMIN' | 'PATIENT';
  };
}

type TabType = 'overview' | 'appointments' | 'whitelist' | 'timeblocks';

// =============================================================================
// TABS NAVIGATION
// =============================================================================

const tabs = [
  { id: 'overview' as TabType, label: 'Panoramica', icon: BarChart3 },
  { id: 'appointments' as TabType, label: 'Appuntamenti', icon: Calendar },
  { id: 'whitelist' as TabType, label: 'Whitelist', icon: UserCheck },
  { id: 'timeblocks' as TabType, label: 'Blocchi Orari', icon: Clock },
];

// =============================================================================
// COMPONENTE DASHBOARD
// =============================================================================

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
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
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-sage-50 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-sage-600" />
              </button>
              <button className="p-2 hover:bg-sage-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-sage-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-custom py-8">
        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sage-500 text-white shadow-md'
                  : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
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
          {activeTab === 'overview' && <AdminStats />}
          {activeTab === 'appointments' && <AppointmentsList />}
          {activeTab === 'whitelist' && <WhitelistManager />}
          {activeTab === 'timeblocks' && <TimeBlocksManager />}
        </motion.div>
      </div>
    </div>
  );
}
