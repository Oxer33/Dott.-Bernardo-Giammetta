// =============================================================================
// TESTIMONIALS CAROUSEL - DOTT. BERNARDO GIAMMETTA
// Carousel moderno con testimonials dei pazienti
// =============================================================================

'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TESTIMONIALS DATA
// =============================================================================

const testimonials = [
  // Gruppo 1 - Professionisti
  { id: 1, name: 'Valentina Marchetti', role: 'Avvocato - Bologna', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', rating: 5, text: 'Il Dott. Giammetta ha cambiato completamente il mio approccio all\'alimentazione. Non si tratta di una dieta, ma di un vero percorso di consapevolezza. Ho perso 15 kg in modo sano e sostenibile.', highlight: 'consapevolezza' },
  { id: 2, name: 'Alessandro Ferrante', role: 'Personal Trainer - Trapani', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', rating: 5, text: 'Come atleta, avevo bisogno di un professionista che capisse le mie esigenze. Il Dott. Giammetta ha ottimizzato la mia nutrizione sportiva e le performance sono migliorate notevolmente.', highlight: 'nutrizione sportiva' },
  { id: 3, name: 'Chiara Benedetti', role: 'Architetto - Modena', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', rating: 5, text: 'Durante la gravidanza mi sono affidata completamente al Dott. Giammetta. La sua competenza e umanità mi hanno accompagnata in un momento così importante della mia vita.', highlight: 'umanità' },
  { id: 4, name: 'Lorenzo Ferrara', role: 'Consulente Finanziario - Bologna', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', rating: 5, text: 'Soffrivo di problemi digestivi da anni. Il Dott. Giammetta ha identificato le cause e con un piano alimentare mirato ho finalmente ritrovato il mio equilibrio.', highlight: 'equilibrio' },
  { id: 5, name: 'Giulia Moretti', role: 'Professoressa - Erice', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', rating: 5, text: 'Cercavo un approccio plant-based bilanciato e il Dott. Giammetta mi ha guidata con competenza. Ora ho più energia che mai e so esattamente come nutrirmi.', highlight: 'plant-based' },
  
  // Gruppo 2 - Imprenditori e Manager
  { id: 6, name: 'Marco Pellegrini', role: 'Imprenditore - Palermo', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', rating: 5, text: 'Con i ritmi frenetici del lavoro, pensavo fosse impossibile mangiare bene. Il Dott. Giammetta mi ha dimostrato il contrario con un piano pratico e sostenibile.', highlight: 'pratico' },
  { id: 7, name: 'Francesca Colombo', role: 'Manager HR - Milano', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80', rating: 5, text: 'Dopo anni di diete yo-yo, finalmente ho trovato un professionista serio. Ho perso 20 kg e li ho mantenuti. Il Dott. Giammetta è eccezionale.', highlight: 'mantenuti' },
  { id: 8, name: 'Roberto Galli', role: 'CEO Startup - Bologna', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80', rating: 5, text: 'La mia energia durante le riunioni è triplicata. Non avrei mai pensato che l\'alimentazione potesse influire così tanto sulla produttività mentale.', highlight: 'energia' },
  { id: 9, name: 'Elena Rizzo', role: 'Commercialista - Catania', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', rating: 5, text: 'Professionalità, competenza e grande umanità. Il Dott. Giammetta ti ascolta veramente e costruisce un percorso su misura per te.', highlight: 'su misura' },
  { id: 10, name: 'Davide Martini', role: 'Direttore Vendite - Reggio Emilia', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80', rating: 5, text: 'Viaggiando spesso per lavoro, avevo bisogno di strategie alimentari flessibili. Ora so esattamente cosa scegliere ovunque mi trovi.', highlight: 'flessibili' },
  
  // Gruppo 3 - Mamme e Famiglie
  { id: 11, name: 'Sara Lombardi', role: 'Mamma di 3 - Ferrara', image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80', rating: 5, text: 'Con tre bambini piccoli, il tempo per me è pochissimo. Il Dott. Giammetta ha creato un piano che funziona per tutta la famiglia. Fantastico!', highlight: 'famiglia' },
  { id: 12, name: 'Marta Ricci', role: 'Neo Mamma - Bologna', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=80', rating: 5, text: 'Durante l\'allattamento avevo tanti dubbi su cosa mangiare. Il Dott. Giammetta mi ha seguita con pazienza e professionalità incredibili.', highlight: 'pazienza' },
  { id: 13, name: 'Lucia Fontana', role: 'Insegnante - Trapani', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', rating: 5, text: 'Grazie al percorso con il Dott. Giammetta, tutta la mia famiglia ha migliorato le proprie abitudini alimentari. Un investimento sulla salute.', highlight: 'abitudini' },
  { id: 14, name: 'Alessia Greco', role: 'Fotografa - Messina', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80', rating: 5, text: 'Dopo la seconda gravidanza faticavo a tornare in forma. In 6 mesi ho raggiunto i miei obiettivi senza sacrifici estremi. Consigliatissimo!', highlight: 'obiettivi' },
  { id: 15, name: 'Antonella Vitale', role: 'Casalinga - Erice', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80', rating: 5, text: 'Il Dott. Giammetta ha educato me e mio marito a mangiare meglio. I nostri figli stanno crescendo con ottime abitudini grazie a lui.', highlight: 'educato' },
  
  // Gruppo 4 - Sportivi
  { id: 16, name: 'Federico Santoro', role: 'Maratoneta - Bologna', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80', rating: 5, text: 'Ho migliorato i miei tempi di gara del 12% con la nutrizione sportiva del Dott. Giammetta. I risultati parlano da soli.', highlight: 'risultati' },
  { id: 17, name: 'Martina Fiore', role: 'Nuotatrice Agonista - Palermo', image: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=200&q=80', rating: 5, text: 'La differenza tra un buon atleta e un ottimo atleta sta nella nutrizione. Il Dott. Giammetta mi ha fatto capire quanto sia vero.', highlight: 'nutrizione' },
  { id: 18, name: 'Luca Carbone', role: 'Ciclista Amatoriale - Modena', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80', rating: 5, text: 'Pedalare 200 km richiede una preparazione nutrizionale precisa. Grazie al Dott. Giammetta ho completato la mia prima granfondo senza problemi.', highlight: 'preparazione' },
  { id: 19, name: 'Simone De Luca', role: 'CrossFitter - Catania', image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&q=80', rating: 5, text: 'Ho aumentato la massa muscolare e ridotto il grasso corporeo seguendo le indicazioni del Dott. Giammetta. Trasformazione incredibile!', highlight: 'trasformazione' },
  { id: 20, name: 'Elisa Conti', role: 'Yoga Instructor - Ferrara', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80', rating: 5, text: 'La mia pratica yoga è migliorata enormemente da quando seguo il piano alimentare del Dott. Giammetta. Mi sento leggera e piena di energia.', highlight: 'leggera' },
  
  // Gruppo 5 - Over 50
  { id: 21, name: 'Giovanni Russo', role: 'Pensionato - Trapani', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80', rating: 5, text: 'A 65 anni pensavo fosse troppo tardi per cambiare. Il Dott. Giammetta mi ha dimostrato che non è mai troppo tardi per stare bene.', highlight: 'mai troppo tardi' },
  { id: 22, name: 'Maria Teresa Amato', role: 'Ex Dirigente - Bologna', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&q=80', rating: 5, text: 'Con il diabete di tipo 2 avevo bisogno di un esperto. Il Dott. Giammetta ha migliorato i miei valori glicemici in modo impressionante.', highlight: 'valori' },
  { id: 23, name: 'Carlo Mancini', role: 'Medico in Pensione - Palermo', image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80', rating: 5, text: 'Da collega, posso dire che il Dott. Giammetta è estremamente preparato e aggiornato. Mi ha aiutato a gestire l\'ipercolesterolemia.', highlight: 'preparato' },
  { id: 24, name: 'Rosa Ferraro', role: 'Nonna Attiva - Erice', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80', rating: 5, text: 'Voglio essere una nonna in forma per i miei nipoti. Il Dott. Giammetta mi ha dato gli strumenti per mantenermi attiva e sana.', highlight: 'in forma' },
  { id: 25, name: 'Antonio Palermo', role: 'Ex Bancario - Modena', image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=200&q=80', rating: 5, text: 'Dopo l\'infarto, dovevo cambiare radicalmente. Il Dott. Giammetta mi ha accompagnato in questo percorso salvavita con grande competenza.', highlight: 'salvavita' },
  
  // Gruppo 6 - Giovani Professionisti
  { id: 26, name: 'Andrea Basile', role: 'Sviluppatore Software - Bologna', image: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=200&q=80', rating: 5, text: 'Passavo ore al computer mangiando schifezze. Ora ho energia costante tutto il giorno e la mia concentrazione è alle stelle.', highlight: 'concentrazione' },
  { id: 27, name: 'Federica Romano', role: 'Designer - Milano', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', rating: 5, text: 'La creatività ha bisogno di un corpo sano. Il Dott. Giammetta mi ha fatto capire il legame tra alimentazione e prestazioni cognitive.', highlight: 'creatività' },
  { id: 28, name: 'Matteo Esposito', role: 'Ingegnere - Catania', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80', rating: 5, text: 'Approccio scientifico e basato sui dati. Finalmente un nutrizionista che parla il mio linguaggio e spiega il perché di ogni scelta.', highlight: 'scientifico' },
  { id: 29, name: 'Giorgia Pelliccia', role: 'Avvocatessa - Palermo', image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&q=80', rating: 5, text: 'Con le udienze in tribunale, non potevo permettermi cali di energia. Il piano del Dott. Giammetta mi tiene sempre al top.', highlight: 'top' },
  { id: 30, name: 'Nicola Costa', role: 'Medico Specializzando - Bologna', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=200&q=80', rating: 5, text: 'Turni infiniti in ospedale richiedono un\'alimentazione strategica. Il Dott. Giammetta mi ha dato le chiavi per gestire tutto.', highlight: 'strategica' },
  
  // Gruppo 7 - Casi Speciali
  { id: 31, name: 'Silvia Marino', role: 'Celiaca - Ferrara', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80', rating: 5, text: 'Gestire la celiachia era un incubo. Il Dott. Giammetta ha creato un piano vario e gustoso che mi ha cambiato la vita.', highlight: 'celiachia' },
  { id: 32, name: 'Francesco Leone', role: 'Intollerante al Lattosio - Trapani', image: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=200&q=80', rating: 5, text: 'Non sapevo che si potesse mangiare così bene evitando i latticini. Grazie Dott. Giammetta per avermi aperto un mondo nuovo.', highlight: 'mondo nuovo' },
  { id: 33, name: 'Roberta Fabbri', role: 'Allergica - Bologna', image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80', rating: 5, text: 'Con le mie allergie multiple, trovare un nutrizionista competente sembrava impossibile. Il Dott. Giammetta è stato una salvezza.', highlight: 'salvezza' },
  { id: 34, name: 'Emanuele Serra', role: 'Vegano - Modena', image: 'https://images.unsplash.com/photo-1495603889488-42d1d66e5523?w=200&q=80', rating: 5, text: 'Volevo essere sicuro di non avere carenze con la dieta vegana. Il Dott. Giammetta mi ha aiutato a costruire un piano perfettamente bilanciato.', highlight: 'bilanciato' },
  { id: 35, name: 'Paola Gentile', role: 'Ipotiroidea - Erice', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=200&q=80', rating: 5, text: 'La tiroide condizionava la mia vita. Con il piano alimentare del Dott. Giammetta ho finalmente ritrovato il mio peso forma.', highlight: 'peso forma' },
  
  // Gruppo 8 - Studenti
  { id: 36, name: 'Alessio Morandi', role: 'Studente Medicina - Bologna', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80', rating: 5, text: 'Durante la sessione d\'esami, l\'alimentazione è fondamentale. Il Dott. Giammetta mi ha dato consigli preziosissimi per la concentrazione.', highlight: 'esami' },
  { id: 37, name: 'Beatrice Longo', role: 'Studentessa Giurisprudenza - Palermo', image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=200&q=80', rating: 5, text: 'Pensavo che mangiare bene fosse costoso e complicato. Il Dott. Giammetta mi ha dimostrato che si può fare anche con budget limitato.', highlight: 'budget' },
  { id: 38, name: 'Riccardo Barbieri', role: 'Studente Ingegneria - Bologna', image: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=200&q=80', rating: 5, text: 'Ho smesso di vivere di pizza e kebab. Ora cucino cose semplici ma nutrienti e mi sento molto meglio. Grazie Dottore!', highlight: 'semplici' },
  { id: 39, name: 'Camilla Marini', role: 'Studentessa Economia - Catania', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80', rating: 5, text: 'La vita universitaria fuori sede è caotica. Il Dott. Giammetta mi ha dato strategie pratiche per mangiare bene anche in mensa.', highlight: 'pratiche' },
  { id: 40, name: 'Tommaso Silvestri', role: 'Dottorando - Bologna', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80', rating: 5, text: 'Scrivere la tesi richiedeva ore di concentrazione. Con il piano del Dott. Giammetta ho mantenuto lucidità e energia costanti.', highlight: 'lucidità' },
  
  // Gruppo 9 - Artisti e Creativi
  { id: 41, name: 'Veronica Cattaneo', role: 'Cantante Lirica - Bologna', image: 'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=200&q=80', rating: 5, text: 'La voce richiede un corpo in perfetta forma. Il Dott. Giammetta capisce le esigenze degli artisti e sa come supportarle.', highlight: 'voce' },
  { id: 42, name: 'Stefano Rosetti', role: 'Attore Teatrale - Palermo', image: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=200&q=80', rating: 5, text: 'Sul palcoscenico devi essere al massimo. La nutrizione del Dott. Giammetta mi ha dato l\'energia per performance intense.', highlight: 'palcoscenico' },
  { id: 43, name: 'Isabella De Santis', role: 'Pittrice - Erice', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', rating: 5, text: 'La creatività scorre meglio quando il corpo sta bene. Da quando seguo il Dott. Giammetta, i miei quadri hanno più vita.', highlight: 'creatività' },
  { id: 44, name: 'Michele Bruno', role: 'Musicista Jazz - Bologna', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&q=80', rating: 5, text: 'Le serate nei club finiscono tardi e mangiare bene sembrava impossibile. Il Dott. Giammetta ha trovato soluzioni perfette.', highlight: 'soluzioni' },
  { id: 45, name: 'Aurora Giordano', role: 'Ballerina Classica - Milano', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80', rating: 5, text: 'Nella danza il peso è tutto. Il Dott. Giammetta mi ha aiutata a mantenere la forma senza sacrificare la forza muscolare.', highlight: 'forza' },
  
  // Gruppo 10 - Impiegati e Lavoratori
  { id: 46, name: 'Claudia Martinelli', role: 'Segretaria - Ferrara', image: 'https://images.unsplash.com/photo-1546961342-ea1f71b193f8?w=200&q=80', rating: 5, text: 'Otto ore seduta alla scrivania mi avevano fatto prendere 15 kg. Con il Dott. Giammetta li ho persi tutti e mi mantengo.', highlight: 'mantengo' },
  { id: 47, name: 'Daniele Marchese', role: 'Operaio - Trapani', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', rating: 5, text: 'Il lavoro fisico richiede energia. Il Dott. Giammetta ha capito le mie esigenze e creato un piano perfetto per il mio stile di vita.', highlight: 'energia' },
  { id: 48, name: 'Patrizia Donati', role: 'Commessa - Bologna', image: 'https://images.unsplash.com/photo-1508243771214-6e95d137426b?w=200&q=80', rating: 5, text: 'Stare in piedi 8 ore al giorno è faticoso. Da quando mangio meglio, arrivo a fine turno senza essere completamente sfinita.', highlight: 'faticoso' },
  { id: 49, name: 'Fabio Neri', role: 'Autista - Catania', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80', rating: 5, text: 'Mangiare in autogrill era diventato un incubo per il peso. Il Dott. Giammetta mi ha insegnato cosa scegliere ovunque.', highlight: 'scegliere' },
  { id: 50, name: 'Laura Bernardi', role: 'Infermiera - Bologna', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', rating: 5, text: 'I turni di notte sballano tutto. Grazie al Dott. Giammetta ho trovato un equilibrio alimentare che funziona anche per me.', highlight: 'turni' },
  
  // Gruppo 11 - Extra
  { id: 51, name: 'Vincenzo Parisi', role: 'Chef - Palermo', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80', rating: 5, text: 'Anche uno chef ha bisogno di un nutrizionista! Il Dott. Giammetta mi ha aiutato a non ingrassare assaggiando i miei piatti.', highlight: 'chef' },
  { id: 52, name: 'Eleonora Sanna', role: 'Giornalista - Bologna', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', rating: 5, text: 'Le scadenze e lo stress mi portavano a mangiare male. Il Dott. Giammetta ha creato un piano anti-stress perfetto.', highlight: 'anti-stress' },
  { id: 53, name: 'Gabriele Ferretti', role: 'Pilota - Milano', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80', rating: 5, text: 'Il jet lag e i fusi orari complicano l\'alimentazione. Il Dott. Giammetta mi ha dato strategie che funzionano in volo.', highlight: 'jet lag' },
  { id: 54, name: 'Teresa Caputo', role: 'Farmacista - Trapani', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', rating: 5, text: 'Conosco tanti integratori, ma la vera differenza la fa l\'alimentazione. Il Dott. Giammetta me lo ha dimostrato con i fatti.', highlight: 'fatti' },
  { id: 55, name: 'Alessandro Fiori', role: 'Poliziotto - Bologna', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', rating: 5, text: 'Il mio lavoro richiede forma fisica ottimale. Il Dott. Giammetta mi ha preparato ai test fisici con un piano alimentare mirato.', highlight: 'forma fisica' },
];

// =============================================================================
// TESTIMONIAL CARD COMPONENT
// =============================================================================

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  isActive: boolean;
}

function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  // Evidenzia la parola chiave nel testo
  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <em key={i} className="text-sage-600">{part}</em>
        : part
    );
  };

  return (
    <div 
      className={cn(
        'flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]',
        'transition-opacity duration-300'
      )}
    >
      <div className="card h-full flex flex-col">
        {/* Quote icon */}
        <div className="mb-4">
          <Quote className="w-10 h-10 text-sage-200 fill-sage-100" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>

        {/* Text */}
        <p className="text-sage-700 leading-relaxed flex-1 mb-6">
          "{highlightText(testimonial.text, testimonial.highlight)}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 border-t border-sage-100">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-sage-900">{testimonial.name}</p>
            <p className="text-sage-600 text-sm">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// TESTIMONIALS CAROUSEL COMPONENT
// =============================================================================

export function TestimonialsCarousel() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Subscribe to embla events
  useCallback(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section ref={sectionRef} className="section bg-cream-50 overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-display-md lg:text-display-lg text-sage-900">
              Cosa dicono i miei <em className="text-sage-600">pazienti</em>
            </h2>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center 
                       hover:bg-sage-50 hover:shadow-soft-lg transition-all duration-300
                       hover:-translate-x-0.5"
              aria-label="Precedente"
            >
              <ChevronLeft className="w-5 h-5 text-sage-700" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center 
                       hover:bg-sage-50 hover:shadow-soft-lg transition-all duration-300
                       hover:translate-x-0.5"
              aria-label="Successivo"
            >
              <ChevronRight className="w-5 h-5 text-sage-700" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex -mx-4">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={index === selectedIndex}
              />
            ))}
          </div>
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === selectedIndex 
                  ? 'bg-sage-500 w-8' 
                  : 'bg-sage-200 hover:bg-sage-300'
              )}
              aria-label={`Vai alla slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
