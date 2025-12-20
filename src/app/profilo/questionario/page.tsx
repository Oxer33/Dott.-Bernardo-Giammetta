// =============================================================================
// QUESTIONARIO ALIMENTARE - DOTT. BERNARDO GIAMMETTA
// Pagina per compilare il questionario prima della prima visita
// =============================================================================

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { QuestionnaireForm } from '@/components/profile/QuestionnaireForm';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Questionario Alimentare',
  description: 'Compila il questionario alimentare per la tua prima visita con il Dott. Bernardo Giammetta.',
};

// =============================================================================
// PAGE COMPONENT - PROTETTA
// =============================================================================

export default async function QuestionarioPage() {
  // Verifica autenticazione
  const session = await getServerSession(authOptions);
  
  // Se non autenticato, redirect a login
  if (!session?.user) {
    redirect('/accedi?callbackUrl=/profilo/questionario');
  }
  
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-sage-400 to-sage-600 text-white py-12 lg:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              Prima Visita
            </span>
            <h1 className="text-display-md lg:text-display-lg mb-4">
              Questionario <em className="text-sage-100">Alimentare</em>
            </h1>
            <p className="text-sage-100 text-lg leading-relaxed">
              Questo questionario è fondamentale per permettermi di preparare al meglio 
              la tua consulenza. Prenditi tutto il tempo necessario per rispondere 
              con precisione.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container-custom">
          <QuestionnaireForm userEmail={session.user.email || ''} />
        </div>
      </section>
    </div>
  );
}
