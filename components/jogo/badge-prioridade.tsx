import { Prioridade, ROTULO_PRIORIDADE } from '@/lib/jogo/robo'
import { cn } from '@/lib/utils'

const ESTILO: Record<Prioridade, string> = {
  [Prioridade.EMERGENCIA]: 'bg-destructive/15 text-destructive border-destructive/40',
  [Prioridade.PADRAO]: 'bg-primary/15 text-primary border-primary/40',
  [Prioridade.BAIXO_RISCO]: 'bg-success/15 text-success border-success/40',
}

export function BadgePrioridade({
  prioridade,
  className,
}: {
  prioridade: Prioridade
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
        ESTILO[prioridade],
        className,
      )}
    >
      {ROTULO_PRIORIDADE[prioridade]}
    </span>
  )
}
