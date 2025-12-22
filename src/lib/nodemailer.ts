// =============================================================================
// NODEMAILER SERVICE - DOTT. BERNARDO GIAMMETTA
// Servizio email con SMTP Aruba per invio email transazionali
// =============================================================================

import nodemailer from 'nodemailer';
import { SITE_CONFIG } from '@/lib/config';

// =============================================================================
// CONFIGURAZIONE SMTP ARUBA
// =============================================================================

// Transporter Nodemailer per SMTP Aruba
// Configurazione: smtps.aruba.it:465 con SSL
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtps.aruba.it',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // SSL per porta 465
  auth: {
    user: process.env.SMTP_USER || 'info@bernardogiammetta.com',
    pass: process.env.SMTP_PASSWORD,
  },
  // Timeout e retry
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
});

// Email mittente
const FROM_EMAIL = process.env.SMTP_USER || 'info@bernardogiammetta.com';
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
 * Invia email tramite SMTP Aruba
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  // Verifica che SMTP sia configurato
  if (!process.env.SMTP_PASSWORD) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[SMTP] Password non configurata - email non inviata');
    }
    return { 
      success: false, 
      error: 'SMTP non configurato' 
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[SMTP] Errore invio email:', error);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
    };
  }
}

// =============================================================================
// TEMPLATE EMAIL HTML
// =============================================================================

/**
 * Genera HTML email con stile coerente
 */
export function generateEmailTemplate(content: {
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
                📞 ${SITE_CONFIG.phone} | 📧 ${SITE_CONFIG.email}
              </p>
              <p style="margin: 8px 0 0; color: #9ca89e; font-size: 11px; text-align: center;">
                <a href="${SITE_CONFIG.url}" style="color: #6b8f71; text-decoration: none;">
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
// EMAIL FORM CONTATTO
// =============================================================================

/**
 * Invia email dal form di contatto/ricontatto al dottore
 */
export async function sendContactFormEmail(data: {
  name: string;
  contactInfo: string; // Email o telefono
  message: string;
}): Promise<SendEmailResult> {
  const html = generateEmailTemplate({
    greeting: `Nuovo messaggio dal sito web`,
    body: `
<strong>Da:</strong> ${data.name}
<strong>Contatto:</strong> ${data.contactInfo}

<strong>Messaggio:</strong>
${data.message}
    `.trim(),
    footer: `Questo messaggio è stato inviato dal form di contatto del sito web.<br>Rispondi direttamente a questo indirizzo: ${data.contactInfo}`,
  });

  return sendEmail({
    to: SITE_CONFIG.doctorEmail,
    subject: `📩 Nuovo messaggio da ${data.name}`,
    html,
    text: `Nuovo messaggio da: ${data.name}\nContatto: ${data.contactInfo}\n\nMessaggio:\n${data.message}`,
    replyTo: data.contactInfo.includes('@') ? data.contactInfo : undefined,
  });
}

// =============================================================================
// EMAIL VERIFICA ACCOUNT
// =============================================================================

/**
 * Invia email di verifica per nuovo account
 */
export async function sendVerificationEmail(data: {
  email: string;
  name: string;
  verificationUrl: string;
}): Promise<SendEmailResult> {
  const html = generateEmailTemplate({
    greeting: `Ciao ${data.name}! 👋`,
    body: `
Grazie per esserti registrato/a sul mio sito web!

Per completare la registrazione e attivare il tuo account, clicca sul pulsante qui sotto per verificare il tuo indirizzo email.

<strong>⚠️ Importante:</strong> Questo link scadrà tra 24 ore.

Se non hai richiesto tu questa registrazione, puoi ignorare questa email.
    `.trim(),
    ctaText: 'Verifica Email',
    ctaUrl: data.verificationUrl,
  });

  return sendEmail({
    to: data.email,
    subject: '✉️ Verifica il tuo indirizzo email',
    html,
    text: `Ciao ${data.name}!\n\nPer verificare il tuo account, visita questo link:\n${data.verificationUrl}\n\nIl link scade tra 24 ore.\n\nDott. Bernardo Giammetta`,
  });
}

// =============================================================================
// EMAIL CONFERMA PRENOTAZIONE
// =============================================================================

/**
 * Invia email conferma prenotazione al paziente
 */
export async function sendBookingConfirmationToPatient(data: {
  patientEmail: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
}): Promise<SendEmailResult> {
  const html = generateEmailTemplate({
    greeting: `Ciao ${data.patientName}! 🎉`,
    body: `
La tua prenotazione è stata confermata!

<strong>📅 Dettagli appuntamento:</strong>
• <strong>Data:</strong> ${data.appointmentDate}
• <strong>Ora:</strong> ${data.appointmentTime}
• <strong>Tipo:</strong> ${data.appointmentType}

<strong>📍 Dove:</strong>
Studio Dott. Bernardo Giammetta
(L'indirizzo ti verrà comunicato separatamente)

<strong>📝 Cosa portare:</strong>
• Eventuali esami del sangue recenti
• Lista dei farmaci che assumi
• Diario alimentare degli ultimi 3 giorni (se disponibile)

In caso di imprevisti, ti prego di avvisare almeno 48 ore prima per disdire o riprogrammare.
    `.trim(),
    ctaText: 'Vai all\'Area Personale',
    ctaUrl: `${SITE_CONFIG.url}/area-personale`,
  });

  return sendEmail({
    to: data.patientEmail,
    subject: `✅ Prenotazione Confermata - ${data.appointmentDate}`,
    html,
    text: `Prenotazione confermata!\n\nData: ${data.appointmentDate}\nOra: ${data.appointmentTime}\nTipo: ${data.appointmentType}\n\nA presto!\nDott. Bernardo Giammetta`,
  });
}

/**
 * Invia notifica nuova prenotazione al dottore
 */
export async function sendBookingNotificationToDoctor(data: {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
}): Promise<SendEmailResult> {
  const html = generateEmailTemplate({
    greeting: `Nuova prenotazione! 📅`,
    body: `
Un paziente ha prenotato una visita:

<strong>👤 Paziente:</strong>
• <strong>Nome:</strong> ${data.patientName}
• <strong>Email:</strong> ${data.patientEmail}
${data.patientPhone ? `• <strong>Telefono:</strong> ${data.patientPhone}` : ''}

<strong>📅 Appuntamento:</strong>
• <strong>Data:</strong> ${data.appointmentDate}
• <strong>Ora:</strong> ${data.appointmentTime}
• <strong>Tipo:</strong> ${data.appointmentType}
    `.trim(),
    ctaText: 'Vai alla Dashboard',
    ctaUrl: `${SITE_CONFIG.url}/area-personale`,
    footer: 'Notifica automatica dal sistema di prenotazioni.',
  });

  return sendEmail({
    to: SITE_CONFIG.doctorEmail,
    subject: `📅 Nuova Prenotazione: ${data.patientName} - ${data.appointmentDate}`,
    html,
    text: `Nuova prenotazione!\n\nPaziente: ${data.patientName}\nEmail: ${data.patientEmail}\nData: ${data.appointmentDate}\nOra: ${data.appointmentTime}`,
  });
}

// =============================================================================
// VERIFICA CONFIGURAZIONE
// =============================================================================

/**
 * Verifica se SMTP è configurato correttamente
 */
export function isSMTPConfigured(): boolean {
  return !!(process.env.SMTP_PASSWORD);
}

/**
 * Test connessione SMTP
 */
export async function testSMTPConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}
