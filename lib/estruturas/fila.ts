import { NoSimples } from './no'

/**
 * Fila (FIFO) implementada com encadeamento simples.
 * Entra pelo fim, sai pelo início; ambas as operações são O(1).
 */
export class Fila<T> {
  private inicio: NoSimples<T> | null = null
  private fim: NoSimples<T> | null = null
  private quantidade = 0

  get tamanho(): number {
    return this.quantidade
  }

  estaVazia(): boolean {
    return this.inicio === null
  }

  enfileirar(valor: T): void {
    const novo = new NoSimples(valor)
    if (this.fim) this.fim.proximo = novo
    else this.inicio = novo
    this.fim = novo
    this.quantidade++
  }

  desenfileirar(): T | null {
    if (!this.inicio) return null
    const removido = this.inicio
    this.inicio = removido.proximo
    if (!this.inicio) this.fim = null
    removido.proximo = null
    this.quantidade--
    return removido.valor
  }

  /** Consulta a frente da fila sem remover. */
  frente(): T | null {
    return this.inicio ? this.inicio.valor : null
  }

  /** Percorre do início ao fim, gerando um array para a interface. */
  mapear<U>(transformar: (valor: T, indice: number) => U): U[] {
    const resultado: U[] = []
    let atual = this.inicio
    let indice = 0
    while (atual) {
      resultado.push(transformar(atual.valor, indice++))
      atual = atual.proximo
    }
    return resultado
  }
}
