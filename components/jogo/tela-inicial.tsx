'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Cpu,
  Home,
  Layers,
  ListOrdered,
  Rows3,
  Trophy,
  UserX,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DIFICULDADES } from '@/lib/jogo/jogo'
import { rankingDaSessao } from '@/lib/jogo/ranking'
import { cn } from '@/lib/utils'
import { TabelaRanking } from './tabela-ranking'

export type ChaveDificuldade = keyof typeof DIFICULDADES

type SecaoManual = 'regras' | 'dificuldades' | 'ranking' | ChaveDificuldade

const ESTRUTURAS = [
  {
    icone: Rows3,
    titulo: 'Fila — esteira de chegada',
    texto: 'Os robôs aguardam na fila e atravessam a esteira um por vez, na ordem de chegada.',
  },
  {
    icone: ListOrdered,
    titulo: 'Lista duplamente encadeada — oficina',
    texto: 'Robôs em atendimento, inseridos e ordenados por prioridade.',
  },
  {
    icone: Layers,
    titulo: 'Pilha — componentes do robô',
    texto: 'Só a peça do topo pode ser trocada (LIFO). Pilha vazia = robô consertado.',
  },
]

const NOMES_SECOES: Record<SecaoManual, string> = {
  regras: 'Como jogar',
  dificuldades: 'Dificuldades',
  ranking: 'Ranking',
  facil: 'Fácil',
  normal: 'Normal',
  dificil: 'Difícil',
}

function ManualOficina({ ranking }: { ranking: typeof rankingDaSessao }) {
  const [caminho, setCaminho] = useState<SecaoManual[]>([])
  const secaoAtual = caminho.at(-1)

  function abrirSecao(secao: SecaoManual) {
    setCaminho((atual) => [...atual, secao])
  }

  function desempilhar() {
    setCaminho((atual) => atual.slice(0, -1))
  }

  function abrirCaminho(indice: number) {
    setCaminho((atual) => atual.slice(0, indice + 1))
  }

  function itemSecao(
    secao: SecaoManual,
    descricao: string,
    indice: number,
    Icone: typeof ListOrdered,
  ) {
    return (
      <li key={secao} className="relative">
        <button
          type="button"
          onClick={() => abrirSecao(secao)}
          className="group flex w-full items-center gap-3 rounded-lg border bg-background/50 p-3 text-left transition-colors hover:border-primary/50 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-xs text-muted-foreground">
            {String(indice + 1).padStart(2, '0')}
          </span>
          <Icone className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">{NOMES_SECOES[secao]}</span>
            <span className="block text-xs text-muted-foreground">{descricao}</span>
          </span>
          <span className="hidden items-center gap-1 font-mono text-[10px] text-muted-foreground sm:flex">
            PRÓXIMO <ArrowRight className="size-3" aria-hidden="true" />
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
        </button>
      </li>
    )
  }

  return (
    <section
      className="rounded-xl border bg-card p-4 sm:p-5"
      aria-labelledby="titulo-manual"
    >
      <div className="mb-3 flex items-center gap-2">
        <ListOrdered className="size-4 text-accent" aria-hidden="true" />
        <h2 id="titulo-manual" className="text-sm font-semibold">
          Estruturas da oficina
        </h2>
      </div>

      <nav aria-label="Pilha de navegação do manual" className="mb-2 rounded-lg border bg-background/40 p-2">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Layers className="size-3" aria-hidden="true" />
            PILHA DE NAVEGAÇÃO
          </span>
          {caminho.length > 0 && (
            <button
              type="button"
              onClick={desempilhar}
              className="inline-flex items-center gap-1 rounded px-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-3" aria-hidden="true" />
              Desempilhar
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs leading-none">
          <button
            type="button"
            onClick={() => setCaminho([])}
            aria-label="Início da navegação"
            aria-current={!secaoAtual ? 'page' : undefined}
            className="flex items-center gap-1 rounded border px-2 py-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground aria-[current=page]:border-primary/50 aria-[current=page]:font-medium aria-[current=page]:text-foreground"
          >
            <Home className="size-3" aria-hidden="true" />
            Base
          </button>
          {caminho.map((secao, indice) => (
            <span key={`${secao}-${indice}`} className="flex items-center gap-1">
              <ChevronRight className="size-3 text-muted-foreground" aria-hidden="true" />
              <button
                type="button"
                onClick={() => abrirCaminho(indice)}
                aria-current={indice === caminho.length - 1 ? 'page' : undefined}
                className="rounded border px-2 py-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground aria-[current=page]:border-primary/50 aria-[current=page]:font-medium aria-[current=page]:text-foreground"
              >
                {NOMES_SECOES[secao]}
              </button>
            </span>
          ))}
        </div>
      </nav>

      {!secaoAtual && (
        <div>
          <p className="mb-2 font-mono text-[10px] text-muted-foreground">LISTA DE CONSULTA</p>
          <ol className="flex flex-col gap-2">
            {itemSecao('regras', 'Objetivo e regras essenciais', 0, ListOrdered)}
            <li aria-hidden="true" className="flex h-3 items-center pl-7 text-muted-foreground">
              <ArrowDown className="size-3" />
            </li>
            {itemSecao('dificuldades', 'Consulte os detalhes de cada nível', 1, Rows3)}
            <li aria-hidden="true" className="flex h-3 items-center pl-7 text-muted-foreground">
              <ArrowDown className="size-3" />
            </li>
            {itemSecao('ranking', 'Pontuações ordenadas dos técnicos', 2, Trophy)}
          </ol>
        </div>
      )}

      {secaoAtual === 'regras' && (
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>A cada rodada, novos robôs chegam à oficina trazendo uma pilha de peças defeituosas.</li>
          <li>
            Selecione um robô e digite o código alfanumérico mostrado na peça do topo da pilha.
            Pressione “Substituir”: se o código estiver correto, a peça será consertada e a próxima
            ficará disponível. Repita até consertar o robô.
          </li>
          <li>
            Conserte todos os robôs de todas as rodadas para vencer. Se a oficina ultrapassar o
            limite de robôs, você perde.
          </li>
          <li>
            A próxima rodada começa quando a contagem regressiva entre rodadas chega a zero.
            Se esvaziar a oficina antes do fim da contagem, os segundos que sobrarem são descontados
            do seu tempo final; quanto mais cedo liberar a oficina, maior o bônus. Não há bônus na
            última rodada.
          </li>
          <li>
            Cada código incorreto soma tempo ao resultado final: 2 s no Fácil, 3 s no Normal e 5 s
            no Difícil. Essa penalidade aumenta seu tempo final.
          </li>
        </ol>
      )}

      {secaoAtual === 'dificuldades' && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Nas duas primeiras rodadas, há 70% de chance de vir um robô a menos (mínimo de 1).
          </p>
          <p className="mb-2 font-mono text-[10px] text-muted-foreground">NÓS DO ÍNDICE · SELECIONE UM NÍVEL</p>
          <ol className="flex flex-col gap-2">
            {itemSecao('facil', 'Menos rodadas e mais espaço para robôs', 0, Rows3)}
            <li aria-hidden="true" className="flex h-3 items-center pl-7 text-muted-foreground">
              <ArrowDown className="size-3" />
            </li>
            {itemSecao('normal', 'Desafio intermediário', 1, Rows3)}
            <li aria-hidden="true" className="flex h-3 items-center pl-7 text-muted-foreground">
              <ArrowDown className="size-3" />
            </li>
            {itemSecao('dificil', 'Mais robôs, mais peças e oficina menor', 2, Rows3)}
          </ol>
        </div>
      )}

      {(secaoAtual === 'facil' || secaoAtual === 'normal' || secaoAtual === 'dificil') && (
        <div className="rounded-lg border bg-background/40 p-3">
          <h3 className="mb-2 text-sm font-semibold">{DIFICULDADES[secaoAtual].nome}</h3>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div>
              <dt className="text-muted-foreground">Rodadas</dt>
              <dd className="font-medium">{DIFICULDADES[secaoAtual].totalRodadas}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Capacidade da oficina</dt>
              <dd className="font-medium">{DIFICULDADES[secaoAtual].capacidade} robôs</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Robôs por rodada</dt>
              <dd className="font-medium">
                {DIFICULDADES[secaoAtual].minRobosPorRodada}–{DIFICULDADES[secaoAtual].maxRobosPorRodada}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Travessia da esteira</dt>
              <dd className="font-medium">{DIFICULDADES[secaoAtual].intervaloEsteiraMs / 1000} s</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Peças por robô</dt>
              <dd className="font-medium">
                Até {DIFICULDADES[secaoAtual].maxComponentes}, a partir da rodada{' '}
                {Math.max(1, 2 * (DIFICULDADES[secaoAtual].maxComponentes - 2))}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tamanho do código</dt>
              <dd className="font-medium">{DIFICULDADES[secaoAtual].tamanhoCodigo} caracteres</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Penalidade por erro</dt>
              <dd className="font-medium">
                +{DIFICULDADES[secaoAtual].penalidadeErroMs / 1000} s no tempo final
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Intervalo entre rodadas</dt>
              <dd className="font-medium">
                {DIFICULDADES[secaoAtual].intervaloRodadaMs / 1000} s
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            A quantidade de peças aumenta gradualmente durante a partida.
          </p>
        </div>
      )}

      {secaoAtual === 'ranking' && (
        <div className="mt-4 border-t pt-4">
          <TabelaRanking ranking={ranking} limite={5} integrado />
        </div>
      )}
    </section>
  )
}

export function TelaInicial({
  onIniciar,
}: {
  onIniciar: (nome: string, dificuldade: ChaveDificuldade) => void
}) {
  const [nome, setNome] = useState('')
  const [dificuldade, setDificuldade] = useState<ChaveDificuldade>('normal')
  const [alertaAberto, setAlertaAberto] = useState(false)
  const inputNomeRef = useRef<HTMLInputElement>(null)
  const nomeValido = nome.trim().length > 0

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 md:py-16">
      <header className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <div className="flex -space-x-6">
          {['atlas', 'vespa', 'k9', 'tita'].map((nomeImg) => (
            <Image
              key={nomeImg}
              src={`/robos/${nomeImg}.png`}
              alt=""
              width={88}
              height={88}
              className="size-16 rounded-full border-2 border-background object-cover md:size-20"
            />
          ))}
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Oficina RX</p>
          <h1 className="mt-1 text-balance text-3xl font-bold md:text-5xl">
            Reparo de Robôs
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
            Você é o técnico de plantão. Robôs danificados chegam sem parar — digite os códigos
            de substituição e libere a oficina antes que ela lote.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form
          className="flex flex-col gap-5 rounded-xl border bg-card p-4 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault()
            if (nomeValido) onIniciar(nome.trim(), dificuldade)
            else setAlertaAberto(true)
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nome-jogador" className="text-sm font-medium">
              Nome do técnico
            </label>
            <input
              ref={inputNomeRef}
              id="nome-jogador"
              aria-invalid={alertaAberto || undefined}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={20}
              autoComplete="off"
              placeholder="Ex.: Ana"
              className="h-11 rounded-lg border bg-input/40 px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Dificuldade</legend>
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
              {(Object.keys(DIFICULDADES) as ChaveDificuldade[]).map((chave) => {
                const config = DIFICULDADES[chave]
                const ativo = chave === dificuldade
                return (
                  <button
                    key={chave}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => setDificuldade(chave)}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors',
                      ativo ? 'border-primary bg-primary/10' : 'hover:bg-secondary',
                    )}
                  >
                    <span className="font-semibold">{config.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      {config.totalRodadas} rodadas · máx. {config.capacidade} robôs
                    </span>
                    <span className="text-xs text-muted-foreground">
                      códigos de {config.tamanhoCodigo} caracteres
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <Button type="submit" size="lg" className="h-11">
            <Cpu aria-hidden="true" />
            Iniciar turno
          </Button>

          <ul className="flex flex-col gap-3 border-t pt-5">
            {ESTRUTURAS.map(({ icone: Icone, titulo, texto }) => (
              <li key={titulo} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icone className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{titulo}</p>
                  <p className="text-xs text-muted-foreground">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </form>

        <ManualOficina ranking={rankingDaSessao} />
      </div>

      <AlertDialog
        open={alertaAberto}
        onOpenChange={setAlertaAberto}
        onOpenChangeComplete={(aberto) => {
          if (!aberto) inputNomeRef.current?.focus()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <UserX aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Informe seu nome</AlertDialogTitle>
            <AlertDialogDescription>
              O turno não pode começar sem um técnico identificado. Digite seu nome para que sua
              pontuação apareça no ranking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertaAberto(false)}>
              Digitar nome
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
