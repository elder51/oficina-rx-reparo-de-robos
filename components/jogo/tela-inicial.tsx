'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Cpu, Layers, ListOrdered, Rows3, UserX } from 'lucide-react'
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

const ESTRUTURAS = [
  {
    icone: Rows3,
    titulo: 'Fila — esteira de chegada',
    texto: 'Robôs chegam a cada rodada e entram na oficina na ordem de chegada (FIFO).',
  },
  {
    icone: ListOrdered,
    titulo: 'Lista duplamente encadeada — oficina',
    texto: 'Robôs em atendimento, inseridos ordenados por prioridade. Também guarda o ranking e o log.',
  },
  {
    icone: Layers,
    titulo: 'Pilha — componentes do robô',
    texto: 'Só a peça do topo pode ser trocada (LIFO). Pilha vazia = robô consertado.',
  },
]

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

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border bg-card p-4 sm:p-6" aria-labelledby="titulo-regras">
            <h2 id="titulo-regras" className="mb-3 text-sm font-semibold">
              Como jogar
            </h2>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
              <li>A cada rodada chegam novos robôs com 1 a N componentes defeituosos.</li>
              <li>Clique em um robô da oficina para levá-lo à bancada.</li>
              <li>Digite o código do componente no topo da pilha e pressione Enter.</li>
              <li>Código errado adiciona segundos de penalidade ao seu tempo.</li>
              <li>Se a oficina passar do limite de robôs, o turno termina.</li>
            </ol>
          </section>
          <TabelaRanking ranking={rankingDaSessao} limite={5} />
        </div>
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
