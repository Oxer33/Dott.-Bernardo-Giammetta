// =============================================================================
// AWS SES EMAIL SERVICE - DOTT. BERNARDO GIAMMETTA
// Servizio per invio email tramite Amazon Simple Email Service
// Alternativa a Resend per produzione con dominio verificato
// =============================================================================

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// =============================================================================
// CONFIGURAZIONE CLIENT AWS SES
// =============================================================================

// Inizializza client SES solo se le credenziali sono configurate
const sesClient = process.env.AWS_SES_ACCESS_KEY_ID && process.env.AWS_SES_SECRET_ACCESS_KEY
  ? new SESClient({
      region: process.env.AWS_SES_REGION || 'eu-south-1', // Milano region
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      },
    })
  : null;

// Email mittente verificata su AWS SES
const FROM_EMAIL = process.env.AWS_SES_FROM_EMAIL || 'noreply@bernardogiammetta.com';
const FROM_NAME = 'Dott. Bernardo Giammetta';

// =============================================================================
// TIPI
// =============================================================================

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// =============================================================================
// FUNZIONE INVIO EMAIL
// =============================================================================

/**
 * Invia email tramite AWS SES
 * @param options Opzioni email (to, subject, text/html)
 * @returns Risultato invio con messageId o errore
 */
export async function sendEmailSES(options: EmailOptions): Promise<SendEmailResult> {
  // Verifica che SES sia configurato
  if (!sesClient) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[AWS SES] Client non configurato - email non inviata');
      console.warn('[AWS SES] Configura AWS_SES_ACCESS_KEY_ID e AWS_SES_SECRET_ACCESS_KEY');
    }
    return { 
      success: false, 
      error: 'AWS SES non configurato' 
    };
  }

  try {
    // Normalizza destinatari in array
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

    // Costruisci comando invio email
    const command = new SendEmailCommand({
      Source: `${FROM_NAME} <${FROM_EMAIL}>`,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: options.subject,
        },
        Body: {
          // Preferisce HTML se disponibile, altrimenti testo
          ...(options.html && {
            Html: {
              Charset: 'UTF-8',
              Data: options.html,
            },
          }),
          ...(options.text && {
            Text: {
              Charset: 'UTF-8',
              Data: options.text,
            },
          }),
        },
      },
      // Reply-To opzionale
      ...(options.replyTo && {
        ReplyToAddresses: [options.replyTo],
      }),
    });

    // Invia email
    const response = await sesClient.send(command);

    return {
      success: true,
      messageId: response.MessageId,
    };

  } catch (error) {
    // Log errore solo in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[AWS SES] Errore invio email:', error);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
    };
  }
}

// =============================================================================
// TEMPLATE EMAIL
// =============================================================================

/**
 * Genera HTML email con stile coerente
 */
export function generateEmailHTML(content: {
  greeting: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  footer?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dott. Bernardo Giammetta</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #e5e5e0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #6b8f71, #8ba888); padding: 12px 20px; border-radius: 12px;">
                <span style="color: white; font-weight: bold; font-size: 20px;">BG</span>
              </div>
              <h1 style="margin: 16px 0 0; color: #2d3e30; font-size: 24px; font-weight: 600;">
                Dott. Bernardo Giammetta
              </h1>
              <p style="margin: 4px 0 0; color: #6b8f71; font-size: 14px;">
                Biologo Nutrizionista
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; color: #2d3e30; font-size: 16px; line-height: 1.6;">
                ${content.greeting}
              </p>
              <div style="color: #4a5e4d; font-size: 15px; line-height: 1.7;">
                ${content.body.replace(/\n/g, '<br>')}
              </div>
              
              ${content.ctaText && content.ctaUrl ? `
              <div style="margin: 32px 0; text-align: center;">
                <a href="${content.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #6b8f71, #8ba888); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px;">
                  ${content.ctaText}
                </a>
              </div>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background: #f9faf9; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e5e0;">
              <p style="margin: 0; color: #6b8f71; font-size: 13px; text-align: center;">
                ${content.footer || 'Un caro saluto,<br><strong>Dott. Bernardo Giammetta</strong>'}
              </p>
              <p style="margin: 16px 0 0; color: #9ca89e; font-size: 12px; text-align: center;">
                📞 +39 392 0979135 | 📧 info@bernardogiammetta.com
              </p>
              <p style="margin: 8px 0 0; color: #9ca89e; font-size: 11px; text-align: center;">
                <a href="https://www.bernardogiammetta.com" style="color: #6b8f71; text-decoration: none;">
                  www.bernardogiammetta.com
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// =============================================================================
// EMAIL PREDEFINITE
// =============================================================================

/**
 * Invia email di benvenuto a nuovo utente registrato
 */
export async function sendWelcomeEmail(user: { 
  email: string; 
  name?: string | null;
}): Promise<SendEmailResult> {
  const name = user.name || 'paziente';
  
  const html = generateEmailHTML({
    greeting: `Ciao ${name}! 👋`,
    body: `
Benvenuto/a nel mio studio online!

Sono felice che tu abbia creato un account. Questo è il primo passo verso un percorso di benessere personalizzato.

<strong>Cosa succede ora?</strong>

Il tuo account è stato creato ma per poter prenotare una visita dovrai essere approvato/a. 
Questo mi permette di garantire un servizio di qualità e dedicare il giusto tempo ad ogni paziente.

Una volta approvato/a, riceverai una notifica e potrai prenotare la tua prima visita direttamente dal sito.

Se hai domande nel frattempo, non esitare a contattarmi!
    `.trim(),
    ctaText: 'Visita il Sito',
    ctaUrl: 'https://www.bernardogiammetta.com',
  });

  return sendEmailSES({
    to: user.email,
    subject: 'Benvenuto/a! 🌱 Il tuo account è stato creato',
    html,
    text: `Ciao ${name}!\n\nBenvenuto/a nel mio studio online!\n\nIl tuo account è stato creato. Una volta approvato potrai prenotare le tue visite.\n\nA presto,\nDott. Bernardo Giammetta`,
  });
}

/**
 * Invia notifica approvazione whitelist
 */
export async function sendWhitelistApprovedEmail(user: { 
  email: string; 
  name?: string | null;
}): Promise<SendEmailResult> {
  const name = user.name || 'paziente';
  
  const html = generateEmailHTML({
    greeting: `Ottime notizie, ${name}! 🎉`,
    body: `
Il tuo account è stato approvato!

Ora puoi accedere al sito e prenotare le tue visite direttamente dal calendario online.

<strong>Come prenotare:</strong>
1. Accedi al sito con le tue credenziali
2. Vai alla sezione "Prenota"
3. Scegli data e ora che preferisci
4. Conferma la prenotazione

Non vedo l'ora di iniziare questo percorso insieme!
    `.trim(),
    ctaText: 'Prenota Ora',
    ctaUrl: 'https://www.bernardogiammetta.com/agenda',
  });

  return sendEmailSES({
    to: user.email,
    subject: 'Account Approvato! 🎉 Ora puoi prenotare',
    html,
    text: `Ciao ${name}!\n\nIl tuo account è stato approvato! Ora puoi accedere al sito e prenotare le tue visite.\n\nVisita: https://www.bernardogiammetta.com/agenda\n\nA presto,\nDott. Bernardo Giammetta`,
  });
}

// =============================================================================
// VERIFICA CONFIGURAZIONE
// =============================================================================

/**
 * Verifica se AWS SES è configurato correttamente
 */
export function isSESConfigured(): boolean {
  return !!(
    process.env.AWS_SES_ACCESS_KEY_ID && 
    process.env.AWS_SES_SECRET_ACCESS_KEY &&
    process.env.AWS_SES_FROM_EMAIL
  );
}

/**
 * Ritorna stato configurazione SES per debug
 */
export function getSESStatus(): {
  configured: boolean;
  region: string;
  fromEmail: string;
} {
  return {
    configured: isSESConfigured(),
    region: process.env.AWS_SES_REGION || 'eu-south-1',
    fromEmail: process.env.AWS_SES_FROM_EMAIL || 'non configurato',
  };
}
