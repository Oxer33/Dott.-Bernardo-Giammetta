// =============================================================================
// API: PROFILO UTENTE - DOTT. BERNARDO GIAMMETTA
// Endpoint per aggiornare i dati del profilo utente (completo con anagrafici)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validaCodiceFiscale } from '@/lib/codice-fiscale';

// Forza rendering dinamico
export const dynamic = 'force-dynamic';

// =============================================================================
// TIPI
// =============================================================================

interface ProfileUpdateData {
  // Dati base
  name?: string;
  phone?: string;
  contactEmail?: string;
  // Dati anagrafici
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  birthPlace?: string;
  birthProvince?: string;
  gender?: 'M' | 'F';
  codiceFiscale?: string;
  // Dati residenza
  address?: string;
  addressNumber?: string;
  city?: string;
  province?: string;
  cap?: string;
}

// =============================================================================
// PUT - Aggiorna profilo utente (completo)
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    // Verifica autenticazione
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Leggi dati dal body
    const data: ProfileUpdateData = await request.json();

    // Validazione base
    if (data.firstName && data.firstName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome non valido (min 2 caratteri)' },
        { status: 400 }
      );
    }

    if (data.lastName && data.lastName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Cognome non valido (min 2 caratteri)' },
        { status: 400 }
      );
    }

    // Validazione codice fiscale se fornito
    if (data.codiceFiscale && !validaCodiceFiscale(data.codiceFiscale)) {
      return NextResponse.json(
        { success: false, error: 'Codice fiscale non valido' },
        { status: 400 }
      );
    }

    // Validazione CAP
    if (data.cap && !/^\d{5}$/.test(data.cap)) {
      return NextResponse.json(
        { success: false, error: 'CAP non valido (5 cifre)' },
        { status: 400 }
      );
    }

    // Prova a salvare nel database
    try {
      const { db } = await import('@/lib/db');
      
      // Costruisci nome completo
      const fullName = data.firstName && data.lastName 
        ? `${data.firstName.trim()} ${data.lastName.trim()}`
        : data.name?.trim();
      
      await db.user.update({
        where: { email: session.user.email },
        data: {
          // Nome completo (per retrocompatibilità)
          ...(fullName && { name: fullName }),
          ...(data.phone !== undefined && { phone: data.phone?.trim() || null }),
          // Dati anagrafici
          ...(data.firstName !== undefined && { firstName: data.firstName?.trim() || null }),
          ...(data.lastName !== undefined && { lastName: data.lastName?.trim() || null }),
          ...(data.birthDate !== undefined && { 
            birthDate: data.birthDate ? new Date(data.birthDate) : null 
          }),
          ...(data.birthPlace !== undefined && { birthPlace: data.birthPlace?.trim() || null }),
          ...(data.birthProvince !== undefined && { birthProvince: data.birthProvince?.toUpperCase()?.trim() || null }),
          ...(data.gender !== undefined && { gender: data.gender || null }),
          ...(data.codiceFiscale !== undefined && { codiceFiscale: data.codiceFiscale?.toUpperCase()?.trim() || null }),
          // Dati residenza
          ...(data.address !== undefined && { address: data.address?.trim() || null }),
          ...(data.addressNumber !== undefined && { addressNumber: data.addressNumber?.trim() || null }),
          ...(data.city !== undefined && { city: data.city?.trim() || null }),
          ...(data.province !== undefined && { province: data.province?.toUpperCase()?.trim() || null }),
          ...(data.cap !== undefined && { cap: data.cap?.trim() || null }),
          ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail?.trim() || null }),
          // Timestamp
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Profilo aggiornato con successo',
      });
    } catch (dbError) {
      console.error('Errore database salvataggio profilo:', dbError);
      return NextResponse.json(
        { success: false, error: 'Errore nel salvataggio dei dati' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Errore aggiornamento profilo:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel salvataggio' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Ottieni profilo utente (completo con anagrafici)
// =============================================================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Prova a leggere dal database
    try {
      const { db } = await import('@/lib/db');
      
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          // Dati anagrafici
          firstName: true,
          lastName: true,
          birthDate: true,
          birthPlace: true,
          birthProvince: true,
          gender: true,
          codiceFiscale: true,
          // Dati residenza
          address: true,
          addressNumber: true,
          city: true,
          province: true,
          cap: true,
          contactEmail: true,
          // Stato
          isWhitelisted: true,
          role: true,
          createdAt: true,
        },
      });

      if (user) {
        return NextResponse.json({ 
          success: true, 
          user: {
            ...user,
            // Formatta data per il frontend
            birthDate: user.birthDate?.toISOString().split('T')[0] || null,
          }
        });
      }
    } catch (dbError) {
      console.warn('Database non disponibile per lettura profilo');
    }

    // Fallback ai dati della sessione
    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone || null,
        isWhitelisted: session.user.isWhitelisted,
        role: session.user.role,
        // Campi anagrafici vuoti come fallback
        firstName: null,
        lastName: null,
        birthDate: null,
        birthPlace: null,
        birthProvince: null,
        gender: null,
        codiceFiscale: null,
        address: null,
        addressNumber: null,
        city: null,
        province: null,
        cap: null,
      },
    });

  } catch (error) {
    console.error('Errore lettura profilo:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero dati' },
      { status: 500 }
    );
  }
}
