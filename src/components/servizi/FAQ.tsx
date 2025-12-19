// =============================================================================
// FAQ - DOTT. BERNARDO GIAMMETTA
// Sezione domande frequenti sui servizi
// =============================================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

// =============================================================================
// DATI FAQ
// =============================================================================

const faqs = [
  {
    question: 'Quanto dura la prima visita?',
    answer: 'La prima visita ha una durata di circa 90 minuti. Questo tempo ci permette di fare un\'anamnesi completa, analizzare la composizione corporea, discutere le tue abitudini alimentari e definire insieme gli obiettivi del percorso.',
  },
  {
    question: 'Cosa devo portare alla prima visita?',
    answer: 'È utile portare eventuali esami del sangue recenti (degli ultimi 6 mesi), referti medici pertinenti e, se ne hai fatto, un diario alimentare degli ultimi 3-7 giorni. Non è obbligatorio, ma ci aiuta ad avere un quadro più completo.',
  },
  {
    question: 'Ogni quanto devo fare le visite di controllo?',
    answer: 'La frequenza delle visite di controllo dipende dagli obiettivi e dalle esigenze individuali. In genere, consiglio controlli ogni 3-4 settimane nella fase iniziale, poi si possono diradare a 6-8 settimane una volta raggiunta una buona autonomia.',
  },
  {
    question: 'Il piano alimentare è personalizzato?',
    answer: 'Assolutamente sì. Ogni piano alimentare è costruito su misura considerando le tue preferenze, intolleranze, stile di vita, orari di lavoro, attività fisica e obiettivi specifici. Non uso mai schemi pre-impostati.',
  },
  {
    question: 'Posso seguire il percorso anche online?',
    answer: 'Sì, offro la possibilità di consulenze online tramite videochiamata. È un\'opzione ideale per chi ha difficoltà a raggiungere lo studio o vive lontano. L\'efficacia del percorso rimane la stessa.',
  },
  {
    question: 'Lavori anche con patologie specifiche?',
    answer: 'Sì, ho esperienza nella gestione nutrizionale di diverse patologie come diabete, ipertensione, dislipidemie, patologie gastrointestinali, PCOS e altre condizioni. Lavoro sempre in collaborazione con il medico curante.',
  },
  {
    question: 'Come funziona la prenotazione?',
    answer: 'Puoi prenotare direttamente online attraverso il sistema di agenda del sito. Scegli la data e l\'ora che preferisci e riceverai una conferma via email. È richiesto un preavviso minimo di 48 ore per le prenotazioni.',
  },
  {
    question: 'Posso cancellare o spostare un appuntamento?',
    answer: 'Sì, puoi cancellare o spostare l\'appuntamento con almeno 24 ore di anticipo. Per farlo, puoi utilizzare il link nella email di conferma o contattarmi direttamente.',
  },
];

// =============================================================================
// COMPONENTE FAQ ITEM
// =============================================================================

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-sage-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-medium text-sage-800 group-hover:text-sage-600 transition-colors pr-4">
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-sage-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sage-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// COMPONENTE FAQ
// =============================================================================

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>Domande Frequenti</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">
              Hai Qualche Domanda?
            </h2>
            <p className="text-sage-600 mb-6">
              Ecco le risposte alle domande più comuni sui miei servizi.
              Se non trovi quello che cerchi, non esitare a contattarmi.
            </p>
            <a
              href="/contatti"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium"
            >
              Contattami
            </a>
          </motion.div>
          
          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-cream-50 rounded-2xl p-6 md:p-8"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
