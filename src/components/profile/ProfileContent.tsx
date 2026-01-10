// =============================================================================
// PROFILE CONTENT - DOTT. BERNARDO GIAMMETTA
// Componente per gestione profilo utente e questionario
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ClipboardList,
  Plus,
  MapPin,
  Eye,
  X,
  Heart,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { PatientNavigation } from '@/components/shared/PatientNavigation';

// Import configurazione domande per visualizzazione questionari
import {
  COMMON_QUESTIONS,
  OMNIVORE_QUESTIONS,
  VEGETARIAN_QUESTIONS,
  VEGAN_QUESTIONS,
  BILLING_QUESTIONS,
  formatBoldText,
  Question,
} from '@/lib/questionnaire-config';

// =============================================================================
// TIPI
// =============================================================================

interface ProfileContentProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: 'ADMIN' | 'PATIENT';
    isWhitelisted: boolean;
    phone?: string | null;
  };
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

// Tipo per questionario (completo per visualizzazione)
interface QuestionnaireInfo {
  id: string;
  dietType: string;
  createdAt: string;
  commonAnswers: string;
  dietAnswers: string;
  billingData: string;
  privacyConsent: boolean;
}

// Tipo per profilo utente completo
interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  codiceFiscale: string | null;
  address: string | null;
  addressNumber: string | null;
  city: string | null;
  cap: string | null;
  contactEmail: string | null;
}

export function ProfileContent({ user }: ProfileContentProps) {
  // Form state - dati base
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  // Form state - dati anagrafici
  const [birthPlace, setBirthPlace] = useState('');
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [city, setCity] = useState('');
  const [cap, setCap] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // State per questionari
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireInfo[]>([]);
  const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(true);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireInfo | null>(null);

  // Fetch profilo completo all'avvio
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data.success && data.user) {
          const u = data.user;
          setFirstName(u.firstName || u.name?.split(' ')[0] || '');
          setLastName(u.lastName || u.name?.split(' ').slice(1).join(' ') || '');
          setPhone(u.phone || '');
          setBirthPlace(u.birthPlace || '');
          setCodiceFiscale(u.codiceFiscale || '');
          setAddress(u.address || '');
          setAddressNumber(u.addressNumber || '');
          setCity(u.city || '');
          setCap(u.cap || '');
          setContactEmail(u.contactEmail || '');
        }
      } catch (err) {
        console.error('Errore fetch profilo:', err);
        // Fallback ai dati della sessione
        setFirstName(user.name?.split(' ')[0] || '');
        setLastName(user.name?.split(' ').slice(1).join(' ') || '');
        setPhone(user.phone || '');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch questionari all'avvio
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const res = await fetch('/api/user/questionnaire');
        const data = await res.json();
        if (data.success) {
          setQuestionnaires(data.questionnaires || []);
        }
      } catch (err) {
        console.error('Errore fetch questionari:', err);
      } finally {
        setLoadingQuestionnaires(false);
      }
    };
    fetchQuestionnaires();
  }, []);

  // Handler telefono - solo numeri
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone(value);
  };

  // Salva profilo
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          birthPlace: birthPlace.trim(),
          codiceFiscale: codiceFiscale.trim().toUpperCase(),
          address: address.trim(),
          addressNumber: addressNumber.trim(),
          city: city.trim(),
          cap: cap.trim(),
          contactEmail: contactEmail.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || 'Errore nel salvataggio');
      }
    } catch (error) {
      setSaveError('Errore di connessione');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Navigazione paziente */}
      <PatientNavigation />
      
      <div className="grid lg:grid-cols-3 gap-8">
      {/* Colonna sinistra - Profilo */}
      <div className="lg:col-span-2 space-y-6">
        {/* Card Dati Personali */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center">
              <User className="w-6 h-6 text-lavender-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-sage-900">
                Dati Personali
              </h2>
              <p className="text-sage-500 text-sm">
                Aggiorna le tue informazioni
              </p>
            </div>
          </div>

          {/* Nota importante */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-800 font-medium text-sm">
                  Usa il tuo nome e cognome reali
                </p>
                <p className="text-orange-600 text-sm mt-1">
                  Per facilitare il lavoro del medico e la gestione delle tue visite, 
                  ti consigliamo di utilizzare i tuoi dati anagrafici reali e non nomi fittizi.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Il tuo nome"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 
                           focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                           outline-none text-sage-800 placeholder:text-sage-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Cognome *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Il tuo cognome"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 
                           focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                           outline-none text-sage-800 placeholder:text-sage-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sage-50 border border-sage-200">
                <Mail className="w-5 h-5 text-sage-400" />
                <span className="text-sage-600">{user.email}</span>
                <span className="ml-auto text-xs text-sage-400">(non modificabile)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Telefono
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="3921234567"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 
                           focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                           outline-none text-sage-800 placeholder:text-sage-400"
                />
              </div>
            </div>

            {/* Sezione Dati Anagrafici per Fatturazione */}
            <div className="border-t border-sage-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-lavender-500" />
                Dati per Fatturazione
              </h3>
              <p className="text-sm text-sage-500 mb-4">
                Questi dati verranno utilizzati per la fatturazione delle visite.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Luogo di nascita
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Es: Roma"
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 
                             focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                             outline-none text-sage-800 placeholder:text-sage-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Codice Fiscale
                  </label>
                  <input
                    type="text"
                    value={codiceFiscale}
                    onChange={(e) => setCodiceFiscale(e.target.value.toUpperCase())}
                    placeholder="RSSMRA85M01H501Z"
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 
                             focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                             outline-none text-sage-800 placeholder:text-sage-400 uppercase"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Indirizzo
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Via Roma"
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 
                             focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                             outline-none text-sage-800 placeholder:text-sage-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    N. Civico
                  </label>
                  <input
                    type="text"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 
                             focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                             outline-none text-sage-800 placeholder:text-sage-400"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Città
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Roma"
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 
                             focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                             outline-none text-sage-800 placeholder:text-sage-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    CAP
                  </label>
                  <input
                    type="text"
                    value={cap}
                    onChange={(e) => setCap(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                    placeholder="00100"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 
                             focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                             outline-none text-sage-800 placeholder:text-sage-400"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Email per comunicazioni (se diversa da login)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="altra.email@esempio.com"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 
                           focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                           outline-none text-sage-800 placeholder:text-sage-400"
                />
              </div>
            </div>

            {/* Messaggi di stato */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Profilo salvato con successo!</span>
              </motion.div>
            )}

            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{saveError}</span>
              </motion.div>
            )}

            {/* Pulsante salva */}
            <button
              onClick={handleSaveProfile}
              disabled={isSaving || !firstName || !lastName}
              className="w-full md:w-auto px-6 py-3 bg-lavender-500 hover:bg-lavender-600 
                       text-white rounded-xl font-medium transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salva Modifiche
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Card Questionario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-sage-900">
                Questionario Alimentare
              </h2>
              <p className="text-sage-500 text-sm">
                Compila prima della tua visita
              </p>
            </div>
          </div>

          <p className="text-sage-600 mb-6">
            Il questionario alimentare è fondamentale per permettere al Dott. Giammetta 
            di preparare al meglio la tua consulenza. Contiene 35 domande sulle tue 
            abitudini alimentari, stile di vita e obiettivi.
          </p>

          <Link
            href="/profilo/questionario"
            className="flex items-center justify-between p-4 bg-sage-50 hover:bg-sage-100 
                     rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sage-200 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sage-700" />
              </div>
              <div>
                <span className="font-medium text-sage-900">Compila il questionario</span>
                <p className="text-sm text-sage-500">~15-20 minuti</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-sage-400 group-hover:text-sage-600 transition-colors" />
          </Link>
        </motion.div>
      </div>

      {/* Colonna destra - Questionari */}
      <div className="space-y-6">
        {/* Card Questionari - stessa card di area-personale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-sage-600" />
            </div>
            <h3 className="font-semibold text-sage-800">I tuoi Questionari</h3>
          </div>
          
          {loadingQuestionnaires ? (
            <p className="text-sm text-sage-500">Caricamento...</p>
          ) : questionnaires.length > 0 ? (
            <div className="space-y-3">
              {questionnaires.slice(0, 5).map((q, idx) => (
                <div key={q.id} className="p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-sage-700">
                        {q.dietType}
                      </p>
                      <p className="text-xs text-sage-500">
                        {format(parseISO(q.createdAt), "d MMM yyyy", { locale: it })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {idx === 0 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Ultimo
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedQuestionnaire(q)}
                        className="p-1.5 bg-lavender-100 text-lavender-700 rounded-lg hover:bg-lavender-200 transition-colors"
                        title="Visualizza questionario"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Bottone nuovo questionario */}
              <Link href={`/profilo/questionario${questionnaires[0] ? `?copyFrom=${questionnaires[0].id}` : ''}`}>
                <button className="w-full mt-2 py-2 text-sm text-sage-600 hover:text-sage-800 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Compila nuovo questionario
                </button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-sage-500 mb-3">
                Nessun questionario compilato
              </p>
              <Link href="/profilo/questionario">
                <button className="px-4 py-2 bg-sage-500 text-white text-sm rounded-lg hover:bg-sage-600 transition-colors flex items-center gap-2 mx-auto">
                  <ClipboardList className="w-4 h-4" />
                  Compila questionario
                </button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Info contatto studio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
        >
          <h3 className="font-semibold text-lavender-800 mb-3">Contatta lo Studio</h3>
          <div className="space-y-2 text-sm">
            <a href="tel:+393920979135" className="flex items-center gap-2 text-lavender-700 hover:text-lavender-900">
              <Phone className="w-4 h-4" />
              +39 392 0979135 (Whatsapp o SMS)
            </a>
            <a href="mailto:info@bernardogiammetta.com" className="flex items-center gap-2 text-lavender-700 hover:text-lavender-900">
              <Mail className="w-4 h-4" />
              info@bernardogiammetta.com
            </a>
          </div>
        </motion.div>
      </div>
      </div>

      {/* Modal Visualizza Questionario (readonly) */}
      {selectedQuestionnaire && (() => {
        // Seleziona le domande specifiche per lo stile alimentare del questionario
        const getDietQuestions = (): Question[] => {
          switch (selectedQuestionnaire.dietType) {
            case 'ONNIVORO': return OMNIVORE_QUESTIONS;
            case 'VEGETARIANO': return VEGETARIAN_QUESTIONS;
            case 'VEGANO': return VEGAN_QUESTIONS;
            default: return [];
          }
        };

        const commonAnswers = JSON.parse(selectedQuestionnaire.commonAnswers || '{}');
        const dietAnswers = JSON.parse(selectedQuestionnaire.dietAnswers || '{}');
        const billingData = JSON.parse(selectedQuestionnaire.billingData || '{}');
        const dietQuestions = getDietQuestions();

        return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-sage-100">
              <div>
                <h2 className="text-xl font-semibold text-sage-900">
                  Questionario - {selectedQuestionnaire.dietType}
                </h2>
                <p className="text-sm text-sage-500">
                  Compilato il {format(parseISO(selectedQuestionnaire.createdAt), "d MMMM yyyy 'alle' HH:mm", { locale: it })}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuestionnaire(null)}
                className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-sage-600" />
              </button>
            </div>

            {/* Menu navigazione categorie */}
            <div className="px-6 py-3 bg-sage-50 border-b border-sage-100 flex flex-wrap gap-2">
              <a href="#pz-sezione-stile-vita" className="px-3 py-1.5 bg-white text-sage-700 rounded-lg text-sm font-medium hover:bg-sage-100 transition-colors flex items-center gap-1.5 border border-sage-200">
                <Heart className="w-4 h-4 text-lavender-500" />
                <span className="hidden sm:inline">Stile di Vita</span>
              </a>
              <a href="#pz-sezione-preferenze" className="px-3 py-1.5 bg-white text-sage-700 rounded-lg text-sm font-medium hover:bg-sage-100 transition-colors flex items-center gap-1.5 border border-sage-200">
                <Utensils className="w-4 h-4 text-lavender-500" />
                <span className="hidden sm:inline">Preferenze Alimentari</span>
              </a>
              <a href="#pz-sezione-fatturazione" className="px-3 py-1.5 bg-white text-sage-700 rounded-lg text-sm font-medium hover:bg-sage-100 transition-colors flex items-center gap-1.5 border border-sage-200">
                <MapPin className="w-4 h-4 text-lavender-500" />
                <span className="hidden sm:inline">Dati Fatturazione</span>
              </a>
            </div>

            {/* Contenuto Modal - Scrollabile */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Sezione 1: Stile di Vita e Salute (Domande Comuni) */}
              <div id="pz-sezione-stile-vita">
                <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-lavender-500" />
                  Stile di Vita e Salute
                </h3>
                <div className="space-y-4">
                  {COMMON_QUESTIONS.map((question) => {
                    const answer = commonAnswers[question.id];
                    if (answer === undefined) return null;
                    return (
                      <div key={question.id} className="bg-sage-50 p-4 rounded-xl">
                        <p 
                          className="text-sm font-medium text-sage-600 mb-2"
                          dangerouslySetInnerHTML={{ __html: formatBoldText(question.text) }}
                        />
                        {/* Elenchi puntati se presenti */}
                        {question.bulletPoints && question.bulletPoints.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-sage-600 mb-3 ml-2 space-y-1">
                            {question.bulletPoints.map((point, idx) => (
                              <li key={idx} dangerouslySetInnerHTML={{ __html: formatBoldText(point) }} />
                            ))}
                          </ul>
                        )}
                        <p 
                          className="text-sage-800 whitespace-pre-wrap bg-white p-3 rounded-lg border border-sage-100"
                          dangerouslySetInnerHTML={{ __html: formatBoldText(String(answer) || '-') }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sezione 2: Preferenze Alimentari */}
              <div id="pz-sezione-preferenze">
                <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2 text-lg">
                  <Utensils className="w-5 h-5 text-lavender-500" />
                  Preferenze Alimentari - {selectedQuestionnaire.dietType}
                </h3>
                <div className="space-y-4">
                  {dietQuestions.map((question) => {
                    const answer = dietAnswers[question.id];
                    if (answer === undefined) return null;
                    return (
                      <div key={question.id} className="bg-sage-50 p-4 rounded-xl">
                        <p 
                          className="text-sm font-medium text-sage-600 mb-2"
                          dangerouslySetInnerHTML={{ __html: formatBoldText(question.text) }}
                        />
                        {/* Elenchi puntati se presenti */}
                        {question.bulletPoints && question.bulletPoints.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-sage-600 mb-3 ml-2 space-y-1">
                            {question.bulletPoints.map((point, idx) => (
                              <li key={idx} dangerouslySetInnerHTML={{ __html: formatBoldText(point) }} />
                            ))}
                          </ul>
                        )}
                        <p 
                          className="text-sage-800 whitespace-pre-wrap bg-white p-3 rounded-lg border border-sage-100"
                          dangerouslySetInnerHTML={{ __html: formatBoldText(String(answer) || '-') }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sezione 3: Dati Fatturazione */}
              <div id="pz-sezione-fatturazione">
                <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-lavender-500" />
                  Dati Fatturazione
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {BILLING_QUESTIONS.map((question) => {
                    const answer = billingData[question.id];
                    if (answer === undefined) return null;
                    return (
                      <div key={question.id} className="bg-sage-50 p-4 rounded-xl">
                        <p className="text-sm font-medium text-sage-600 mb-2">{question.text}</p>
                        <p className="text-sage-800 bg-white p-3 rounded-lg border border-sage-100">
                          {String(answer) || '-'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Consenso privacy: {selectedQuestionnaire.privacyConsent ? 'Autorizzato' : 'Non autorizzato'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-sage-100 bg-sage-50">
              <button
                onClick={() => setSelectedQuestionnaire(null)}
                className="w-full py-2 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </motion.div>
        </div>
        );
      })()}
    </div>
  );
}
