// =============================================================================
// FATTURE DASHBOARD - DOTT. BERNARDO GIAMMETTA
// Dashboard principale per gestione fatture con tab Nuova Fattura ed Elenco
// =============================================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home, 
  Calendar,
  CalendarDays,
  UserCheck,
  Lock,
  BarChart3,
  UserMinus,
  Receipt,
  Plus,
  List,
  Search,
  FileText,
  Printer,
  Download
} from 'lucide-react';
import { NuovaFattura } from './NuovaFattura';
import { ElencoFatture } from './ElencoFatture';

// =============================================================================
// TIPI
// =============================================================================

type TabType = 'nuova' | 'elenco';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function FattureDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('nuova');

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container-custom">
        {/* Menu navigazione master */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/area-personale"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-lavender-100 text-lavender-700 hover:bg-lavender-200 border border-lavender-200"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/agenda"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Agenda</span>
          </Link>
          <Link
            href="/admin?tab=appointments"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Appuntamenti</span>
          </Link>
          <Link
            href="/admin?tab=whitelist"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Elenco Pazienti</span>
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
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-white text-sage-600 hover:bg-sage-50 border border-sage-100"
          >
            <UserMinus className="w-4 h-4" />
            <span className="hidden sm:inline">Blacklist</span>
          </Link>
          <Link
            href="/fatture"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-amber-500 text-white shadow-md"
          >
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Fatture</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-sage-900">
            Gestione Fatture
          </h1>
          <p className="text-sage-600">
            Crea nuove fatture o consulta l&apos;archivio delle fatture emesse
          </p>
        </div>

        {/* Tabs sottosezioni */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('nuova')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'nuova'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            Nuova Fattura
          </button>
          <button
            onClick={() => setActiveTab('elenco')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'elenco'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-200'
            }`}
          >
            <List className="w-4 h-4" />
            Elenco Fatture
          </button>
        </div>

        {/* Tab Content - Usa display invece di mount/unmount per preservare stato */}
        <div className={activeTab === 'nuova' ? 'block' : 'hidden'}>
          <NuovaFattura />
        </div>
        <div className={activeTab === 'elenco' ? 'block' : 'hidden'}>
          <ElencoFatture />
        </div>
      </div>
    </div>
  );
}
