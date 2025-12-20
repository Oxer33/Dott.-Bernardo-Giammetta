// =============================================================================
// TEST NUTRIBOT - DEBUG ENDPOINT
// Endpoint per testare NutriBot e vedere esattamente cosa fallisce
// =============================================================================

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    tests: {},
  };

  // Lista TUTTE le variabili d'ambiente (solo nomi, non valori sensibili)
  const allEnvKeys = Object.keys(process.env).filter(k => 
    k.includes('OPENROUTER') || 
    k.includes('GOOGLE') || 
    k.includes('NEXTAUTH') || 
    k.includes('DATABASE') ||
    k.includes('NEXT')
  );
  results.envKeysFound = allEnvKeys;

  // Test 1: Verifica API Key
  const apiKey = process.env.OPENROUTER_API_KEY;
  results.tests.apiKey = {
    exists: !!apiKey,
    length: apiKey?.length || 0,
    prefix: apiKey?.substring(0, 15) || 'MISSING',
    suffix: apiKey?.slice(-5) || 'MISSING',
    rawCheck: typeof process.env.OPENROUTER_API_KEY,
  };

  // Test 2: Prova chiamata OpenRouter
  if (apiKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://www.bernardogiammetta.com',
          'X-Title': 'NutriBot Test',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'user', content: 'Rispondi solo "OK" se funziona.' }
          ],
          max_tokens: 50,
        }),
      });

      const status = response.status;
      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      results.tests.openRouterCall = {
        status,
        ok: response.ok,
        response: responseData,
      };

      if (response.ok && responseData?.choices?.[0]?.message?.content) {
        results.tests.openRouterCall.aiResponse = responseData.choices[0].message.content;
      }
    } catch (error: any) {
      results.tests.openRouterCall = {
        error: error.message,
        stack: error.stack,
      };
    }
  } else {
    results.tests.openRouterCall = {
      skipped: true,
      reason: 'API key missing',
    };
  }

  // Test 3: Verifica variabili Google OAuth
  results.tests.googleOAuth = {
    clientId: !!process.env.GOOGLE_CLIENT_ID,
    clientIdPreview: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) || 'MISSING',
    clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'MISSING',
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  };

  // Test 4: Database URL
  results.tests.database = {
    urlConfigured: !!process.env.DATABASE_URL,
    urlPreview: process.env.DATABASE_URL?.substring(0, 30) || 'MISSING',
  };

  // Riepilogo
  const allTestsPassed = 
    results.tests.apiKey.exists &&
    results.tests.openRouterCall?.ok === true &&
    results.tests.googleOAuth.clientId &&
    results.tests.googleOAuth.clientSecret &&
    results.tests.googleOAuth.nextAuthSecret;

  results.summary = {
    allPassed: allTestsPassed,
    nutriBotWorking: results.tests.openRouterCall?.ok === true,
    googleAuthReady: results.tests.googleOAuth.clientId && results.tests.googleOAuth.clientSecret,
  };

  return NextResponse.json(results, { status: 200 });
}
