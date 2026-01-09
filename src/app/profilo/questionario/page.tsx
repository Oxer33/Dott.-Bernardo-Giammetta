// =============================================================================
// QUESTIONARIO PRIMA VISITA - DOTT. BERNARDO GIAMMETTA
// Pagina per compilare il questionario obbligatorio prima della prima visita
// I questionari NON sono modificabili, si può solo crearne uno nuovo
// =============================================================================

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { QuestionnaireFormNew } from '@/components/profile/QuestionnaireFormNew';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Questionario Prima Visita',
  description: 'Compila il questionario obbligatorio per la tua prima visita con il Dott. Bernardo Giammetta.',
};

// =============================================================================
// PAGE COMPONENT - PROTETTA
// =============================================================================

export default async function QuestionarioPage({
  searchParams,
}: {
  searchParams: { copyFrom?: string };
}) {
  // Verifica autenticazione
  const session = await getServerSession(authOptions);
  
  // Se non autenticato, redirect a login
  if (!session?.user) {
    redirect('/accedi?callbackUrl=/profilo/questionario');
  }

  // Recupera dati utente dal database
  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      birthDate: true,
      birthPlace: true,
      address: true,
      addressNumber: true,
      cap: true,
      city: true,
      codiceFiscale: true,
    },
  });

  if (!user) {
    redirect('/accedi');
  }

  // Se c'è un parametro copyFrom, recupera il questionario da copiare
  let copyFromQuestionnaire = null;
  if (searchParams.copyFrom) {
    const existingQuestionnaire = await db.questionnaire.findFirst({
      where: {
        id: searchParams.copyFrom,
        userId: user.id, // Sicurezza: solo questionari dell'utente
      },
    });

    if (existingQuestionnaire) {
      copyFromQuestionnaire = {
        commonAnswers: JSON.parse(existingQuestionnaire.commonAnswers),
        dietAnswers: JSON.parse(existingQuestionnaire.dietAnswers),
        billingData: JSON.parse(existingQuestionnaire.billingData),
        dietType: existingQuestionnaire.dietType,
      };
    }
  }

  // Formatta data di nascita se presente
  const formattedBirthDate = user.birthDate 
    ? format(new Date(user.birthDate), 'd MMMM yyyy', { locale: it })
    : null;
  
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-sage-400 to-sage-600 text-white py-12 lg:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              {copyFromQuestionnaire ? 'Nuovo Questionario' : 'Prima Visita'}
            </span>
            <h1 className="text-display-md lg:text-display-lg mb-4">
              Questionario <em className="text-sage-100">Alimentare</em>
            </h1>
            <p className="text-sage-100 text-lg leading-relaxed">
              {copyFromQuestionnaire 
                ? 'Stai creando un nuovo questionario partendo da quello precedente. Puoi modificare tutte le risposte.'
                : 'Questo questionario è fondamentale per permettermi di preparare al meglio la tua consulenza. Prenditi tutto il tempo necessario per rispondere con precisione.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container-custom">
          <QuestionnaireFormNew 
            userEmail={user.email || ''} 
            userName={user.name}
            userPhone={user.phone}
            userBirthDate={formattedBirthDate}
            existingBillingData={{
              birthPlace: user.birthPlace || undefined,
              address: user.address || undefined,
              addressNumber: user.addressNumber || undefined,
              cap: user.cap || undefined,
              city: user.city || undefined,
              codiceFiscale: user.codiceFiscale || undefined,
            }}
            copyFromQuestionnaire={copyFromQuestionnaire}
          />
        </div>
      </section>
    </div>
  );
}
