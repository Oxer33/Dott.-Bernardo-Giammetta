// =============================================================================
// PAGINA FATTURE - DOTT. BERNARDO GIAMMETTA
// Gestione fatture con sottosezioni: Nuova Fattura, Elenco Fatture
// Solo per account master/admin
// =============================================================================

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { isMasterAccount } from '@/lib/config';
import { FattureDashboard } from '@/components/fatture/FattureDashboard';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Gestione Fatture | Dott. Bernardo Giammetta',
  description: 'Gestione fatture per le visite nutrizionali.',
};

// =============================================================================
// PAGE COMPONENT - PROTETTA (SOLO MASTER/ADMIN)
// =============================================================================

export default async function FatturePage() {
  const session = await getServerSession(authOptions);
  
  // Verifica autenticazione
  if (!session?.user) {
    redirect('/accedi');
  }
  
  // Verifica che sia account master o admin
  const isMaster = session.user.email && isMasterAccount(session.user.email);
  const isAdmin = session.user.role === 'ADMIN';
  
  if (!isMaster && !isAdmin) {
    redirect('/area-personale');
  }
  
  return <FattureDashboard />;
}
