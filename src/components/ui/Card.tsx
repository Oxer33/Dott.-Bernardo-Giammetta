// =============================================================================
// CARD - DOTT. BERNARDO GIAMMETTA
// Componente card riutilizzabile con varianti
// =============================================================================

'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// =============================================================================
// TIPI
// =============================================================================

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Contenuto */
  children: ReactNode;
  /** Variante stile */
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  /** Padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hover effect */
  hover?: boolean;
  /** Click handler (rende la card cliccabile) */
  onClick?: () => void;
  /** Classe aggiuntiva */
  className?: string;
}

// =============================================================================
// VARIANTI
// =============================================================================

const cardVariants = {
  default: 'bg-white border border-sage-100',
  outlined: 'bg-transparent border-2 border-sage-200',
  elevated: 'bg-white shadow-lg shadow-sage-200/50',
  glass: 'bg-white/70 backdrop-blur-lg border border-white/20',
};

const paddingVariants = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

// =============================================================================
// COMPONENTE CARD
// =============================================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hover = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const isClickable = !!onClick;

    return (
      <motion.div
        ref={ref}
        whileHover={hover || isClickable ? { y: -2, scale: 1.01 } : undefined}
        whileTap={isClickable ? { scale: 0.99 } : undefined}
        onClick={onClick}
        className={cn(
          'rounded-2xl transition-all duration-200',
          cardVariants[variant],
          paddingVariants[padding],
          isClickable && 'cursor-pointer',
          hover && 'hover:shadow-md',
          className
        )}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// =============================================================================
// CARD HEADER
// =============================================================================

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 bg-sage-100 rounded-xl">
            <Icon className="w-5 h-5 text-sage-600" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-sage-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-sage-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// =============================================================================
// CARD CONTENT
// =============================================================================

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('mt-4', className)}>{children}</div>;
}

// =============================================================================
// CARD FOOTER
// =============================================================================

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  divided?: boolean;
}

export function CardFooter({ children, className, divided = false }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 pt-4',
        divided && 'border-t border-sage-100',
        className
      )}
    >
      {children}
    </div>
  );
}

// =============================================================================
// STAT CARD
// =============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-sage-600 bg-sage-50',
  };

  return (
    <Card variant="default" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-sage-500">{title}</p>
          <p className="text-2xl font-bold text-sage-900 mt-1">{value}</p>
          {change && (
            <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-2', trendColors[change.trend])}>
              {change.trend === 'up' && '↑'}
              {change.trend === 'down' && '↓'}
              {Math.abs(change.value)}%
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-sage-100 rounded-xl">
            <Icon className="w-6 h-6 text-sage-600" />
          </div>
        )}
      </div>
    </Card>
  );
}

// =============================================================================
// FEATURE CARD
// =============================================================================

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  className,
}: FeatureCardProps) {
  const content = (
    <Card
      variant="default"
      hover
      onClick={onClick}
      className={cn('group', className)}
    >
      <div className="p-3 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl w-fit group-hover:from-sage-200 group-hover:to-sage-300 transition-colors">
        <Icon className="w-6 h-6 text-sage-700" />
      </div>
      <h3 className="font-semibold text-sage-900 mt-4">{title}</h3>
      <p className="text-sm text-sage-600 mt-1">{description}</p>
    </Card>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

// =============================================================================
// PROFILE CARD
// =============================================================================

interface ProfileCardProps {
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  actions?: ReactNode;
  className?: string;
}

export function ProfileCard({
  name,
  email,
  avatar,
  role,
  actions,
  className,
}: ProfileCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card variant="default" className={className}>
      <div className="flex items-center gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sage-900 truncate">{name}</h4>
          {email && (
            <p className="text-sm text-sage-500 truncate">{email}</p>
          )}
          {role && (
            <span className="inline-block px-2 py-0.5 bg-sage-100 text-sage-700 text-xs rounded-full mt-1">
              {role}
            </span>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </Card>
  );
}

export default Card;
