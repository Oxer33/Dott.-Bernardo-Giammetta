// =============================================================================
// AGENDA MASTER VIEW - DOTT. BERNARDO GIAMMETTA
// Punto 1: Vista agenda semplificata per account master
// Bottoni navigazione + calendario senza descrizione
// =============================================================================

'use client';

import Link from 'next/link';
import { 
  Calendar, 
  Home, 
  CalendarPlus, 
  UserCheck, 
  Lock, 
  BarChart3,
  CalendarDays,
  UserMinus
} from 'lucide-react';
import { AgendaCalendar } from './AgendaCalendar';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function AgendaMasterView() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header compatto per master */}
      <header className="bg-white border-b border-sage-100 sticky top-0 z-40">
        <div className="container-custom py-4">
          <h1 className="text-2xl font-display font-bold text-sage-900">
            Agenda Appuntamenti
          </h1>
        </div>
      </header>

      <div className="container-custom py-6">
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
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          >
            <UserMinus className="w-4 h-4" />
            <span className="hidden sm:inline">Blacklist</span>
          </Link>
        </div>

        {/* Calendario direttamente senza descrizione */}
        <AgendaCalendar />
      </div>
    </div>
  );
}
