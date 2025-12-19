// =============================================================================
// BREADCRUMBS - DOTT. BERNARDO GIAMMETTA
// Componente per navigazione breadcrumb
// =============================================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/SchemaOrg';

// =============================================================================
// MAPPA NOMI PAGINE
// =============================================================================

const pageNames: Record<string, string> = {
  'chi-sono': 'Chi Sono',
  'servizi': 'Servizi',
  'blog': 'Blog',
  'contatti': 'Contatti',
  'agenda': 'Prenota',
  'admin': 'Admin',
};

// =============================================================================
// COMPONENTE BREADCRUMBS
// =============================================================================

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Non mostrare sulla homepage
  if (pathname === '/') return null;
  
  // Genera breadcrumbs dal path
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.bernardogiammetta.com/' },
    ...segments.map((segment, index) => {
      const url = `https://www.bernardogiammetta.com/${segments.slice(0, index + 1).join('/')}`;
      const name = pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { name, url };
    }),
  ];
  
  return (
    <>
      {/* Schema.org per SEO */}
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* UI Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex items-center gap-1 text-sm text-sage-600">
          <li>
            <Link 
              href="/" 
              className="flex items-center gap-1 hover:text-sage-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join('/')}`;
            const name = pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            
            return (
              <li key={segment} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-sage-400" />
                {isLast ? (
                  <span className="font-medium text-sage-800" aria-current="page">
                    {name}
                  </span>
                ) : (
                  <Link 
                    href={href}
                    className="hover:text-sage-800 transition-colors"
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
