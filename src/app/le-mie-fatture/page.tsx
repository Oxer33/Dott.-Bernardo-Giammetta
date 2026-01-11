// =============================================================================
// LE MIE FATTURE - DOTT. BERNARDO GIAMMETTA
// Pagina per visualizzare le proprie fatture (solo pazienti)
// =============================================================================

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { FatturePaziente } from '@/components/fatture/FatturePaziente';
import { PatientNavigation } from '@/components/shared/PatientNavigation';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Le Mie Fatture | Dott. Bernardo Giammetta',
  description: 'Visualizza e stampa le tue fatture sanitarie.',
};

// =============================================================================
// PAGE COMPONENT - PROTETTA
// =============================================================================

export default async function LeMieFatturePage() {
  // Verifica autenticazione
  const session = await getServerSession(authOptions);
  
  // Se non autenticato, redirect a login
  if (!session?.user) {
    redirect('/accedi?callbackUrl=/le-mie-fatture');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 to-sage-50">
      <div className="container mx-auto px-4 py-6">
        {/* Navigazione paziente */}
        <PatientNavigation />
        
        {/* Contenuto */}
        <FatturePaziente />
      </div>
    </main>
  );
}
