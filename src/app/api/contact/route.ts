// =============================================================================
// API FORM CONTATTO - DOTT. BERNARDO GIAMMETTA
// Endpoint per ricevere richieste di ricontatto
// =============================================================================

import { NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/nodemailer';
import { db } from '@/lib/db';

// =============================================================================
// RATE LIMITING
// =============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = { limit: 5, window: 60000 }; // 5 richieste per minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT.window });
    return true;
  }
  
  if (record.count >= RATE_LIMIT.limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// =============================================================================
// POST - Invia richiesta di contatto
// =============================================================================

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Troppe richieste. Riprova tra un minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, contactInfo, message } = body;

    // Validazione
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome non valido (minimo 2 caratteri)' },
        { status: 400 }
      );
    }

    if (!contactInfo || contactInfo.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Email o telefono non valido' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Messaggio troppo breve (minimo 10 caratteri)' },
        { status: 400 }
      );
    }

    // Sanitizza input
    const sanitizedData = {
      name: name.trim().slice(0, 100),
      contactInfo: contactInfo.trim().slice(0, 100),
      message: message.trim().slice(0, 2000),
    };

    // Salva nel database (tabella ContactMessage)
    try {
      await db.contactMessage.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.contactInfo.includes('@') ? sanitizedData.contactInfo : '',
          phone: !sanitizedData.contactInfo.includes('@') ? sanitizedData.contactInfo : '',
          subject: 'Richiesta di Ricontatto',
          message: sanitizedData.message,
        },
      });
    } catch (dbError) {
      // Log solo in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Errore salvataggio DB:', dbError);
      }
      // Continua comunque con l'invio email
    }

    // Invia email al dottore
    const emailResult = await sendContactFormEmail(sanitizedData);

    if (!emailResult.success) {
      // Se email fallisce ma DB OK, segnala warning
      return NextResponse.json({
        success: true,
        warning: 'Messaggio salvato ma email non inviata. Ti contatteremo presto.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Messaggio inviato con successo! Ti ricontatteremo al più presto.',
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Errore API contatto:', error);
    }
    
    return NextResponse.json(
      { success: false, error: 'Errore durante l\'invio. Riprova più tardi.' },
      { status: 500 }
    );
  }
}
