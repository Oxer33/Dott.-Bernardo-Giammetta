// =============================================================================
// GOOGLE ANALYTICS 4 - DOTT. BERNARDO GIAMMETTA
// Componente per integrazione GA4 con rispetto GDPR
// =============================================================================

'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// =============================================================================
// CONFIGURAZIONE
// =============================================================================

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// =============================================================================
// COMPONENTE GA
// =============================================================================

export function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  // Controlla se l'utente ha dato il consenso
  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        setConsentGiven(parsed.analytics === true);
      }
    };

    checkConsent();
    
    // Ascolta cambiamenti nel localStorage
    window.addEventListener('storage', checkConsent);
    return () => window.removeEventListener('storage', checkConsent);
  }, []);

  // Non caricare se non c'è ID o consenso
  if (!GA_MEASUREMENT_ID || !consentGiven) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}

// =============================================================================
// FUNZIONI HELPER PER TRACKING EVENTI
// =============================================================================

// Traccia evento generico
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Traccia prenotazione appuntamento
export function trackAppointmentBooking(type: 'first_visit' | 'follow_up') {
  trackEvent('book_appointment', 'Appointments', type);
}

// Traccia invio form contatti
export function trackContactFormSubmit() {
  trackEvent('submit', 'Contact Form', 'contact_page');
}

// Traccia click su CTA
export function trackCTAClick(ctaName: string, location: string) {
  trackEvent('cta_click', 'CTA', `${ctaName}_${location}`);
}

// Traccia visualizzazione pagina
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}
