import { AlertTriangle, CheckCircle2, Clock, Timer, Wrench } from 'lucide-react'
import { formatarTempo } from '@/lib/jogo/formatar'
import type { Jogo } from '@/lib/jogo/jogo'
import { cn } from '@/lib/utils'

function Indicador({
  icone: Icone,
  rotulo,
  valor,
}: {
  icone: typeof Clock
  rotulo: string
  valor: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
      <Icone className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{rotulo}</p>
        <p className="font-mono text-lg font-semibold leading-tight">{valor}</p>
      </div>
    </div>
  )
}

export function PainelStatus({ jogo }: { jogo: Jogo }) {
  const ocupacao = jogo.oficina.quantidade
  const capacidade = jogo.oficina.capacidade
  const proxima = jogo.msAteProximaRodada
  const critico = ocupacao >= capacidade

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Oficina RX</p>
          <h1 className="text-xl font-bold md:text-2xl">Turno de {jogo.jogador}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Dificuldade <span className="font-medium text-foreground">{jogo.config.nome}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <Indicador icone={Clock} rotulo="Tempo" valor={formatarTempo(jogo.tempoTotalMs)} />
        <Indicador
          icone={Timer}
          rotulo={`Rodada ${jogo.rodada}/${jogo.config.totalRodadas}`}
          valor={proxima === null ? 'última' : `${Math.ceil(proxima / 1000)}s`}
        />
        <Indicador icone={CheckCircle2} rotulo="Consertados" valor={String(jogo.robosConsertados)} />
        <Indicador icone={Wrench} rotulo="Peças trocadas" valor={String(jogo.componentesSubstituidos)} />

        <div
          className={cn(
            'col-span-2 flex flex-col justify-center gap-1.5 rounded-lg border bg-card px-3 py-2 md:col-span-1',
            critico && 'border-destructive/60',
          )}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
            <span className="flex items-center gap-1">
              {critico && <AlertTriangle className="size-3 text-destructive" aria-hidden="true" />}
              Lotação
            </span>
            <span className={cn('font-mono text-sm', critico ? 'text-destructive' : 'text-foreground')}>
              {ocupacao}/{capacidade}
            </span>
          </div>
          <div
            className="flex gap-1"
            role="meter"
            aria-label="Lotação da oficina"
            aria-valuemin={0}
            aria-valuemax={capacidade}
            aria-valuenow={ocupacao}
          >
            {Array.from({ length: capacidade }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 flex-1 rounded-full',
                  i < ocupacao ? (critico ? 'bg-destructive' : 'bg-primary') : 'bg-secondary',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
