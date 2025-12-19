// =============================================================================
// API: NUTRIBOT CHAT - DOTT. BERNARDO GIAMMETTA
// Endpoint per chat con NutriBot AI
// POST /api/chat
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { chatWithNutriBot, ChatMessage } from '@/lib/nutribot';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// =============================================================================
// RATE LIMITING SEMPLICE (in-memory)
// =============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // messaggi per finestra
const RATE_WINDOW = 60 * 1000; // 1 minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// =============================================================================
// FILTRO INPUT MALEVOLI
// =============================================================================

function sanitizeInput(text: string): string {
  // Rimuovi caratteri di controllo
  let sanitized = text.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Limita lunghezza
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }
  
  return sanitized.trim();
}

function detectMaliciousInput(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Pattern sospetti
  const suspiciousPatterns = [
    /ignore.*previous.*instructions/i,
    /ignore.*system.*prompt/i,
    /you.*are.*now/i,
    /pretend.*to.*be/i,
    /act.*as.*if/i,
    /reveal.*prompt/i,
    /show.*system/i,
    /execute.*code/i,
    /run.*command/i,
    /<script/i,
    /javascript:/i,
    /eval\(/i,
    /base64/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(lowerText));
}

// =============================================================================
// POST - Chat con NutriBot
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Troppe richieste. Attendi un momento prima di riprovare.' 
        },
        { status: 429 }
      );
    }
    
    // Parse body
    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Messaggi non validi' },
        { status: 400 }
      );
    }
    
    // Sanitizza l'ultimo messaggio
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      lastMessage.content = sanitizeInput(lastMessage.content);
      
      // Controlla input malevolo
      if (detectMaliciousInput(lastMessage.content)) {
        return NextResponse.json({
          success: true,
          message: "Sono NutriBot, l'assistente del Dott. Giammetta. Posso aiutarti solo con informazioni sul sito, i servizi offerti e il sistema di prenotazione. Come posso esserti utile?",
        });
      }
    }
    
    // Chat con NutriBot
    const response = await chatWithNutriBot(messages);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore nel processare la richiesta' 
      },
      { status: 500 }
    );
  }
}
