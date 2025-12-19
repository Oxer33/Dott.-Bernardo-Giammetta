// =============================================================================
// ABOUT PREVIEW - DOTT. BERNARDO GIAMMETTA
// Sezione "Chi Sono" preview con layout split-screen
// =============================================================================

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Award, BookOpen, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// =============================================================================
// FEATURES DATA
// =============================================================================

const features = [
  {
    icon: Heart,
    title: 'Approccio Olistico',
    description: 'Considero la persona nella sua totalità: corpo, mente e stile di vita.',
  },
  {
    icon: Users,
    title: 'Percorsi Personalizzati',
    description: 'Ogni piano alimentare è unico, costruito sulle tue esigenze specifiche.',
  },
  {
    icon: BookOpen,
    title: 'Formazione Continua',
    description: 'Aggiornamento costante sulle ultime evidenze scientifiche.',
  },
  {
    icon: Award,
    title: 'Esperienza Certificata',
    description: 'Oltre 15 anni di pratica clinica e centinaia di casi di successo.',
  },
];

// =============================================================================
// ABOUT PREVIEW COMPONENT
// =============================================================================

export function AboutPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80"
                alt="Dott. Bernardo Giammetta nel suo studio"
                width={600}
                height={700}
                className="object-cover w-full"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -top-6 -left-6 w-full h-full bg-sage-100 rounded-3xl" />
            <div className="absolute -z-20 -top-12 -left-12 w-full h-full bg-sage-50 rounded-3xl" />

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-soft-lg p-6"
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-sage-600">500+</p>
                <p className="text-sage-700 text-sm font-medium">Pazienti Seguiti</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Section Label */}
            <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6">
              Chi Sono
            </span>

            {/* Heading */}
            <h2 className="text-display-md lg:text-display-lg text-sage-900 mb-6">
              Un approccio <em className="text-sage-600">scientifico</em> al tuo{' '}
              <em className="text-sage-600">benessere</em>
            </h2>

            {/* Description */}
            <div className="space-y-4 text-sage-700 leading-relaxed mb-8">
              <p>
                Sono il <strong>Dott. Bernardo Giammetta</strong>, Biologo Nutrizionista 
                con una passione profonda per la <em>nutrizione funzionale</em> e il{' '}
                <em>metabolismo</em>.
              </p>
              <p>
                Il mio obiettivo è aiutarti a raggiungere un <em>equilibrio</em> duraturo 
                attraverso un percorso personalizzato che rispetti il tuo corpo, 
                le tue preferenze e il tuo stile di vita.
              </p>
              <p>
                Credo fermamente che una corretta <em>alimentazione</em> sia la chiave 
                per una vita sana e piena di energia. Non propongo diete restrittive, 
                ma un vero e proprio cambiamento di <em>consapevolezza</em> alimentare.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-sage-50/50 hover:bg-sage-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sage-900 text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sage-600 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/chi-sono">
              <Button variant="primary" size="lg">
                <span>Scopri la mia storia</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
