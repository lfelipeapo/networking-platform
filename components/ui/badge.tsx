import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'pendente'
    | 'aprovado'
    | 'recusado'
    | 'andamento'
    | 'nova'
    | 'em_contato'
    | 'fechada'
    | 'recusada';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      aprovado: 'bg-green-100 text-green-800',
      recusado: 'bg-red-100 text-red-800',
      andamento: 'bg-blue-100 text-blue-800',
      nova: 'bg-blue-100 text-blue-800',
      em_contato: 'bg-purple-100 text-purple-800',
      fechada: 'bg-green-100 text-green-800',
      recusada: 'bg-red-100 text-red-800',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
