// =============================================================================
// STATS COUNTER - DOTT. BERNARDO GIAMMETTA
// Sezione con contatori animati per statistiche chiave
// =============================================================================

'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Award, Calendar, Star } from 'lucide-react';

// =============================================================================
// STATS DATA
// =============================================================================

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Pazienti Seguiti',
    description: 'Persone che hanno scelto di affidarsi a me',
  },
  {
    icon: Award,
    value: 15,
    suffix: '+',
    label: 'Anni di Esperienza',
    description: 'Al servizio del benessere e della salute',
  },
  {
    icon: Calendar,
    value: 5000,
    suffix: '+',
    label: 'Consulenze Effettuate',
    description: 'Visite e piani personalizzati creati',
  },
  {
    icon: Star,
    value: 5.0,
    suffix: '',
    label: 'Rating Google',
    description: 'Valutazione media dei miei pazienti',
  },
];

// =============================================================================
// ANIMATED COUNTER HOOK
// =============================================================================

function useCounter(end: number, duration: number = 2000, isInView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    
    hasAnimated.current = true;
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (end - startValue) * easeOutQuart;
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return count;
}

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================

interface StatCardProps {
  stat: typeof stats[0];
  index: number;
  isInView: boolean;
}

function StatCard({ stat, index, isInView }: StatCardProps) {
  const count = useCounter(stat.value, 2000, isInView);
  const displayValue = stat.value % 1 === 0 
    ? Math.round(count) 
    : count.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="text-center p-6 lg:p-8"
    >
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <stat.icon className="w-8 h-8 text-white" />
      </div>

      {/* Counter */}
      <div className="mb-2">
        <span className="text-4xl lg:text-5xl font-display font-bold text-white">
          {displayValue}
        </span>
        <span className="text-3xl lg:text-4xl font-display font-bold text-orange-300">
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <h3 className="text-lg font-semibold text-white mb-1">
        {stat.label}
      </h3>

      {/* Description */}
      <p className="text-sage-200 text-sm">
        {stat.description}
      </p>
    </motion.div>
  );
}

// =============================================================================
// STATS COUNTER COMPONENT
// =============================================================================

export function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-sage" />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-sage-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lavender-300/15 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-display-md lg:text-display-lg text-white mb-4">
            I numeri parlano
          </h2>
          <p className="text-sage-100 text-lg max-w-2xl mx-auto">
            Anni di esperienza, dedizione e risultati concreti nel campo della{' '}
            <em className="text-orange-300">nutrizione</em> e del <em className="text-lavender-300">benessere</em>.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
