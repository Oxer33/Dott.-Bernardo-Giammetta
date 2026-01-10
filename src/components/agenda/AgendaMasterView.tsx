// =============================================================================
// AGENDA MASTER VIEW - DOTT. BERNARDO GIAMMETTA
// Punto 1: Vista agenda semplificata per account master
// Bottoni navigazione + calendario senza descrizione
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Home, 
  CalendarPlus, 
  UserCheck, 
  Lock, 
  BarChart3,
  CalendarDays,
  UserMinus,
  Receipt
} from 'lucide-react';
import { AgendaCalendar } from './AgendaCalendar';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function AgendaMasterView() {
  const [blacklistCount, setBlacklistCount] = useState(0);

  // Fetch conteggio blacklist per colorare il bottone dinamicamente
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
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container-custom">
        {/* Bottoni navigazione master (6 bottoni come in altre sezioni) */}
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
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-sage-500 text-white shadow-md"
          >
            <CalendarDays className="w-4 h-4" />
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
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium ${
              blacklistCount > 0
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-100'
            }`}
          >
            <UserMinus className="w-4 h-4" />
            <span className="hidden sm:inline">Blacklist</span>
            {blacklistCount > 0 && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {blacklistCount}
              </span>
            )}
          </Link>
          <Link
            href="/fatture"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
          >
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Fatture</span>
          </Link>
        </div>

        {/* Calendario direttamente senza descrizione */}
        <AgendaCalendar />
      </div>
    </div>
  );
}
