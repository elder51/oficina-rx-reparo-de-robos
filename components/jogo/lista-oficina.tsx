import { ArrowLeftRight } from 'lucide-react'
import type { Jogo } from '@/lib/jogo/jogo'
import { CartaoRobo } from './cartao-robo'

export function ListaOficina({ jogo }: { jogo: Jogo }) {
  const oficina = jogo.oficina
  const idSelecionado = jogo.roboSelecionado?.id

  return (
    <section aria-labelledby="titulo-oficina" className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 id="titulo-oficina" className="text-sm font-semibold">
          Robôs na oficina
        </h2>
        <span className="font-mono text-[11px] text-muted-foreground">
          Lista duplamente encadeada · ordenada por prioridade
        </span>
      </div>

      {oficina.estaVazia() ? (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Oficina livre. Aguardando os próximos robôs...
        </div>
      ) : (
        <ol className="flex items-center gap-1 overflow-x-auto pb-2">
          <li aria-hidden="true" className="shrink-0 pr-1 font-mono text-[10px] text-muted-foreground">
            cabeça
          </li>
          {oficina.mapearRobos((robo, indice) => (
            <li key={robo.id} className="flex shrink-0 items-center gap-1">
              {indice > 0 && (
                <ArrowLeftRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-label="anterior e próximo"
                />
              )}
              <CartaoRobo
                robo={robo}
                selecionado={robo.id === idSelecionado}
                onSelecionar={() => jogo.selecionarRobo(robo.id)}
              />
            </li>
          ))}
          <li aria-hidden="true" className="shrink-0 pl-1 font-mono text-[10px] text-muted-foreground">
            cauda
          </li>
        </ol>
      )}
    </section>
  )
}
