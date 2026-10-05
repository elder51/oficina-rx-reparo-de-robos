import { formatarTempo } from '@/lib/jogo/formatar'
import type { Jogo, TipoEvento } from '@/lib/jogo/jogo'
import { cn } from '@/lib/utils'

const COR_EVENTO: Record<TipoEvento, string> = {
  chegada: 'bg-muted-foreground',
  entrada: 'bg-primary',
  sucesso: 'bg-success',
  consertado: 'bg-success',
  erro: 'bg-destructive',
  alerta: 'bg-accent',
}

export function RegistroEventos({ jogo }: { jogo: Jogo }) {
  return (
    <section aria-labelledby="titulo-eventos" className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h2 id="titulo-eventos" className="whitespace-nowrap text-sm font-semibold">
          Registro da oficina
        </h2>
        <span className="font-mono text-[11px] text-muted-foreground">lista · mais recente na cabeça</span>
      </div>
      <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
        {jogo.mapearEventos((evento) => (
          <li key={evento.id} className="flex items-start gap-2 text-xs">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full" aria-hidden="true">
              <span className={cn('block size-1.5 rounded-full', COR_EVENTO[evento.tipo])} />
            </span>
            <span className="w-10 shrink-0 font-mono text-muted-foreground">
              {formatarTempo(evento.instanteMs)}
            </span>
            <span className="text-pretty">{evento.mensagem}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
