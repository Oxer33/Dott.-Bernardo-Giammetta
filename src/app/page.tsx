// =============================================================================
// HOMEPAGE - DOTT. BERNARDO GIAMMETTA
// Landing page ultra-moderna con hero, sezioni animate e CTA
// =============================================================================

import { HeroSection } from '@/components/home/HeroSection';
import { AboutPreview } from '@/components/home/AboutPreview';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { StatsCounter } from '@/components/home/StatsCounter';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { BlogPreview } from '@/components/home/BlogPreview';
import { ContactSection } from '@/components/home/ContactSection';
import { CTASection } from '@/components/home/CTASection';

// =============================================================================
// HOMEPAGE COMPONENT
// =============================================================================

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Full screen con immagine/video HD */}
      <HeroSection />

      {/* Chi Sono Preview - Split screen foto + testo */}
      <AboutPreview />

      {/* Servizi - Bento Grid con cards glassmorphism */}
      <ServicesGrid />

      {/* Stats Counter - Numeri animati */}
      <StatsCounter />

      {/* Testimonials - Carousel moderno */}
      <TestimonialsCarousel />

      {/* Blog Preview - Ultimi articoli */}
      <BlogPreview />

      {/* Contact Section - Form ricontatto */}
      <ContactSection />

      {/* CTA Section - Call to action finale */}
      <CTASection />
    </>
  );
}
