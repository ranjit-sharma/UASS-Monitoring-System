import { cn } from '../../utils/cn.js';

export function StatCard({ label, value, unit, orbClass = 'orb-primary', icon = '📊', gradClass = 'grad-text-primary', className }) {
  return (
    <div className={cn('neu-flat p-5 flex flex-col justify-between gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-subtle text-[13px] font-bold uppercase tracking-wider">{label}</span>
        <div className={cn('grad-orb shrink-0 flex items-center justify-center', orbClass)}>
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-1.5 min-w-0">
        <span className={cn('text-2xl sm:text-3xl font-bold truncate', gradClass)}>
          {value ?? '—'}
        </span>
        {unit && <span className="text-muted text-xs font-medium mb-1 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}
