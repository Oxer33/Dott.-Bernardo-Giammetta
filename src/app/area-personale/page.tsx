// =============================================================================
// AREA PERSONALE - DOTT. BERNARDO GIAMMETTA
// Dashboard personalizzata in base al ruolo utente
// Master: gestione completa | Pazienti: appuntamenti | Guest: redirect
// =============================================================================

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
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
// PAGE COMPONENT
// =============================================================================

export default async function AreaPersonalePage() {
  const session = await getServerSession(authOptions);
  
  // Non autenticato -> mostra vista guest
  if (!session?.user) {
    return <GuestView />;
  }
  
  const email = session.user.email!;
  const isMaster = isMasterAccount(email);
  
  // Recupera o crea utente nel database
  let user = await db.user.findUnique({
    where: { email },
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
        // Recupera TUTTI gli appuntamenti per storico completo (inclusi cancellati e completati)
        orderBy: {
          startTime: 'desc',
        },
        take: 50, // Ultimi 50 appuntamenti
      },
    },
  });
  
  // Se l'utente non esiste nel DB, crealo
  if (!user) {
    try {
      user = await db.user.create({
        data: {
          email,
          name: session.user.name,
          image: session.user.image,
          role: isMaster ? 'ADMIN' : 'PATIENT',
          isWhitelisted: isMaster, // Master sempre in whitelist
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
  
  // Se è master ma non ha ruolo ADMIN nel DB, aggiornalo automaticamente
  if (isMaster && (user.role !== 'ADMIN' || !user.isWhitelisted)) {
    try {
      user = await db.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          isWhitelisted: true,
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
      console.error('Errore aggiornamento master:', error);
    }
  }
  
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
