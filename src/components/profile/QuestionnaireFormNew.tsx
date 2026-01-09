// =============================================================================
// QUESTIONNAIRE FORM V2 - DOTT. BERNARDO GIAMMETTA
// Form questionario prima visita con domande condizionali per stile alimentare
// I questionari NON sono modificabili, si può solo crearne uno nuovo
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Utensils,
  ClipboardList,
  Receipt,
  Shield,
  Loader2
} from 'lucide-react';
import {
  COMMON_QUESTIONS,
  DIET_TYPE_QUESTION,
  OMNIVORE_QUESTIONS,
  VEGETARIAN_QUESTIONS,
  VEGAN_QUESTIONS,
  BILLING_QUESTIONS,
  Question,
  extractDietType,
  getDietQuestions,
} from '@/lib/questionnaire-config';

// =============================================================================
// TIPI
// =============================================================================

interface QuestionnaireFormNewProps {
  userEmail: string;
  userName?: string | null;
  userPhone?: string | null;
  userBirthDate?: string | null;
  // Dati esistenti dal profilo per precompilare
  existingBillingData?: {
    birthPlace?: string;
    address?: string;
    addressNumber?: string;
    cap?: string;
    city?: string;
    codiceFiscale?: string;
  };
  // Se stiamo copiando da un questionario esistente
  copyFromQuestionnaire?: {
    commonAnswers: Record<string, string>;
    dietAnswers: Record<string, string>;
    billingData: Record<string, string>;
    dietType: string;
  } | null;
}

// Sezioni del questionario
type Section = 'profile' | 'common' | 'dietType' | 'dietSpecific' | 'billing' | 'privacy';

const SECTION_INFO: Record<Section, { title: string; icon: typeof User; description: string }> = {
  profile: {
    title: 'Dati Personali',
    icon: User,
    description: 'Verifica i tuoi dati (già precompilati dal profilo)',
  },
  common: {
    title: 'Stile di Vita e Salute',
    icon: ClipboardList,
    description: 'Informazioni su lavoro, attività fisica, sonno e salute',
  },
  dietType: {
    title: 'Stile Alimentare',
    icon: Utensils,
    description: 'Seleziona il tuo stile alimentare',
  },
  dietSpecific: {
    title: 'Preferenze Alimentari',
    icon: Utensils,
    description: 'Domande specifiche per il tuo stile alimentare',
  },
  billing: {
    title: 'Dati Fatturazione',
    icon: Receipt,
    description: 'Dati per l\'emissione della fattura',
  },
  privacy: {
    title: 'Autorizzazione Privacy',
    icon: Shield,
    description: 'Consenso al trattamento dei dati',
  },
};

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function QuestionnaireFormNew({ 
  userEmail, 
  userName,
  userPhone,
  userBirthDate,
  existingBillingData,
  copyFromQuestionnaire,
}: QuestionnaireFormNewProps) {
  const router = useRouter();
  
  // State per le risposte
  const [commonAnswers, setCommonAnswers] = useState<Record<string, string>>({});
  const [dietTypeAnswer, setDietTypeAnswer] = useState('');
  const [dietAnswers, setDietAnswers] = useState<Record<string, string>>({});
  const [billingData, setBillingData] = useState<Record<string, string>>({});
  const [privacyConsent, setPrivacyConsent] = useState(false);
  
  // State navigazione
  const [currentSection, setCurrentSection] = useState<Section>('profile');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Inizializza dati da questionario esistente o profilo
  useEffect(() => {
    if (copyFromQuestionnaire) {
      setCommonAnswers(copyFromQuestionnaire.commonAnswers);
      setDietTypeAnswer(copyFromQuestionnaire.dietType);
      setDietAnswers(copyFromQuestionnaire.dietAnswers);
      setBillingData(copyFromQuestionnaire.billingData);
    } else if (existingBillingData) {
      setBillingData({
        billingBirthPlace: existingBillingData.birthPlace || '',
        billingAddress: existingBillingData.address || '',
        billingAddressNumber: existingBillingData.addressNumber || '',
        billingCap: existingBillingData.cap || '',
        billingCity: existingBillingData.city || '',
        billingCodiceFiscale: existingBillingData.codiceFiscale || '',
      });
    }
  }, [copyFromQuestionnaire, existingBillingData]);

  // Ottieni tipo dieta selezionato
  const selectedDietType = extractDietType(dietTypeAnswer);
  
  // Ottieni domande specifiche per la dieta selezionata
  const dietSpecificQuestions = selectedDietType ? getDietQuestions(selectedDietType) : [];

  // Calcola progresso
  const calculateProgress = () => {
    let total = 0;
    let answered = 0;
    
    // Common questions
    total += COMMON_QUESTIONS.length;
    answered += Object.values(commonAnswers).filter(v => v?.trim()).length;
    
    // Diet type
    total += 1;
    if (dietTypeAnswer) answered += 1;
    
    // Diet specific (solo se dieta selezionata)
    if (selectedDietType) {
      total += dietSpecificQuestions.length;
      answered += Object.values(dietAnswers).filter(v => v?.trim()).length;
    }
    
    // Billing
    total += BILLING_QUESTIONS.length;
    answered += Object.values(billingData).filter(v => v?.trim()).length;
    
    // Privacy
    total += 1;
    if (privacyConsent) answered += 1;
    
    return Math.round((answered / total) * 100);
  };

  // Verifica se sezione è completa
  const isSectionComplete = (section: Section): boolean => {
    switch (section) {
      case 'profile':
        return true; // Sempre completa (precompilata)
      case 'common':
        return COMMON_QUESTIONS.filter(q => q.required).every(q => commonAnswers[q.id]?.trim());
      case 'dietType':
        return !!dietTypeAnswer;
      case 'dietSpecific':
        return dietSpecificQuestions.filter(q => q.required).every(q => dietAnswers[q.id]?.trim());
      case 'billing':
        return BILLING_QUESTIONS.filter(q => q.required).every(q => billingData[q.id]?.trim());
      case 'privacy':
        return privacyConsent;
      default:
        return false;
    }
  };

  // Verifica se tutto il questionario è completo
  const isQuestionnaireComplete = (): boolean => {
    return (
      isSectionComplete('common') &&
      isSectionComplete('dietType') &&
      isSectionComplete('dietSpecific') &&
      isSectionComplete('billing') &&
      isSectionComplete('privacy')
    );
  };

  // Invia questionario
  const handleSubmit = async () => {
    if (!isQuestionnaireComplete()) {
      setSubmitError('Completa tutte le domande obbligatorie prima di inviare');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/user/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietTypeAnswer,
          commonAnswers,
          dietAnswers,
          billingData,
          privacyConsent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        // Redirect dopo 2 secondi
        setTimeout(() => {
          router.push('/area-personale');
        }, 2000);
      } else {
        setSubmitError(data.error || 'Errore nel salvataggio');
      }
    } catch (error) {
      setSubmitError('Errore di connessione. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigazione sezioni
  const sections: Section[] = ['profile', 'common', 'dietType', 'dietSpecific', 'billing', 'privacy'];
  
  const goToNextSection = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      // Salta dietSpecific se non c'è dieta selezionata
      let nextIndex = currentIndex + 1;
      if (sections[nextIndex] === 'dietSpecific' && !selectedDietType) {
        nextIndex++;
      }
      setCurrentSection(sections[nextIndex]);
      setCurrentQuestionIndex(0);
    }
  };

  const goToPrevSection = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      let prevIndex = currentIndex - 1;
      // Salta dietSpecific se non c'è dieta selezionata
      if (sections[prevIndex] === 'dietSpecific' && !selectedDietType) {
        prevIndex--;
      }
      setCurrentSection(sections[prevIndex]);
      setCurrentQuestionIndex(0);
    }
  };

  // Render domanda singola
  const renderQuestion = (question: Question, value: string, onChange: (val: string) => void) => (
    <div key={question.id} className="mb-6">
      <label className="block text-sage-800 font-medium mb-2">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {question.hint && (
        <p className="text-sm text-sage-500 mb-3 bg-sage-50 p-3 rounded-lg">
          💡 {question.hint}
        </p>
      )}

      {question.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full px-4 py-3 rounded-xl border border-sage-200 
                   focus:border-sage-400 focus:ring-2 focus:ring-sage-100
                   outline-none text-sage-800 placeholder:text-sage-400"
        />
      )}

      {question.type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-sage-200 
                   focus:border-sage-400 focus:ring-2 focus:ring-sage-100
                   outline-none text-sage-800 placeholder:text-sage-400 resize-none"
        />
      )}

      {question.type === 'radio' && question.options && (
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                value === option
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-sage-200 hover:border-sage-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-4 h-4 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-sage-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  // Render sezione
  const renderSection = () => {
    const sectionInfo = SECTION_INFO[currentSection];
    const SectionIcon = sectionInfo.icon;

    return (
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        {/* Header sezione */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-sage-100">
          <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
            <SectionIcon className="w-6 h-6 text-sage-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-sage-900">{sectionInfo.title}</h2>
            <p className="text-sm text-sage-500">{sectionInfo.description}</p>
          </div>
        </div>

        {/* Contenuto sezione */}
        <div className="space-y-6">
          {currentSection === 'profile' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Dati precompilati dal tuo profilo</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-sage-50 rounded-xl">
                  <p className="text-sm text-sage-500 mb-1">Nome</p>
                  <p className="font-medium text-sage-800">{userName || 'Non specificato'}</p>
                </div>
                <div className="p-4 bg-sage-50 rounded-xl">
                  <p className="text-sm text-sage-500 mb-1">Email</p>
                  <p className="font-medium text-sage-800">{userEmail}</p>
                </div>
                <div className="p-4 bg-sage-50 rounded-xl">
                  <p className="text-sm text-sage-500 mb-1">Telefono</p>
                  <p className="font-medium text-sage-800">{userPhone || 'Non specificato'}</p>
                </div>
                <div className="p-4 bg-sage-50 rounded-xl">
                  <p className="text-sm text-sage-500 mb-1">Data di Nascita</p>
                  <p className="font-medium text-sage-800">{userBirthDate || 'Non specificata'}</p>
                </div>
              </div>
              
              <p className="text-sm text-sage-500 mt-4">
                Se i dati non sono corretti, puoi modificarli dalla pagina <a href="/profilo" className="text-sage-700 underline">Profilo</a>.
              </p>
            </div>
          )}

          {currentSection === 'common' && (
            <div className="space-y-6">
              {COMMON_QUESTIONS.map((q) => 
                renderQuestion(q, commonAnswers[q.id] || '', (val) => 
                  setCommonAnswers(prev => ({ ...prev, [q.id]: val }))
                )
              )}
            </div>
          )}

          {currentSection === 'dietType' && (
            <div>
              {renderQuestion(
                DIET_TYPE_QUESTION, 
                dietTypeAnswer, 
                (val) => {
                  setDietTypeAnswer(val);
                  // Reset risposte specifiche se cambia dieta
                  setDietAnswers({});
                }
              )}
              
              {selectedDietType && (
                <div className="mt-6 p-4 bg-sage-50 rounded-xl">
                  <p className="text-sage-700">
                    ✅ Hai selezionato: <strong>{selectedDietType}</strong>
                  </p>
                  <p className="text-sm text-sage-500 mt-1">
                    Nella prossima sezione vedrai domande specifiche per il tuo stile alimentare.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentSection === 'dietSpecific' && selectedDietType && (
            <div className="space-y-6">
              <div className="bg-lavender-50 border border-lavender-200 rounded-xl p-4 mb-6">
                <p className="text-lavender-700 font-medium">
                  Domande per: {selectedDietType}
                </p>
              </div>
              
              {dietSpecificQuestions.map((q) => 
                renderQuestion(q, dietAnswers[q.id] || '', (val) => 
                  setDietAnswers(prev => ({ ...prev, [q.id]: val }))
                )
              )}
            </div>
          )}

          {currentSection === 'billing' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-700">
                  📋 Questi dati serviranno per l&apos;emissione della fattura dopo la visita.
                </p>
              </div>
              
              {BILLING_QUESTIONS.map((q) => 
                renderQuestion(q, billingData[q.id] || '', (val) => 
                  setBillingData(prev => ({ ...prev, [q.id]: val }))
                )
              )}
            </div>
          )}

          {currentSection === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-sage-50 border border-sage-200 rounded-xl p-6">
                <p className="text-sage-700 leading-relaxed">
                  Con riferimento alla Legge 31/12/1996 &quot;tutela delle persone e di altri soggetti 
                  al trattamento dei dati personali&quot;, il sottoscritto (ossia il richiedente la 
                  consulenza) spuntando la casella &quot;Autorizzo&quot; ed inviando il questionario 
                  esprime il proprio consenso ed autorizza il Dr. Bernardo Giammetta al 
                  trattamento dei dati personali limitatamente ai fini di dietoterapia. 
                  Prende atto inoltre che i propri dati personali possono essere inseriti 
                  in un archivio cartaceo o elettronico.
                </p>
              </div>
              
              <label className="flex items-start gap-4 p-4 rounded-xl border border-sage-200 cursor-pointer hover:border-sage-300 transition-all">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 text-sage-600 focus:ring-sage-500 rounded"
                />
                <span className="text-sage-700 font-medium">
                  Autorizzo il trattamento dei dati personali <span className="text-red-500">*</span>
                </span>
              </label>

              {/* Riepilogo completamento */}
              <div className="mt-8 p-6 bg-white border-2 border-sage-200 rounded-xl">
                <h3 className="font-semibold text-sage-800 mb-4">Riepilogo Questionario</h3>
                <div className="space-y-2">
                  {sections.filter(s => s !== 'dietSpecific' || selectedDietType).map((section) => (
                    <div key={section} className="flex items-center justify-between">
                      <span className="text-sage-600">{SECTION_INFO[section].title}</span>
                      {isSectionComplete(section) ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Completo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          Incompleto
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigazione */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-sage-100">
          <button
            onClick={goToPrevSection}
            disabled={currentSection === 'profile'}
            className="flex items-center gap-2 px-4 py-2 text-sage-600 hover:text-sage-800 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Indietro
          </button>

          {currentSection !== 'privacy' ? (
            <button
              onClick={goToNextSection}
              className="flex items-center gap-2 px-6 py-3 bg-sage-500 hover:bg-sage-600 
                       text-white rounded-xl font-medium transition-colors"
            >
              Avanti
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isQuestionnaireComplete() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-sage-500 hover:bg-sage-600 
                       text-white rounded-xl font-medium transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Invia Questionario
                </>
              )}
            </button>
          )}
        </div>

        {/* Messaggi di stato */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{submitError}</span>
            </motion.div>
          )}

          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Questionario inviato con successo! Reindirizzamento...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-sage-600 mb-2">
          <span>Progresso questionario</span>
          <span>{calculateProgress()}% completato</span>
        </div>
        <div className="h-3 bg-sage-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sage-400 to-sage-600"
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections
          .filter(s => s !== 'dietSpecific' || selectedDietType)
          .map((section, idx) => {
            const isActive = currentSection === section;
            const isComplete = isSectionComplete(section);
            const SectionIcon = SECTION_INFO[section].icon;
            
            return (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sage-500 text-white'
                    : isComplete
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                }`}
              >
                <SectionIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{SECTION_INFO[section].title}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
            );
          })}
      </div>

      {/* Contenuto */}
      <AnimatePresence mode="wait">
        {renderSection()}
      </AnimatePresence>
    </div>
  );
}
