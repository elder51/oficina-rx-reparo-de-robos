import { Layers } from 'lucide-react'
import type { Robo } from '@/lib/jogo/robo'
import { cn } from '@/lib/utils'
import { BadgePrioridade } from './badge-prioridade'
import { ImagemRobo } from './imagem-robo'

export function CartaoRobo({
  robo,
  selecionado,
  onSelecionar,
}: {
  robo: Robo
  selecionado: boolean
  onSelecionar: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-pressed={selecionado}
      aria-label={`${robo.rotulo}, ${robo.componentesRestantes} componente(s) restante(s)`}
      className={cn(
        'flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border bg-card text-left transition-all',
        'hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selecionado && 'border-primary ring-2 ring-primary/40',
      )}
    >
      <div className="relative">
        <ImagemRobo
          src={robo.modelo.imagem}
          alt=""
          width={176}
          height={120}
          className="h-28 w-full object-cover"
        />
        <BadgePrioridade
          prioridade={robo.prioridade}
          className="absolute left-2 top-2 bg-background/90"
        />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="truncate text-sm font-semibold">{robo.rotulo}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="size-3" aria-hidden="true" />
            {robo.componentesRestantes}/{robo.totalComponentes} na pilha
          </span>
          <span className="font-mono">{Math.round(robo.progresso * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-success transition-all"
            style={{ width: `${robo.progresso * 100}%` }}
          />
        </div>
      </div>
    </button>
  )
}
