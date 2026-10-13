'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useJogo } from '@/hooks/use-jogo'
import { DIFICULDADES, Jogo } from '@/lib/jogo/jogo'
import { rankingDaSessao } from '@/lib/jogo/ranking'
import { BancadaReparo } from './bancada-reparo'
import { EsteiraChegada } from './esteira-chegada'
import { ListaOficina } from './lista-oficina'
import { PainelStatus } from './painel-status'
import { RegistroEventos } from './registro-eventos'
import { TelaFinal } from './tela-final'
import { type ChaveDificuldade, TelaInicial } from './tela-inicial'

interface Partida {
  jogo: Jogo
  nome: string
  dificuldade: ChaveDificuldade
}

export function JogoOficina() {
  const [partida, setPartida] = useState<Partida | null>(null)
  const [confirmarAbandono, setConfirmarAbandono] = useState(false)
  const jogo = partida?.jogo ?? null
  useJogo(jogo)

  function iniciar(nome: string, dificuldade: ChaveDificuldade) {
    setPartida({
      nome,
      dificuldade,
      jogo: new Jogo(nome, DIFICULDADES[dificuldade], rankingDaSessao, Date.now()),
    })
  }

  if (!partida || !jogo) return <TelaInicial onIniciar={iniciar} />

  return (
    <main key={jogo.inicio} className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-6">
      <PainelStatus jogo={jogo} onAbandonar={() => setConfirmarAbandono(true)} />
      <div className="grid gap-4 min-[900px]:grid-cols-[1fr_360px] lg:grid-cols-[1fr_380px]">
        <div className="flex min-w-0 flex-col gap-4">
          <EsteiraChegada jogo={jogo} />
          <ListaOficina jogo={jogo} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <BancadaReparo jogo={jogo} />
          <RegistroEventos jogo={jogo} />
        </div>
      </div>

      {jogo.status !== 'jogando' && (
        <TelaFinal
          jogo={jogo}
          onJogarNovamente={() => iniciar(partida.nome, partida.dificuldade)}
          onMenu={() => setPartida(null)}
        />
      )}

      <AlertDialog open={confirmarAbandono} onOpenChange={setConfirmarAbandono}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <AlertTriangle aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Abandonar partida?</AlertDialogTitle>
            <AlertDialogDescription>
              O progresso desta partida será descartado e não será registrado no ranking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar jogando</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmarAbandono(false)
                setPartida(null)
              }}
            >
              Abandonar partida
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
