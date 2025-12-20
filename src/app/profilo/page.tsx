// =============================================================================
// AREA PERSONALE - DOTT. BERNARDO GIAMMETTA
// Pagina profilo utente con gestione dati personali e questionario
// =============================================================================

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ProfileContent } from '@/components/profile/ProfileContent';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Area Personale',
  description: 'Gestisci il tuo profilo e compila il questionario alimentare per la tua prima visita con il Dott. Bernardo Giammetta.',
};

// =============================================================================
// PAGE COMPONENT - PROTETTA
// =============================================================================

export default async function ProfiloPage() {
  // Verifica autenticazione
  const session = await getServerSession(authOptions);
  
  // Se non autenticato, redirect a login
  if (!session?.user) {
    redirect('/accedi?callbackUrl=/profilo');
  }
  
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-lavender-400 to-lavender-500 text-white py-12 lg:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              Area Riservata
            </span>
            <h1 className="text-display-md lg:text-display-lg mb-4">
              Ciao, <em className="text-lavender-100">{session.user.name?.split(' ')[0] || 'Paziente'}</em>!
            </h1>
            <p className="text-lavender-100 text-lg leading-relaxed">
              Gestisci i tuoi dati personali e compila il questionario alimentare 
              per prepararti alla tua visita.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container-custom">
          <ProfileContent user={session.user} />
        </div>
      </section>
    </div>
  );
}
