import { RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatarTempo } from '@/lib/jogo/formatar'
import type { Jogo } from '@/lib/jogo/jogo'
import { rankingDaSessao } from '@/lib/jogo/ranking'
import { cn } from '@/lib/utils'
import { TabelaRanking } from './tabela-ranking'

export function TelaFinal({
  jogo,
  onJogarNovamente,
  onMenu,
}: {
  jogo: Jogo
  onJogarNovamente: () => void
  onMenu: () => void
}) {
  const venceu = jogo.status === 'vitoria'
  const entrada = jogo.resultadoNoRanking
  const estatisticas = [
    { rotulo: 'Robôs consertados', valor: String(jogo.robosConsertados) },
    { rotulo: 'Componentes substituídos', valor: String(jogo.componentesSubstituidos) },
    { rotulo: 'Tempo total', valor: formatarTempo(jogo.tempoTotalMs) },
    { rotulo: 'Erros de código', valor: String(jogo.erros) },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-fim"
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-background/85 p-3 backdrop-blur-sm sm:p-4"
    >
      <div className="my-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl border bg-card p-4 sm:gap-5 sm:p-6">
        <div className="text-center">
          <p
            className={cn(
              'font-mono text-xs uppercase tracking-[0.3em]',
              venceu ? 'text-success' : 'text-destructive',
            )}
          >
            {venceu ? 'Turno concluído' : 'Oficina lotada'}
          </p>
          <h2 id="titulo-fim" className="mt-1 text-balance text-2xl font-bold md:text-3xl">
            {venceu ? 'Todos os robôs foram consertados!' : 'Fim de jogo'}
          </h2>
          {entrada && (
            <p className="mt-1 text-sm text-muted-foreground">
              {jogo.jogador} ficou em{' '}
              <span className="font-semibold text-foreground">
                {rankingDaSessao.posicaoDe(entrada.id)}º lugar
              </span>{' '}
              no ranking.
            </p>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {estatisticas.map(({ rotulo, valor }) => (
            <div key={rotulo} className="rounded-lg border bg-background/50 p-3 text-center">
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{rotulo}</dt>
              <dd className="font-mono text-xl font-semibold sm:text-2xl">{valor}</dd>
            </div>
          ))}
        </dl>

        <TabelaRanking ranking={rankingDaSessao} destaqueId={entrada?.id} limite={10} />

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onMenu}>
            <Home aria-hidden="true" />
            Menu inicial
          </Button>
          <Button onClick={onJogarNovamente} autoFocus>
            <RotateCcw aria-hidden="true" />
            Jogar novamente
          </Button>
        </div>
      </div>
    </div>
  )
}
