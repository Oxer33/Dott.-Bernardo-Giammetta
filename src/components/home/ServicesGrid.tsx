// =============================================================================
// SERVICES GRID - DOTT. BERNARDO GIAMMETTA
// Griglia servizi in stile Bento con cards glassmorphism
// =============================================================================

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  Scale, 
  Apple, 
  Activity, 
  Baby, 
  Dumbbell,
  Leaf,
  Heart,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// SERVICES DATA
// =============================================================================

const services = [
  {
    id: 'prima-visita',
    title: 'Prima Visita',
    description: 'Valutazione completa dello stato nutrizionale con anamnesi dettagliata, analisi della composizione corporea e definizione degli obiettivi.',
    icon: Scale,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    duration: '90 min',
    highlight: true,
    size: 'large',
  },
  {
    id: 'controlli',
    title: 'Visite di Controllo',
    description: 'Monitoraggio dei progressi e aggiustamenti personalizzati del piano alimentare.',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&q=80',
    duration: '60 min',
    size: 'medium',
  },
  {
    id: 'sportiva',
    title: 'Nutrizione Sportiva',
    description: 'Piani alimentari per ottimizzare performance e recupero atletico.',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    duration: '60 min',
    size: 'medium',
  },
  {
    id: 'gravidanza',
    title: 'Gravidanza e Allattamento',
    description: 'Supporto nutrizionale per future mamme e neo-mamme.',
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=600&q=80',
    duration: '60 min',
    size: 'small',
  },
  {
    id: 'plant-based',
    title: 'Alimentazione Plant-Based',
    description: 'Diete vegetariane e vegane bilanciate e complete.',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    duration: '60 min',
    size: 'small',
  },
  {
    id: 'patologie',
    title: 'Nutrizione Clinica',
    description: 'Supporto per patologie metaboliche, intolleranze e allergie.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80',
    duration: '60 min',
    size: 'small',
  },
];

// =============================================================================
// SERVICE CARD COMPONENT
// =============================================================================

interface ServiceCardProps {
  service: typeof services[0];
  index: number;
  isInView: boolean;
}

function ServiceCard({ service, index, isInView }: ServiceCardProps) {
  const isLarge = service.size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={cn(
        'group relative rounded-3xl overflow-hidden bg-white shadow-soft',
        'hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1',
        isLarge ? 'md:col-span-2 md:row-span-2' : '',
        service.size === 'medium' ? 'md:col-span-1 md:row-span-1' : ''
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className={cn(
          'absolute inset-0 transition-opacity duration-500',
          isLarge 
            ? 'bg-gradient-to-t from-sage-900/90 via-sage-900/50 to-sage-900/20'
            : 'bg-gradient-to-t from-sage-900/95 via-sage-900/70 to-sage-900/40'
        )} />
      </div>

      {/* Content */}
      <div className={cn(
        'relative h-full flex flex-col justify-end p-6',
        isLarge ? 'p-8 lg:p-10' : ''
      )}>
        {/* Duration badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {service.duration}
          </span>
        </div>

        {/* Icon */}
        <div className={cn(
          'w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4',
          'border border-white/20',
          isLarge ? 'w-14 h-14' : ''
        )}>
          <service.icon className={cn(
            'text-white',
            isLarge ? 'w-7 h-7' : 'w-6 h-6'
          )} />
        </div>

        {/* Highlight badge */}
        {service.highlight && (
          <div className="flex items-center gap-1 mb-2">
            <Sparkles className="w-4 h-4 text-blush-200" />
            <span className="text-blush-200 text-xs font-medium">Più richiesto</span>
          </div>
        )}

        {/* Title */}
        <h3 className={cn(
          'text-white font-display font-semibold mb-2',
          isLarge ? 'text-2xl lg:text-3xl' : 'text-xl'
        )}>
          {service.title}
        </h3>

        {/* Description */}
        <p className={cn(
          'text-sage-100 leading-relaxed mb-4',
          isLarge ? 'text-base max-w-md' : 'text-sm line-clamp-2'
        )}>
          {service.description}
        </p>

        {/* Link */}
        <Link 
          href={`/servizi#${service.id}`}
          className="inline-flex items-center gap-2 text-white font-medium text-sm group/link"
        >
          <span>Scopri di più</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SERVICES GRID COMPONENT
// =============================================================================

export function ServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section bg-cream-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6">
            I Miei Servizi
          </span>
          <h2 className="text-display-md lg:text-display-lg text-sage-900 mb-6">
            Percorsi di <em className="text-sage-600">nutrizione</em> su misura
          </h2>
          <p className="text-sage-700 text-lg leading-relaxed">
            Ogni persona è unica, così come le sue esigenze. Offro percorsi{' '}
            <em>personalizzati</em> per aiutarti a raggiungere i tuoi obiettivi 
            di <em>salute</em> e <em>benessere</em>.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[220px]">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/servizi">
            <button className="btn-secondary">
              <span>Vedi tutti i servizi</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
