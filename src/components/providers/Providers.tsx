// =============================================================================
// PROVIDERS - DOTT. BERNARDO GIAMMETTA
// Wrapper per tutti i context providers dell'applicazione
// SessionProvider: autenticazione NextAuth
// ThemeProvider: gestione dark mode (futuro)
// =============================================================================

'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface ProvidersProps {
  children: ReactNode;
}

// =============================================================================
// PROVIDERS COMPONENT
// Wrappa l'applicazione con tutti i provider necessari
// =============================================================================

export function Providers({ children }: ProvidersProps) {
  return (
    // SessionProvider: gestisce lo stato di autenticazione globalmente
    <SessionProvider>
      {/* ThemeProvider: gestisce dark/light mode */}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
