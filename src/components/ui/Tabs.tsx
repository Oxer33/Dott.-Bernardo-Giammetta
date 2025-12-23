// =============================================================================
// TABS - DOTT. BERNARDO GIAMMETTA
// Componente tabs navigazione riutilizzabile
// =============================================================================

'use client';

import { useState, createContext, useContext, useId, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// =============================================================================
// CONTEXT
// =============================================================================

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: 'default' | 'pills' | 'underline';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// =============================================================================
// TABS ROOT
// =============================================================================

interface TabsProps {
  /** Tab attivo di default */
  defaultValue: string;
  /** Callback cambio tab */
  onValueChange?: (value: string) => void;
  /** Variante stile */
  variant?: 'default' | 'pills' | 'underline';
  /** Children */
  children: ReactNode;
  /** Classe container */
  className?: string;
}

export function Tabs({
  defaultValue,
  onValueChange,
  variant = 'default',
  children,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange, variant }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// =============================================================================
// TABS LIST
// =============================================================================

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  const { variant } = useTabsContext();

  const variantClasses = {
    default: 'bg-sage-100 p-1 rounded-xl',
    pills: 'gap-2',
    underline: 'border-b border-sage-200 gap-4',
  };

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

// =============================================================================
// TAB TRIGGER
// =============================================================================

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

export function TabTrigger({
  value,
  children,
  icon: Icon,
  disabled = false,
  className,
}: TabTriggerProps) {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;
  const id = useId();

  const baseClasses = cn(
    'relative flex items-center gap-2 font-medium transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400',
    disabled && 'opacity-50 cursor-not-allowed',
    !disabled && 'cursor-pointer'
  );

  const variantClasses = {
    default: cn(
      'px-4 py-2 rounded-lg text-sm',
      isActive
        ? 'bg-white text-sage-900 shadow-sm'
        : 'text-sage-600 hover:text-sage-900'
    ),
    pills: cn(
      'px-4 py-2 rounded-full text-sm',
      isActive
        ? 'bg-sage-600 text-white'
        : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
    ),
    underline: cn(
      'px-1 py-3 text-sm border-b-2 -mb-px',
      isActive
        ? 'border-sage-600 text-sage-900'
        : 'border-transparent text-sage-500 hover:text-sage-700'
    ),
  };

  return (
    <button
      role="tab"
      id={`tab-${id}-${value}`}
      aria-selected={isActive}
      aria-controls={`panel-${id}-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      
      {/* Indicator animato per variante default */}
      {variant === 'default' && isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        />
      )}
    </button>
  );
}

// =============================================================================
// TAB CONTENT
// =============================================================================

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  forceMount?: boolean;
}

export function TabContent({
  value,
  children,
  className,
  forceMount = false,
}: TabContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;
  const id = useId();

  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <motion.div
      role="tabpanel"
      id={`panel-${id}-${value}`}
      aria-labelledby={`tab-${id}-${value}`}
      hidden={!isActive}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
      transition={{ duration: 0.2 }}
      className={cn('mt-4', className)}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// SIMPLE TABS (Versione semplificata)
// =============================================================================

interface SimpleTab {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
  disabled?: boolean;
}

interface SimpleTabsProps {
  tabs: SimpleTab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function SimpleTabs({
  tabs,
  defaultTab,
  variant = 'default',
  onTabChange,
  className,
}: SimpleTabsProps) {
  const defaultValue = defaultTab || tabs[0]?.id || '';

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={onTabChange}
      variant={variant}
      className={className}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabTrigger
            key={tab.id}
            value={tab.id}
            icon={tab.icon}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabContent>
      ))}
    </Tabs>
  );
}

export default Tabs;
