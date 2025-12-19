// =============================================================================
// BLOG PREVIEW - DOTT. BERNARDO GIAMMETTA
// Anteprima articoli del blog sulla homepage
// =============================================================================

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// =============================================================================
// SAMPLE BLOG POSTS DATA
// In produzione questi dati verranno dal CMS
// =============================================================================

const blogPosts = [
  {
    id: 1,
    slug: 'importanza-colazione-equilibrata',
    title: 'L\'importanza di una colazione equilibrata',
    excerpt: 'Scopri perché la colazione è il pasto più importante della giornata e come strutturarla per massimizzare energia e concentrazione.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80',
    category: 'Alimentazione',
    readingTime: 5,
    publishedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    slug: 'microbiota-intestinale-salute',
    title: 'Microbiota intestinale: il secondo cervello',
    excerpt: 'Il microbiota intestinale influenza non solo la digestione, ma anche l\'umore e il sistema immunitario. Ecco come prendersene cura.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
    category: 'Salute',
    readingTime: 8,
    publishedAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    slug: 'nutrizione-sportiva-performance',
    title: 'Nutrizione sportiva: ottimizza le tue performance',
    excerpt: 'Come l\'alimentazione può fare la differenza nelle prestazioni sportive. Strategie pre e post allenamento per atleti.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    category: 'Sport',
    readingTime: 6,
    publishedAt: new Date('2024-01-05'),
  },
];

// =============================================================================
// BLOG CARD COMPONENT
// =============================================================================

interface BlogCardProps {
  post: typeof blogPosts[0];
  index: number;
  isInView: boolean;
  featured?: boolean;
}

function BlogCard({ post, index, isInView, featured = false }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={featured ? 'md:col-span-2 md:row-span-2' : ''}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className={`card h-full overflow-hidden p-0 ${featured ? 'md:flex' : ''}`}>
          {/* Image */}
          <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 aspect-video md:aspect-auto' : 'aspect-video'}`}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sage-700 text-xs font-medium">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={`p-6 ${featured ? 'md:w-1/2 md:p-8 flex flex-col justify-center' : ''}`}>
            {/* Meta */}
            <div className="flex items-center gap-4 text-sage-500 text-sm mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime} min
              </span>
            </div>

            {/* Title */}
            <h3 className={`font-display font-semibold text-sage-900 mb-3 group-hover:text-sage-600 transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className={`text-sage-700 leading-relaxed mb-4 ${featured ? '' : 'line-clamp-2'}`}>
              {post.excerpt}
            </p>

            {/* Read more */}
            <span className="inline-flex items-center gap-2 text-sage-600 font-medium text-sm group-hover:text-sage-700 transition-colors">
              Leggi l'articolo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// =============================================================================
// BLOG PREVIEW COMPONENT
// =============================================================================

export function BlogPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section bg-white">
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
              Blog & Risorse
            </span>
            <h2 className="text-display-md lg:text-display-lg text-sage-900">
              Approfondimenti su <em className="text-sage-600">nutrizione</em>
            </h2>
            <p className="text-sage-700 mt-4 max-w-xl">
              Articoli, guide e consigli pratici per un'alimentazione{' '}
              <em>consapevole</em> e uno stile di vita sano.
            </p>
          </div>
          
          <Link 
            href="/blog"
            className="btn-secondary self-start md:self-auto"
          >
            <span>Tutti gli articoli</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              isInView={isInView}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
