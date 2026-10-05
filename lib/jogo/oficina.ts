import { ListaDuplamenteEncadeada } from '../estruturas/lista-encadeada'
import { compararPorPrioridade, type Robo } from './robo'

/**
 * Oficina: guarda os robôs em atendimento numa lista duplamente
 * encadeada, ordenada por prioridade (emergências na cabeça).
 */
export class Oficina {
  private readonly robos = new ListaDuplamenteEncadeada<Robo>()

  constructor(readonly capacidade: number) {}

  get quantidade(): number {
    return this.robos.tamanho
  }

  estaVazia(): boolean {
    return this.robos.estaVazia()
  }

  /** A oficina "estoura" quando passa da capacidade máxima. */
  excedeuCapacidade(): boolean {
    return this.robos.tamanho > this.capacidade
  }

  admitir(robo: Robo): void {
    this.robos.inserirOrdenado(robo, compararPorPrioridade)
  }

  buscarPorId(id: number): Robo | null {
    return this.robos.buscar((robo) => robo.id === id)
  }

  posicaoDe(id: number): number {
    return this.robos.indiceDe((robo) => robo.id === id)
  }

  liberar(id: number): Robo | null {
    return this.robos.remover((robo) => robo.id === id)
  }

  get proximoDaLista(): Robo | null {
    return this.robos.primeiro
  }

  mapearRobos<U>(transformar: (robo: Robo, indice: number) => U): U[] {
    return this.robos.mapear(transformar)
  }
}
