import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Jogo } from '@/lib/jogo/jogo'
import { BadgePrioridade } from './badge-prioridade'

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
          FIM <ArrowRight className="size-3" aria-hidden="true" /> INÍCIO
          <ArrowRight className="size-3" aria-hidden="true" /> oficina
        </span>
      </div>

      <div className="esteira-faixa flex min-h-24 flex-row-reverse items-center justify-start gap-3 overflow-x-auto rounded-lg border border-dashed bg-background/60 p-3">
        {fila.estaVazia() ? (
          <p className="mx-auto text-xs text-muted-foreground">Nenhum robô aguardando.</p>
        ) : (
          fila.mapear((robo, indice) => (
            <div
              key={robo.id}
              className="flex shrink-0 items-center gap-2 rounded-lg border bg-card p-2 pr-3"
            >
              <Image
                src={robo.modelo.imagem}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-md object-cover"
              />
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium">
                  {robo.rotulo}
                  {indice === 0 && (
                    <span className="ml-1 font-mono text-[10px] text-primary">(início)</span>
                  )}
                </p>
                <BadgePrioridade prioridade={robo.prioridade} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
