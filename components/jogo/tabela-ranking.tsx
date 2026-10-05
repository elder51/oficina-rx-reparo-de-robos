'use client'

import { useState } from 'react'
import { Plus, Search, Trophy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatarTempo } from '@/lib/jogo/formatar'
import type { EntradaRanking, Ranking } from '@/lib/jogo/ranking'
import { cn } from '@/lib/utils'

function LinhaRanking({
  entrada,
  posicao,
  destaque,
}: {
  entrada: EntradaRanking
  posicao: number
  destaque: boolean
}) {
  return (
    <tr className={cn('border-t', destaque && 'bg-primary/10 text-primary')}>
      <td className="py-2 pr-2 font-mono">{posicao}</td>
      <td className="max-w-0 py-2 pr-2">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{entrada.jogador}</span>
          {entrada.venceu && (
            <span className="shrink-0 text-[10px] uppercase text-success">vitória</span>
          )}
        </div>
      </td>
      <td className="py-2 pr-2 text-right font-mono">{entrada.robosConsertados}</td>
      <td className="hidden py-2 pr-2 text-right font-mono sm:table-cell">
        {entrada.componentesSubstituidos}
      </td>
      <td className="py-2 text-right font-mono">{formatarTempo(entrada.tempoTotalMs)}</td>
    </tr>
  )
}

function Tabela({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full table-fixed text-sm">
      <colgroup>
        <col className="w-8" />
        <col />
        <col className="w-14" />
        <col className="hidden w-14 sm:table-column" />
        <col className="w-16" />
      </colgroup>
      <thead>
        <tr className="text-left text-xs text-muted-foreground">
          <th scope="col" className="pb-2 pr-2 font-medium">#</th>
          <th scope="col" className="pb-2 pr-2 font-medium">Jogador</th>
          <th scope="col" className="pb-2 pr-2 text-right font-medium">Robôs</th>
          <th scope="col" className="hidden pb-2 pr-2 text-right font-medium sm:table-cell">Peças</th>
          <th scope="col" className="pb-2 text-right font-medium">Tempo</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

function ModalRanking({
  ranking,
  destaqueId,
  onFechar,
}: {
  ranking: Ranking
  destaqueId?: number
  onFechar: () => void
}) {
  const [busca, setBusca] = useState('')
  const termo = busca.trim().toLowerCase()
  const linhas = ranking
    .mapear((entrada, indice) => ({ entrada, posicao: indice + 1 }))
    .filter(({ entrada }) => !termo || entrada.jogador.toLowerCase().includes(termo))

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-ranking-completo"
      onKeyDown={(e) => e.key === 'Escape' && onFechar()}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-background/85 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col rounded-t-2xl border bg-card sm:rounded-2xl">
        <div className="flex items-center gap-2 border-b p-4">
          <Trophy className="size-4 text-accent" aria-hidden="true" />
          <h2 id="titulo-ranking-completo" className="font-semibold">
            Ranking completo
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {ranking.tamanho} {ranking.tamanho === 1 ? 'partida' : 'partidas'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={onFechar}
            aria-label="Fechar ranking completo"
            autoFocus
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="border-b p-4">
          <label htmlFor="busca-ranking" className="sr-only">
            Buscar jogador
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="busca-ranking"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar jogador..."
              autoComplete="off"
              className="h-10 w-full rounded-lg border bg-input/40 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4">
          {linhas.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum jogador encontrado.
            </p>
          ) : (
            <Tabela>
              {linhas.map(({ entrada, posicao }) => (
                <LinhaRanking
                  key={entrada.id}
                  entrada={entrada}
                  posicao={posicao}
                  destaque={entrada.id === destaqueId}
                />
              ))}
            </Tabela>
          )}
        </div>
      </div>
    </div>
  )
}

export function TabelaRanking({
  ranking,
  destaqueId,
  limite = 5,
}: {
  ranking: Ranking
  destaqueId?: number
  limite?: number
}) {
  const [aberto, setAberto] = useState(false)
  const restantes = Math.max(0, ranking.tamanho - limite)

  return (
    <section aria-labelledby="titulo-ranking" className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="size-4 shrink-0 text-accent" aria-hidden="true" />
        <h2 id="titulo-ranking" className="shrink-0 text-sm font-semibold">
          Top {limite} técnicos
        </h2>
        <span className="hidden truncate font-mono text-[11px] text-muted-foreground min-[440px]:inline">
          lista encadeada ordenada
        </span>
        <Button
          variant="outline"
          size="icon"
          className="ml-auto size-8"
          onClick={() => setAberto(true)}
          disabled={ranking.tamanho === 0}
          aria-label="Ver ranking completo"
          title="Ver ranking completo"
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>

      {ranking.tamanho === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhuma partida registrada ainda.
        </p>
      ) : (
        <>
          <Tabela>
            {ranking.mapearTop(limite, (entrada, indice) => (
              <LinhaRanking
                key={entrada.id}
                entrada={entrada}
                posicao={indice + 1}
                destaque={entrada.id === destaqueId}
              />
            ))}
          </Tabela>
          {restantes > 0 && (
            <button
              type="button"
              onClick={() => setAberto(true)}
              className="mt-2 w-full rounded-md py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              + {restantes} {restantes === 1 ? 'jogador' : 'jogadores'} no ranking completo
            </button>
          )}
        </>
      )}

      {aberto && (
        <ModalRanking ranking={ranking} destaqueId={destaqueId} onFechar={() => setAberto(false)} />
      )}
    </section>
  )
}
