import { ArrowRight } from 'lucide-react'
import { TEMPO_TRANSITO_MS, type Jogo } from '@/lib/jogo/jogo'
import { BadgePrioridade } from './badge-prioridade'
import { ImagemRobo } from './imagem-robo'

export function EsteiraChegada({ jogo }: { jogo: Jogo }) {
  const fila = jogo.esteira

  return (
    <section aria-labelledby="titulo-esteira" className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 id="titulo-esteira" className="text-sm font-semibold">
          Esteira de chegada
        </h2>
        <span className="font-mono text-[11px] text-muted-foreground">Fila · {fila.tamanho} na fila</span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
          ENTRADA <ArrowRight className="size-3" aria-hidden="true" /> SAÍDA
          <ArrowRight className="size-3" aria-hidden="true" /> oficina
        </span>
      </div>

      <div className="esteira-faixa relative flex min-h-24 items-center gap-3 overflow-hidden rounded-lg border border-dashed bg-background/60 p-3">
        {fila.estaVazia() && !jogo.roboEmTransito && (
          <p className="mx-auto text-xs text-muted-foreground">Nenhum robô aguardando.</p>
        )}
        {jogo.roboEmTransito && (
          <div
            key={jogo.roboEmTransito.id}
            aria-hidden="true"
            className="esteira-robo-em-transito absolute right-2 top-1/2 z-10 flex shrink-0 items-center gap-2 rounded-lg border bg-card p-2 pr-3 shadow-lg"
            style={{ animationDuration: `${TEMPO_TRANSITO_MS}ms` }}
          >
            <ImagemRobo
              src={jogo.roboEmTransito.modelo.imagem}
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-md object-cover"
            />
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium">{jogo.roboEmTransito.rotulo}</p>
              <BadgePrioridade prioridade={jogo.roboEmTransito.prioridade} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
