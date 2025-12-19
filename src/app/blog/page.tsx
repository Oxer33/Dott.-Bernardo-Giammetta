// =============================================================================
// PAGINA BLOG - DOTT. BERNARDO GIAMMETTA
// Pagina con lista articoli del blog
// =============================================================================

import type { Metadata } from 'next';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogCategories } from '@/components/blog/BlogCategories';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articoli, consigli e approfondimenti sulla nutrizione dal Dott. Bernardo Giammetta. Scopri come migliorare la tua alimentazione.',
  openGraph: {
    title: 'Blog | Dott. Bernardo Giammetta',
    description: 'Articoli e consigli sulla nutrizione.',
  },
};

// =============================================================================
// COMPONENTE PAGINA
// =============================================================================

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <BlogHero />
      
      {/* Contenuto principale */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar categorie */}
            <aside className="lg:col-span-1">
              <BlogCategories />
            </aside>
            
            {/* Griglia articoli */}
            <div className="lg:col-span-3">
              <BlogGrid />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
