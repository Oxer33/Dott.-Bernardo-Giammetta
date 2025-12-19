// =============================================================================
// PAGINA ADMIN - DOTT. BERNARDO GIAMMETTA
// Dashboard amministrativa per gestione appuntamenti e whitelist
// =============================================================================

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Pannello amministrativo per la gestione degli appuntamenti',
  robots: 'noindex, nofollow',
};

// =============================================================================
// COMPONENTE PAGINA
// =============================================================================

export default async function AdminPage() {
  // Verifica autenticazione e ruolo admin
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }
  
  return <AdminDashboard user={session.user} />;
}
