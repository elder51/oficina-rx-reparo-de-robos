'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import type { Jogo } from '@/lib/jogo/jogo'

const INTERVALO_TICK_MS = 200

/** Conecta uma instância de Jogo ao React e mantém o relógio rodando. */
export function useJogo(jogo: Jogo | null): number {
  const inscrever = useCallback(
    (ouvinte: () => void) => (jogo ? jogo.inscrever(ouvinte) : () => {}),
    [jogo],
  )
  const versao = useSyncExternalStore(
    inscrever,
    () => jogo?.versao ?? 0,
    () => 0,
  )

  useEffect(() => {
    if (!jogo) return
    const id = window.setInterval(() => jogo.tick(Date.now()), INTERVALO_TICK_MS)
    return () => window.clearInterval(id)
  }, [jogo])

  return versao
}
