// =============================================================================
// API REGISTRAZIONE - DOTT. BERNARDO GIAMMETTA
// Endpoint per registrazione utenti con email e password
// =============================================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { isValidEmail } from '@/lib/utils';
import { sendVerificationEmail } from '@/lib/nodemailer';
import { SITE_CONFIG } from '@/lib/config';

// =============================================================================
// POST - Registra nuovo utente
// =============================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, firstName, lastName, phone } = body;

    // Validazione email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Email non valida' },
        { status: 400 }
      );
    }

    // Validazione password (minimo 8 caratteri, almeno una lettera e un numero)
    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'La password deve essere di almeno 8 caratteri' },
        { status: 400 }
      );
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return NextResponse.json(
        { success: false, error: 'La password deve contenere almeno una lettera e un numero' },
        { status: 400 }
      );
    }

    // Normalizza email
    const normalizedEmail = email.toLowerCase().trim();

    // Verifica se l'utente esiste già
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // Se l'utente esiste ma non ha password, può impostarla
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.user.update({
          where: { email: normalizedEmail },
          data: { 
            password: hashedPassword,
            // Aggiorna anche nome se fornito e non presente
            name: existingUser.name || name || `${firstName || ''} ${lastName || ''}`.trim() || null,
            firstName: existingUser.firstName || firstName || null,
            lastName: existingUser.lastName || lastName || null,
            phone: existingUser.phone || phone || null,
          },
        });
        
        return NextResponse.json({
          success: true,
          message: 'Password impostata con successo. Ora puoi accedere con email e password.',
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Esiste già un account con questa email' },
        { status: 400 }
      );
    }

    // Hash password con bcrypt (12 rounds per sicurezza)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crea nome completo se forniti nome e cognome
    const fullName = name || (firstName && lastName ? `${firstName} ${lastName}` : null);

    // Genera token di verifica email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ore

    // Crea nuovo utente
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: fullName,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        // Nuovi utenti non sono in whitelist - devono essere approvati dall'admin
        isWhitelisted: false,
        role: 'PATIENT',
        // Token verifica email
        verificationToken,
        verificationExpires,
        // Email non ancora verificata
        emailVerified: null,
      },
    });

    // Invia email di verifica
    const verificationUrl = `${SITE_CONFIG.url}/api/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail({
      email: user.email,
      name: fullName || user.email,
      verificationUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Account creato! Controlla la tua email per verificare l\'account.',
      requiresVerification: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    // Log solo in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Errore registrazione:', error);
    }
    
    return NextResponse.json(
      { success: false, error: 'Errore durante la registrazione' },
      { status: 500 }
    );
  }
}
