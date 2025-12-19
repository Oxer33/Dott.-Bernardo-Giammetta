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
  {
    id: 1,
    name: 'Valentina Marchetti',
    role: 'Avvocato',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    text: 'Il Dott. Giammetta ha cambiato completamente il mio approccio all\'alimentazione. Non si tratta di una dieta, ma di un vero percorso di consapevolezza. Ho perso 15 kg in modo sano e sostenibile, senza mai sentirmi privata di nulla.',
    highlight: 'consapevolezza',
  },
  {
    id: 2,
    name: 'Alessandro Rinaldi',
    role: 'Personal Trainer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    text: 'Come atleta, avevo bisogno di un professionista che capisse le mie esigenze specifiche. Il Dott. Giammetta ha ottimizzato la mia nutrizione sportiva e le mie performance sono migliorate notevolmente.',
    highlight: 'nutrizione sportiva',
  },
  {
    id: 3,
    name: 'Chiara Benedetti',
    role: 'Architetto',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    text: 'Durante la gravidanza e l\'allattamento mi sono affidata completamente al Dott. Giammetta. La sua competenza e umanità mi hanno accompagnata in un momento così importante della mia vita.',
    highlight: 'umanità',
  },
  {
    id: 4,
    name: 'Lorenzo Santini',
    role: 'Consulente Finanziario',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    rating: 5,
    text: 'Soffrivo di problemi digestivi da anni. Il Dott. Giammetta ha identificato le cause e con un piano alimentare mirato ho finalmente ritrovato il mio equilibrio. Professionalità e risultati concreti.',
    highlight: 'equilibrio',
  },
  {
    id: 5,
    name: 'Giulia Moretti',
    role: 'Professoressa Universitaria',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    rating: 5,
    text: 'Cercavo un approccio plant-based bilanciato e il Dott. Giammetta mi ha guidata con competenza. Ora ho più energia che mai e so esattamente come nutrirmi in modo completo e sostenibile.',
    highlight: 'plant-based',
  },
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
