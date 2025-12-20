// =============================================================================
// AREA PERSONALE - DOTT. BERNARDO GIAMMETTA
// Dashboard personalizzata in base al ruolo utente
// Master: gestione completa | Pazienti: appuntamenti | Guest: redirect
// =============================================================================

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { MasterDashboard } from '@/components/area-personale/MasterDashboard';
import { PatientDashboard } from '@/components/area-personale/PatientDashboard';
import { GuestView } from '@/components/area-personale/GuestView';

// =============================================================================
// METADATA
// =============================================================================

export const metadata = {
  title: 'Area Personale',
  description: 'Gestisci i tuoi appuntamenti e il tuo profilo',
};

// =============================================================================
// COSTANTI
// =============================================================================

const MASTER_EMAIL = 'accomodationlapulena@gmail.com';

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function AreaPersonalePage() {
  const session = await getServerSession(authOptions);
  
  // Non autenticato -> mostra vista guest
  if (!session?.user) {
    return <GuestView />;
  }
  
  // Recupera o crea utente nel database
  let user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isWhitelisted: true,
      firstName: true,
      lastName: true,
      phone: true,
      birthDate: true,
      birthPlace: true,
      birthProvince: true,
      gender: true,
      codiceFiscale: true,
      address: true,
      addressNumber: true,
      city: true,
      province: true,
      cap: true,
      appointments: {
        where: {
          status: 'CONFIRMED',
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 10,
      },
    },
  });
  
  // Se l'utente non esiste nel DB, crealo (può succedere con JWT session)
  if (!user) {
    try {
      // Verifica se è account master
      const isMasterEmail = session.user.email === MASTER_EMAIL;
      
      user = await db.user.create({
        data: {
          email: session.user.email!,
          name: session.user.name,
          image: session.user.image,
          role: isMasterEmail ? 'ADMIN' : 'PATIENT',
          isWhitelisted: isMasterEmail, // Master sempre in whitelist
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isWhitelisted: true,
          firstName: true,
          lastName: true,
          phone: true,
          birthDate: true,
          birthPlace: true,
          birthProvince: true,
          gender: true,
          codiceFiscale: true,
          address: true,
          addressNumber: true,
          city: true,
          province: true,
          cap: true,
          appointments: true,
        },
      });
    } catch (error) {
      console.error('Errore creazione utente:', error);
      return <GuestView isLoggedIn userName={session.user.name} />;
    }
  }
  
  // Verifica se è l'account master
  const isMaster = user.email === MASTER_EMAIL || user.role === 'ADMIN';
  
  // Master -> dashboard completa
  if (isMaster) {
    return <MasterDashboard user={user} />;
  }
  
  // Paziente in whitelist -> dashboard paziente
  if (user.isWhitelisted) {
    return <PatientDashboard user={user} />;
  }
  
  // Non in whitelist -> vista guest con messaggio
  return <GuestView isLoggedIn userName={user.name} />;
}
