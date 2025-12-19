// =============================================================================
// CTA SECTION - DOTT. BERNARDO GIAMMETTA
// Call to action finale sulla homepage
// =============================================================================

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Calendar, ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// =============================================================================
// CTA SECTION COMPONENT
// =============================================================================

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1920&q=80"
          alt="Cibo sano e colorato"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sage-900/95 via-sage-900/90 to-sage-900/80" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Disponibile per nuovi pazienti
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-display-md lg:text-display-lg text-white mb-6"
          >
            Inizia il tuo percorso verso il{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-300 to-blush-200">
              benessere
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sage-100 text-lg leading-relaxed mb-8"
          >
            Prenota una consulenza e scopri come un percorso di{' '}
            <em className="text-blush-200">nutrizione personalizzata</em> può 
            trasformare la tua vita. Insieme troveremo l'<em className="text-blush-200">equilibrio</em> perfetto 
            per il tuo corpo e la tua mente.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/agenda">
              <Button 
                size="lg" 
                className="bg-white text-sage-800 hover:bg-sage-50 hover:shadow-xl w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5" />
                <span>Prenota una visita</span>
              </Button>
            </Link>
            <Link href="/contatti">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                <span>Contattami</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sage-200"
          >
            <a 
              href="tel:+39XXXXXXXXXX" 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+39 XXX XXX XXXX</span>
            </a>
            <span className="hidden sm:block text-sage-500">•</span>
            <a 
              href="mailto:info@bernardogiammetta.com" 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>info@bernardogiammetta.com</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
