'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Jogo } from '@/lib/jogo/jogo'
import type { Robo } from '@/lib/jogo/robo'
import { cn } from '@/lib/utils'
import { BadgePrioridade } from './badge-prioridade'

type Feedback = { tipo: 'sucesso' | 'erro'; texto: string } | null

function PilhaVisual({ robo }: { robo: Robo }) {
  return (
    <ol className="flex flex-col gap-1.5" aria-label="Pilha de componentes, do topo para a base">
      {robo.mapearComponentes((componente, indice) => {
        const topo = indice === 0
        return (
          <li
            key={`${componente.codigoSubstituicao}-${indice}`}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-3 py-2',
              topo ? 'border-accent bg-accent/10' : 'bg-background/50 opacity-70',
            )}
          >
            <span className="w-10 shrink-0 font-mono text-[10px] uppercase text-muted-foreground">
              {topo ? 'topo' : indice === robo.componentesRestantes - 1 ? 'base' : ''}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{componente.nome}</p>
              <p className="text-[11px] text-muted-foreground">
                ~{componente.tempoEstimadoSeg}s estimados
              </p>
            </div>
            <code
              className={cn(
                'rounded-md px-2 py-1 font-mono text-sm font-bold tracking-widest',
                topo ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground',
              )}
            >
              {componente.codigoSubstituicao}
            </code>
          </li>
        )
      })}
    </ol>
  )
}

function FormularioReparo({ jogo, robo }: { jogo: Jogo; robo: Robo }) {
  const [codigo, setCodigo] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const atual = robo.componenteAtual

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo.trim()) return
    const resultado = jogo.substituirComponente(codigo)
    if (!resultado) return

    if (resultado.tipo === 'sucesso') {
      setFeedback({
        tipo: 'sucesso',
        texto: resultado.roboConsertado
          ? `${robo.rotulo} consertado!`
          : `Componente "${resultado.componente.nome}" substituído.`,
      })
      setCodigo('')
    } else if (resultado.tipo === 'codigo-incorreto') {
      setFeedback({ tipo: 'erro', texto: 'Código incorreto! Penalidade aplicada.' })
      setCodigo('')
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-2">
      <label htmlFor="codigo-substituicao" className="text-sm font-medium">
        Código para <span className="text-accent">{atual?.nome}</span>
      </label>
      <div className="flex gap-2">
        <input
          id="codigo-substituicao"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          maxLength={jogo.config.tamanhoCodigo}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          placeholder={'•'.repeat(jogo.config.tamanhoCodigo)}
          className="h-11 min-w-0 flex-1 rounded-lg border bg-input/40 px-3 font-mono text-lg uppercase tracking-[0.3em] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" className="h-11">
          <Wrench aria-hidden="true" />
          Substituir
        </Button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'min-h-5 text-sm',
          feedback?.tipo === 'sucesso' && 'text-success',
          feedback?.tipo === 'erro' && 'text-destructive',
        )}
      >
        {feedback?.texto}
      </p>
    </form>
  )
}

export function BancadaReparo({ jogo }: { jogo: Jogo }) {
  const robo = jogo.roboSelecionado

  return (
    <section aria-labelledby="titulo-bancada" className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="titulo-bancada" className="text-sm font-semibold">
          Bancada de reparo
        </h2>
        <span className="font-mono text-[11px] text-muted-foreground">Pilha · LIFO</span>
      </div>

      {!robo ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Selecione um robô da oficina para começar o reparo.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <Image
              src={robo.modelo.imagem}
              alt={`Robô modelo ${robo.modelo.nome}`}
              width={72}
              height={72}
              className="size-16 rounded-lg object-cover"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate font-semibold">{robo.rotulo}</p>
              <div className="flex items-center gap-2">
                <BadgePrioridade prioridade={robo.prioridade} />
                <span className="text-xs text-muted-foreground">
                  Estado: <span className="text-foreground">{robo.estado}</span>
                </span>
              </div>
            </div>
          </div>

          <FormularioReparo key={robo.id} jogo={jogo} robo={robo} />
          <PilhaVisual robo={robo} />
        </>
      )}
    </section>
  )
}
