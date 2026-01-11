// =============================================================================
// PATIENT NAVIGATION - NAVIGAZIONE COMUNE PAZIENTI
// Bottoni di navigazione tra Agenda, Area personale e Profilo
// =============================================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Home, User, Receipt } from 'lucide-react';

// =============================================================================
// COMPONENTE
// =============================================================================

export function PatientNavigation() {
  const pathname = usePathname();

  const links = [
    { href: '/agenda', label: 'Agenda', icon: Calendar },
    { href: '/area-personale', label: 'Area personale', icon: Home },
    { href: '/profilo', label: 'Profilo', icon: User },
    { href: '/le-mie-fatture', label: 'Fatture', icon: Receipt },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isActive
                ? 'bg-sage-500 text-white'
                : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
