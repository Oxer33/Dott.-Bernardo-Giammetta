// =============================================================================
// HERO SECTION - DOTT. BERNARDO GIAMMETTA
// Hero full-screen con immagine/video HD, overlay gradient e animazioni
// =============================================================================

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// =============================================================================
// HERO SECTION COMPONENT
// =============================================================================

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-20">
      {/* Background Image con overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80"
          alt="Nutrizione e benessere"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-900/80 via-sage-800/70 to-sage-900/60" />
        {/* Pattern overlay per texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Decorative Elements */}
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        className="absolute top-1/4 right-10 w-64 h-64 bg-lavender-400/20 rounded-full blur-3xl"
      />
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        className="absolute bottom-1/4 left-10 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            className="text-white"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span>Percorsi personalizzati di <em className="text-orange-300">nutrizione</em></span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6"
            >
              Il tuo{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-300 to-orange-300">
                benessere
              </span>
              <br />
              inizia da qui
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-xl sm:text-2xl lg:text-3xl text-sage-100 leading-relaxed mb-8 max-w-xl font-medium"
            >
              Biologo Nutrizionista specializzato in <em className="text-orange-200">nutrizione funzionale</em> e{' '}
              <em className="text-lavender-300">metabolismo</em>. 
              Insieme costruiremo il percorso ideale per raggiungere i tuoi obiettivi di{' '}
              <em className="text-orange-200">salute</em> e <em className="text-lavender-300">equilibrio</em>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Link href="/agenda">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="bg-white text-sage-800 hover:bg-sage-50 hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Prenota una visita</span>
                </Button>
              </Link>
              <Link href="/chi-sono">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <span>Scopri di più</span>
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex items-center gap-8 text-sage-200 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full bg-sage-400 border-2 border-sage-800 flex items-center justify-center text-white text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>500+ pazienti</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>5.0 su Google</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={isLoaded ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80"
                  alt="Dott. Bernardo Giammetta"
                  width={500}
                  height={600}
                  className="object-cover"
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-sage-900/40 to-transparent" />
              </div>

              {/* Floating Card - Qualifica */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-soft-lg p-4 max-w-[200px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sage-900 text-sm">Biologo Nutrizionista</p>
                    <p className="text-sage-600 text-xs">Iscritto ONB</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card - Experience */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl shadow-glow p-4 text-white"
              >
                <p className="text-3xl font-bold">15+</p>
                <p className="text-sm text-sage-100">anni esperienza</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs uppercase tracking-widest">Scopri</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
