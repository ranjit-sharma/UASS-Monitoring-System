import { cn } from '../../utils/cn.js';

export function StatCard({ label, value, unit, orbClass = 'orb-primary', icon = '📊', gradClass = 'grad-text-primary', className }) {
  return (
    <div className={cn('neu-flat min-w-0 overflow-hidden p-4 sm:p-5 flex flex-col justify-between gap-3', className)}>
      <div className="flex min-w-0 items-start gap-2">
        <span className="min-w-0 flex-1 break-words pt-1 text-subtle text-[13px] font-bold uppercase tracking-wider leading-tight">
          {label}
        </span>
        <div className={cn('grad-orb shrink-0 flex items-center justify-center', orbClass)}>
          <span className="text-xl leading-none sm:text-2xl" aria-hidden="true">{icon}</span>
        </div>
      </div>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className={cn('min-w-0 truncate text-2xl font-bold sm:text-3xl', gradClass)}>
          {value ?? '—'}
        </span>
        {unit && <span className="shrink-0 text-muted text-xs font-medium">{unit}</span>}
      </div>
    </div>
  );
}
