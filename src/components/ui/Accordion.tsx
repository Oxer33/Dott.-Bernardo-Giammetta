// =============================================================================
// ACCORDION - DOTT. BERNARDO GIAMMETTA
// Componente accordion/collapsible riutilizzabile
// =============================================================================

'use client';

import { useState, createContext, useContext, useId, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// CONTEXT
// =============================================================================

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
  iconStyle: 'chevron' | 'plus';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
}

// =============================================================================
// ACCORDION ROOT
// =============================================================================

interface AccordionProps {
  /** Tipo: single (uno alla volta) o multiple (più aperti) */
  type?: 'single' | 'multiple';
  /** Valori aperti di default */
  defaultValue?: string[];
  /** Stile icona */
  iconStyle?: 'chevron' | 'plus';
  /** Children */
  children: ReactNode;
  /** Classe container */
  className?: string;
}

export function Accordion({
  type = 'single',
  defaultValue = [],
  iconStyle = 'chevron',
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type, iconStyle }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

// =============================================================================
// ACCORDION ITEM
// =============================================================================

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  children,
  className,
  disabled = false,
}: AccordionItemProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <div
      className={cn(
        'border border-sage-200 rounded-xl overflow-hidden',
        isOpen && 'border-sage-300',
        disabled && 'opacity-50',
        className
      )}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
    </div>
  );
}

// =============================================================================
// ACCORDION TRIGGER
// =============================================================================

interface AccordionTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AccordionTrigger({
  value,
  children,
  className,
  disabled = false,
}: AccordionTriggerProps) {
  const { openItems, toggleItem, iconStyle } = useAccordionContext();
  const isOpen = openItems.includes(value);
  const id = useId();

  const Icon = iconStyle === 'chevron' ? ChevronDown : isOpen ? Minus : Plus;

  return (
    <button
      id={`trigger-${id}`}
      aria-expanded={isOpen}
      aria-controls={`content-${id}`}
      disabled={disabled}
      onClick={() => !disabled && toggleItem(value)}
      className={cn(
        'flex items-center justify-between w-full p-4 text-left',
        'font-medium text-sage-900 bg-white',
        'hover:bg-sage-50 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <span>{children}</span>
      <motion.div
        animate={{ rotate: iconStyle === 'chevron' && isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-5 h-5 text-sage-500" />
      </motion.div>
    </button>
  );
}

// =============================================================================
// ACCORDION CONTENT
// =============================================================================

interface AccordionContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function AccordionContent({
  value,
  children,
  className,
}: AccordionContentProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);
  const id = useId();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={`content-${id}`}
          role="region"
          aria-labelledby={`trigger-${id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className={cn('p-4 pt-0 text-sage-600', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// SIMPLE ACCORDION (Versione semplificata)
// =============================================================================

interface SimpleAccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

interface SimpleAccordionProps {
  items: SimpleAccordionItem[];
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  iconStyle?: 'chevron' | 'plus';
  className?: string;
}

export function SimpleAccordion({
  items,
  type = 'single',
  defaultOpen = [],
  iconStyle = 'chevron',
  className,
}: SimpleAccordionProps) {
  return (
    <Accordion
      type={type}
      defaultValue={defaultOpen}
      iconStyle={iconStyle}
      className={className}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} disabled={item.disabled}>
          <AccordionTrigger value={item.id} disabled={item.disabled}>
            {item.title}
          </AccordionTrigger>
          <AccordionContent value={item.id}>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// =============================================================================
// FAQ ACCORDION
// Variante per sezioni FAQ
// =============================================================================

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <Accordion type="single" iconStyle="plus" className={className}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger value={`faq-${index}`}>
            {item.question}
          </AccordionTrigger>
          <AccordionContent value={`faq-${index}`}>
            <p className="text-sage-600 leading-relaxed">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default Accordion;
