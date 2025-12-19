// =============================================================================
// SCHEMA.ORG COMPONENTS - DOTT. BERNARDO GIAMMETTA
// Componenti per dati strutturati Schema.org per SEO avanzata
// =============================================================================

import Script from 'next/script';

// =============================================================================
// TIPI
// =============================================================================

interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  url?: string;
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

// =============================================================================
// LOCAL BUSINESS SCHEMA (per Physician/Nutritionist)
// =============================================================================

export function LocalBusinessSchema({
  name = 'Dott. Bernardo Giammetta',
  description = 'Biologo Nutrizionista specializzato in nutrizione funzionale e metabolismo',
  telephone = '+39 392 0979135',
  email = 'info@bernardogiammetta.com',
  address = {
    street: 'Via Roma 123',
    city: 'Roma',
    postalCode: '00100',
    country: 'IT',
  },
  openingHours = ['Mo-Fr 09:00-18:00', 'Sa 09:00-13:00'],
  priceRange = '€€',
  image = 'https://www.bernardogiammetta.com/images/dott-giammetta.jpg',
  url = 'https://www.bernardogiammetta.com',
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name,
    description,
    image,
    url,
    telephone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    openingHoursSpecification: openingHours.map(hours => {
      const [days, time] = hours.split(' ');
      const [opens, closes] = time.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split('-'),
        opens,
        closes,
      };
    }),
    priceRange,
    medicalSpecialty: 'Nutritionist',
    availableService: [
      {
        '@type': 'MedicalProcedure',
        name: 'Prima Visita Nutrizionale',
        description: 'Consulenza nutrizionale completa con anamnesi e piano personalizzato',
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Visita di Controllo',
        description: 'Monitoraggio del percorso nutrizionale e aggiustamenti',
      },
    ],
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// =============================================================================
// ARTICLE SCHEMA (per blog)
// =============================================================================

export function ArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image,
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Dott. Bernardo Giammetta',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bernardogiammetta.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// =============================================================================
// FAQ SCHEMA (per pagine con FAQ)
// =============================================================================

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// =============================================================================
// BREADCRUMB SCHEMA (per navigazione)
// =============================================================================

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// =============================================================================
// WEBSITE SCHEMA
// =============================================================================

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dott. Bernardo Giammetta - Biologo Nutrizionista',
    url: 'https://www.bernardogiammetta.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.bernardogiammetta.com/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
