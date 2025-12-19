// =============================================================================
// PAGINA CONTATTI - DOTT. BERNARDO GIAMMETTA
// Pagina con form contatti e informazioni studio
// =============================================================================

import type { Metadata } from 'next';
import { ContactHero } from '@/components/contatti/ContactHero';
import { ContactForm } from '@/components/contatti/ContactForm';
import { ContactInfo } from '@/components/contatti/ContactInfo';
import { MapSection } from '@/components/contatti/MapSection';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contatta il Dott. Bernardo Giammetta per informazioni o per prenotare una visita. Studio a Roma, disponibile anche online.',
  openGraph: {
    title: 'Contatti | Dott. Bernardo Giammetta',
    description: 'Contatta il Dott. Bernardo Giammetta per prenotare una visita.',
  },
};

// =============================================================================
// COMPONENTE PAGINA
// =============================================================================

export default function ContattiPage() {
  return (
    <>
      {/* Hero Section */}
      <ContactHero />
      
      {/* Form e Info */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form contatto */}
            <ContactForm />
            
            {/* Info contatto */}
            <ContactInfo />
          </div>
        </div>
      </section>
      
      {/* Mappa */}
      <MapSection />
    </>
  );
}
