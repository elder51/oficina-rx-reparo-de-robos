import { Pilha } from '../estruturas/pilha'
import type { Componente } from './componente'

export enum Prioridade {
  BAIXO_RISCO = 1,
  PADRAO = 2,
  EMERGENCIA = 3,
}

export const ROTULO_PRIORIDADE: Record<Prioridade, string> = {
  [Prioridade.EMERGENCIA]: 'Emergência',
  [Prioridade.PADRAO]: 'Padrão',
  [Prioridade.BAIXO_RISCO]: 'Baixo risco',
}

export type EstadoRobo = 'pendente' | 'consertado'

export interface ModeloRobo {
  nome: string
  imagem: string
}

export type ResultadoSubstituicao =
  | { tipo: 'sucesso'; componente: Componente; roboConsertado: boolean }
  | { tipo: 'codigo-incorreto'; esperado: Componente }
  | { tipo: 'sem-componentes' }

/**
 * Robô danificado. Seus componentes defeituosos ficam em uma Pilha:
 * só é possível substituir o componente do topo.
 */
export class Robo {
  private readonly componentes = new Pilha<Componente>()
  private estadoAtual: EstadoRobo = 'pendente'
  private totalInicial = 0

  constructor(
    readonly id: number,
    readonly modelo: ModeloRobo,
    readonly prioridade: Prioridade,
    readonly chegouEmRodada: number,
  ) {}

  get estado(): EstadoRobo {
    return this.estadoAtual
  }

  get componentesRestantes(): number {
    return this.componentes.tamanho
  }

  get totalComponentes(): number {
    return this.totalInicial
  }

  get progresso(): number {
    if (this.totalInicial === 0) return 1
    return (this.totalInicial - this.componentes.tamanho) / this.totalInicial
  }

  get componenteAtual(): Componente | null {
    return this.componentes.espiar()
  }

  get rotulo(): string {
    return `${this.modelo.nome} #${String(this.id).padStart(3, '0')}`
  }

  adicionarComponenteDefeituoso(componente: Componente): void {
    this.componentes.empilhar(componente)
    this.totalInicial++
    this.estadoAtual = 'pendente'
  }

  tentarSubstituir(codigoDigitado: string): ResultadoSubstituicao {
    const topo = this.componentes.espiar()
    if (!topo) return { tipo: 'sem-componentes' }
    if (!topo.confereCodigo(codigoDigitado)) {
      return { tipo: 'codigo-incorreto', esperado: topo }
    }

    this.componentes.desempilhar()
    if (this.componentes.estaVazia()) this.estadoAtual = 'consertado'
    return {
      tipo: 'sucesso',
      componente: topo,
      roboConsertado: this.estadoAtual === 'consertado',
    }
  }

  /** Lista os componentes do topo para a base (apenas para exibição). */
  mapearComponentes<U>(transformar: (c: Componente, indice: number) => U): U[] {
    return this.componentes.mapear(transformar)
  }
}

/** Maior prioridade primeiro; empates mantêm a ordem de chegada. */
export function compararPorPrioridade(a: Robo, b: Robo): number {
  return b.prioridade - a.prioridade
}
