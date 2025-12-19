// =============================================================================
// PAGINA SERVIZI - DOTT. BERNARDO GIAMMETTA
// Pagina con tutti i servizi offerti con cards glassmorphism
// =============================================================================

import type { Metadata } from 'next';
import { ServicesHero } from '@/components/servizi/ServicesHero';
import { ServicesList } from '@/components/servizi/ServicesList';
import { ProcessSteps } from '@/components/servizi/ProcessSteps';
import { FAQ } from '@/components/servizi/FAQ';
import { CTASection } from '@/components/home/CTASection';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Servizi',
  description: 'Scopri i servizi di nutrizione del Dott. Bernardo Giammetta: prima visita, visite di controllo, piani alimentari personalizzati, nutrizione sportiva e molto altro.',
  openGraph: {
    title: 'Servizi | Dott. Bernardo Giammetta',
    description: 'Servizi di nutrizione personalizzati per il tuo benessere.',
  },
};

// =============================================================================
// COMPONENTE PAGINA
// =============================================================================

export default function ServiziPage() {
  return (
    <>
      {/* Hero Section */}
      <ServicesHero />
      
      {/* Lista Servizi */}
      <ServicesList />
      
      {/* Come Funziona */}
      <ProcessSteps />
      
      {/* FAQ */}
      <FAQ />
      
      {/* Call to Action */}
      <CTASection />
    </>
  );
}
