// =============================================================================
// BLOG GRID - DOTT. BERNARDO GIAMMETTA
// Griglia di articoli del blog
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// DATI ARTICOLI (mock - da sostituire con dati da database)
// =============================================================================

const articles = [
  {
    id: '1',
    slug: 'importanza-colazione',
    title: 'L\'importanza della Colazione: Come Iniziare la Giornata',
    excerpt: 'Scopri perché la colazione è il pasto più importante della giornata e come comporre una colazione equilibrata e nutriente.',
    category: 'Alimentazione',
    tags: ['colazione', 'energia', 'benessere'],
    readingTime: 5,
    publishedAt: '2024-01-15',
    featured: true,
  },
  {
    id: '2',
    slug: 'proteine-vegetali',
    title: 'Proteine Vegetali: Guida Completa alle Alternative',
    excerpt: 'Una guida completa alle fonti proteiche vegetali per chi segue un\'alimentazione plant-based o vuole ridurre il consumo di carne.',
    category: 'Nutrienti',
    tags: ['proteine', 'vegetale', 'legumi'],
    readingTime: 8,
    publishedAt: '2024-01-10',
    featured: false,
  },
  {
    id: '3',
    slug: 'gestire-fame-nervosa',
    title: 'Fame Nervosa: Strategie per Gestirla Efficacemente',
    excerpt: 'Consigli pratici e strategie basate sulla scienza per riconoscere e gestire la fame emotiva.',
    category: 'Psicologia',
    tags: ['fame nervosa', 'mindful eating', 'emozioni'],
    readingTime: 6,
    publishedAt: '2024-01-05',
    featured: false,
  },
  {
    id: '4',
    slug: 'alimentazione-sportiva',
    title: 'Nutrizione Sportiva: Cosa Mangiare Prima e Dopo l\'Allenamento',
    excerpt: 'Ottimizza le tue performance sportive con una corretta alimentazione pre e post workout.',
    category: 'Sport',
    tags: ['sport', 'allenamento', 'performance'],
    readingTime: 7,
    publishedAt: '2024-01-01',
    featured: false,
  },
  {
    id: '5',
    slug: 'intestino-secondo-cervello',
    title: 'L\'Intestino: Il Nostro Secondo Cervello',
    excerpt: 'Approfondimento sul microbiota intestinale e la sua influenza su salute, umore e sistema immunitario.',
    category: 'Salute',
    tags: ['intestino', 'microbiota', 'probiotici'],
    readingTime: 10,
    publishedAt: '2023-12-20',
    featured: false,
  },
  {
    id: '6',
    slug: 'meal-prep-settimana',
    title: 'Meal Prep: Organizzare i Pasti della Settimana',
    excerpt: 'Guida pratica al meal prep per mangiare sano anche quando il tempo è poco.',
    category: 'Pratico',
    tags: ['meal prep', 'organizzazione', 'ricette'],
    readingTime: 8,
    publishedAt: '2023-12-15',
    featured: false,
  },
];

// =============================================================================
// COMPONENTE BLOG GRID
// =============================================================================

export function BlogGrid() {
  const featuredArticle = articles.find(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);
  
  return (
    <div className="space-y-8">
      {/* Articolo in evidenza */}
      {featuredArticle && (
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl overflow-hidden border border-sage-100"
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-sage-500 text-white text-xs font-medium rounded-full">
                In evidenza
              </span>
              <span className="px-3 py-1 bg-white text-sage-700 text-xs font-medium rounded-full">
                {featuredArticle.category}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold text-sage-900 mb-3">
              {featuredArticle.title}
            </h2>
            
            <p className="text-sage-600 mb-4 max-w-2xl">
              {featuredArticle.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-sage-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('it-IT')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{featuredArticle.readingTime} min di lettura</span>
              </div>
            </div>
            
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium"
            >
              Leggi articolo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.article>
      )}
      
      {/* Griglia articoli */}
      <div className="grid md:grid-cols-2 gap-6">
        {regularArticles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl border border-sage-100 overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Placeholder immagine */}
            <div className="h-48 bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
              <Tag className="w-12 h-12 text-sage-400" />
            </div>
            
            <div className="p-6">
              <span className="inline-block px-2 py-1 bg-sage-50 text-sage-600 text-xs font-medium rounded mb-3">
                {article.category}
              </span>
              
              <h3 className="text-lg font-semibold text-sage-800 mb-2 group-hover:text-sage-600 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-sage-600 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-sage-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('it-IT')}</span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
