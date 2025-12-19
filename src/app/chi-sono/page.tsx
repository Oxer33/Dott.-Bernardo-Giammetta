// =============================================================================
// PAGINA CHI SONO - DOTT. BERNARDO GIAMMETTA
// Pagina about con timeline carriera, galleria certificazioni e valori
// =============================================================================

import type { Metadata } from 'next';
import { AboutHero } from '@/components/chi-sono/AboutHero';
import { Timeline } from '@/components/chi-sono/Timeline';
import { Certifications } from '@/components/chi-sono/Certifications';
import { Values } from '@/components/chi-sono/Values';
import { CTASection } from '@/components/home/CTASection';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Chi Sono',
  description: 'Scopri il percorso professionale del Dott. Bernardo Giammetta, Biologo Nutrizionista. Formazione, certificazioni e filosofia di lavoro.',
  openGraph: {
    title: 'Chi Sono | Dott. Bernardo Giammetta',
    description: 'Scopri il percorso professionale del Dott. Bernardo Giammetta, Biologo Nutrizionista.',
  },
};

// =============================================================================
// COMPONENTE PAGINA
// =============================================================================

export default function ChiSonoPage() {
  return (
    <>
      {/* Hero Section */}
      <AboutHero />
      
      {/* Timeline Carriera */}
      <Timeline />
      
      {/* Certificazioni e Formazione */}
      <Certifications />
      
      {/* Valori e Filosofia */}
      <Values />
      
      {/* Call to Action */}
      <CTASection />
    </>
  );
}
