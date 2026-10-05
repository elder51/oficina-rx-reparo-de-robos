import { ListaDuplamenteEncadeada } from '../estruturas/lista-encadeada'

export interface EntradaRanking {
  id: number
  jogador: string
  robosConsertados: number
  componentesSubstituidos: number
  tempoTotalMs: number
  venceu: boolean
}

/** Mais robôs consertados primeiro; empate decidido pelo menor tempo. */
function compararEntradas(a: EntradaRanking, b: EntradaRanking): number {
  if (a.robosConsertados !== b.robosConsertados) {
    return b.robosConsertados - a.robosConsertados
  }
  return a.tempoTotalMs - b.tempoTotalMs
}

/** Ranking de jogadores mantido em uma lista encadeada ordenada. */
export class Ranking {
  private readonly entradas = new ListaDuplamenteEncadeada<EntradaRanking>()
  private proximoId = 1

  get tamanho(): number {
    return this.entradas.tamanho
  }

  registrar(dados: Omit<EntradaRanking, 'id'>): EntradaRanking {
    const entrada = { ...dados, id: this.proximoId++ }
    this.entradas.inserirOrdenado(entrada, compararEntradas)
    return entrada
  }

  posicaoDe(id: number): number {
    return this.entradas.indiceDe((e) => e.id === id) + 1
  }

  mapear<U>(transformar: (entrada: EntradaRanking, indice: number) => U): U[] {
    return this.entradas.mapear(transformar)
  }

  /** Top N: percorre só os primeiros nós da lista já ordenada. */
  mapearTop<U>(limite: number, transformar: (entrada: EntradaRanking, indice: number) => U): U[] {
    return this.entradas.mapearPrimeiros(limite, transformar)
  }
}

/** Ranking compartilhado entre as partidas da sessão. */
export const rankingDaSessao = new Ranking()
