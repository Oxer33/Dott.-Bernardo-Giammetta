// =============================================================================
// API: SCADENZA WHITELIST - DOTT. BERNARDO GIAMMETTA
// Punto 9: Dopo 12 mesi dall'ultima visita, paziente torna in attesa
// DA CHIAMARE UNA VOLTA A SETTIMANA (non giornalmente)
// ESCLUDE pazienti con patientStatus = "COMPLETED" (Ultimati)
// Endpoint da chiamare via cron job settimanale o manualmente
// GET /api/cron/whitelist-expiry
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subMonths } from 'date-fns';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Chiave segreta per autorizzare chiamate cron (da env)
const CRON_SECRET = process.env.CRON_SECRET || 'default-cron-secret';

// =============================================================================
// GET - Controlla e aggiorna whitelist scadute
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Verifica autorizzazione (header o query param)
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Permetti chiamata da cron con secret o da admin loggato
    const isAuthorized = authHeader === `Bearer ${CRON_SECRET}` || secret === CRON_SECRET;
    
    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Non autorizzato' },
        { status: 403 }
      );
    }

    // Data limite: 12 mesi fa
    const expiryDate = subMonths(new Date(), 12);

    // Trova pazienti whitelisted con ultima visita > 12 mesi fa
    // O che non hanno mai fatto visite (lastVisitAt = null) e sono whitelisted da > 12 mesi
    // Punto 9: ESCLUDI pazienti con patientStatus = "COMPLETED" (Ultimati)
    const expiredPatients = await db.user.findMany({
      where: {
        role: 'PATIENT',
        isWhitelisted: true,
        // patientStatus: { not: 'COMPLETED' }, // TODO: Esclude pazienti ultimati (dopo migrazione DB)
        OR: [
          // Ultima visita più di 12 mesi fa
          {
            lastVisitAt: {
              lt: expiryDate
            }
          },
          // Mai fatto visite E whitelisted da più di 12 mesi
          {
            lastVisitAt: null,
            whitelistedAt: {
              lt: expiryDate
            }
          }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        lastVisitAt: true,
        whitelistedAt: true,
      }
    });

    // Aggiorna stato whitelist per pazienti scaduti
    const updateResult = await db.user.updateMany({
      where: {
        id: {
          in: expiredPatients.map(p => p.id)
        }
      },
      data: {
        isWhitelisted: false,
        // Non resettiamo whitelistedAt così sappiamo quando erano stati approvati
      }
    });

    // Log risultato
    console.log(`[WHITELIST EXPIRY] Aggiornati ${updateResult.count} pazienti con whitelist scaduta`);

    return NextResponse.json({
      success: true,
      message: `Aggiornati ${updateResult.count} pazienti con whitelist scaduta`,
      expiredPatients: expiredPatients.map(p => ({
        id: p.id,
        email: p.email,
        name: p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.name,
        lastVisit: p.lastVisitAt,
        whitelistedAt: p.whitelistedAt
      })),
      expiryThreshold: expiryDate.toISOString()
    });

  } catch (error) {
    console.error('Errore whitelist expiry:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel controllo scadenze' },
      { status: 500 }
    );
  }
}
