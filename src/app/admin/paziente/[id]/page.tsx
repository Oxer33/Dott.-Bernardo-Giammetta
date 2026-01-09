// =============================================================================
// ADMIN - VISUALIZZA PAZIENTE
// Pagina admin per vedere il profilo di un paziente specifico
// =============================================================================

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';
import { PatientProfileView } from '@/components/admin/PatientProfileView';

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: 'Profilo Paziente - Admin',
  description: 'Visualizza il profilo del paziente',
};

// =============================================================================
// PAGE COMPONENT
// =============================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPatientPage({ params }: PageProps) {
  const { id } = await params;
  
  // Verifica autenticazione
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/accedi?callbackUrl=/admin');
  }

  // Verifica che sia admin
  const isMaster = session.user.role === 'ADMIN' || 
    (session.user.email && isMasterAccount(session.user.email));
  
  if (!isMaster) {
    redirect('/area-personale');
  }

  // Recupera dati paziente
  const patient = await db.user.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { startTime: 'desc' },
        take: 10,
      },
      questionnaires: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  // Serializza date per il client
  const serializedPatient = {
    ...patient,
    birthDate: patient.birthDate?.toISOString().split('T')[0] || null,
    whitelistedAt: patient.whitelistedAt?.toISOString() || null,
    createdAt: patient.createdAt.toISOString(),
    updatedAt: patient.updatedAt.toISOString(),
    lastVisitAt: patient.lastVisitAt?.toISOString() || null,
    emailVerified: patient.emailVerified?.toISOString() || null,
    verificationExpires: patient.verificationExpires?.toISOString() || null,
    appointments: patient.appointments.map(apt => ({
      ...apt,
      startTime: apt.startTime.toISOString(),
      createdAt: apt.createdAt.toISOString(),
      updatedAt: apt.updatedAt.toISOString(),
      cancelledAt: apt.cancelledAt?.toISOString() || null,
    })),
    questionnaires: patient.questionnaires.map(q => ({
      ...q,
      createdAt: q.createdAt.toISOString(),
      reminderSentAt: q.reminderSentAt?.toISOString() || null,
    })),
  };

  return <PatientProfileView patient={serializedPatient} />;
}
