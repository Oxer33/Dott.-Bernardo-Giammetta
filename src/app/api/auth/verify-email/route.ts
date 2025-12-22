// =============================================================================
// API VERIFICA EMAIL - DOTT. BERNARDO GIAMMETTA
// Endpoint per verificare email tramite token
// =============================================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SITE_CONFIG } from '@/lib/config';

// =============================================================================
// GET - Verifica token email
// =============================================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validazione token
    if (!token || token.length < 32) {
      return NextResponse.redirect(
        `${SITE_CONFIG.url}/accedi?error=Token non valido`
      );
    }

    // Cerca utente con questo token
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: {
          gt: new Date(), // Token non scaduto
        },
      },
    });

    if (!user) {
      return NextResponse.redirect(
        `${SITE_CONFIG.url}/accedi?error=Token scaduto o non valido. Registrati di nuovo.`
      );
    }

    // Verifica email e rimuovi token
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    });

    // Redirect alla pagina di successo
    return NextResponse.redirect(
      `${SITE_CONFIG.url}/accedi?verified=true`
    );

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Errore verifica email:', error);
    }
    
    return NextResponse.redirect(
      `${SITE_CONFIG.url}/accedi?error=Errore durante la verifica`
    );
  }
}
