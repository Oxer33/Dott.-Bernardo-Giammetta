// =============================================================================
// BLOG CATEGORIES - DOTT. BERNARDO GIAMMETTA
// Sidebar con categorie e tag del blog
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Folder, Tag, TrendingUp } from 'lucide-react';

// =============================================================================
// DATI CATEGORIE
// =============================================================================

const categories = [
  { name: 'Alimentazione', count: 12 },
  { name: 'Nutrienti', count: 8 },
  { name: 'Ricette', count: 15 },
  { name: 'Sport', count: 6 },
  { name: 'Salute', count: 10 },
  { name: 'Psicologia', count: 4 },
  { name: 'Pratico', count: 7 },
];

const popularTags = [
  'dieta', 'proteine', 'carboidrati', 'grassi', 
  'vitamine', 'benessere', 'ricette', 'colazione',
  'sport', 'intestino', 'metabolismo', 'peso',
];

// =============================================================================
// COMPONENTE BLOG CATEGORIES
// =============================================================================

export function BlogCategories() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 sticky top-24"
    >
      {/* Categorie */}
      <div className="bg-cream-50 rounded-xl p-6 border border-sage-100">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5 text-sage-600" />
          <h3 className="font-semibold text-sage-800">Categorie</h3>
        </div>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.name}>
              <a
                href={`/blog/categoria/${category.name.toLowerCase()}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white transition-colors group"
              >
                <span className="text-sage-700 group-hover:text-sage-900 transition-colors">
                  {category.name}
                </span>
                <span className="text-xs bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Tag popolari */}
      <div className="bg-cream-50 rounded-xl p-6 border border-sage-100">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-sage-600" />
          <h3 className="font-semibold text-sage-800">Tag Popolari</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <a
              key={tag}
              href={`/blog/tag/${tag}`}
              className="px-3 py-1 bg-white border border-sage-200 text-sage-600 text-sm rounded-full hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
      
      {/* Articoli più letti */}
      <div className="bg-cream-50 rounded-xl p-6 border border-sage-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-sage-600" />
          <h3 className="font-semibold text-sage-800">Più Letti</h3>
        </div>
        <ul className="space-y-3">
          <li>
            <a href="/blog/importanza-colazione" className="block hover:bg-white p-2 rounded-lg transition-colors">
              <span className="text-sm text-sage-700 line-clamp-2">
                L&apos;importanza della Colazione: Come Iniziare la Giornata
              </span>
            </a>
          </li>
          <li>
            <a href="/blog/proteine-vegetali" className="block hover:bg-white p-2 rounded-lg transition-colors">
              <span className="text-sm text-sage-700 line-clamp-2">
                Proteine Vegetali: Guida Completa alle Alternative
              </span>
            </a>
          </li>
          <li>
            <a href="/blog/intestino-secondo-cervello" className="block hover:bg-white p-2 rounded-lg transition-colors">
              <span className="text-sm text-sage-700 line-clamp-2">
                L&apos;Intestino: Il Nostro Secondo Cervello
              </span>
            </a>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
