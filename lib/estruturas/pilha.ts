import { NoSimples } from './no'

/**
 * Pilha (LIFO) implementada com encadeamento simples.
 * O topo é o primeiro nó; empilhar e desempilhar são O(1).
 */
export class Pilha<T> {
  private topoNo: NoSimples<T> | null = null
  private quantidade = 0

  get tamanho(): number {
    return this.quantidade
  }

  estaVazia(): boolean {
    return this.topoNo === null
  }

  empilhar(valor: T): void {
    const novo = new NoSimples(valor)
    novo.proximo = this.topoNo
    this.topoNo = novo
    this.quantidade++
  }

  desempilhar(): T | null {
    if (!this.topoNo) return null
    const removido = this.topoNo
    this.topoNo = removido.proximo
    removido.proximo = null
    this.quantidade--
    return removido.valor
  }

  /** Consulta o topo sem remover. */
  espiar(): T | null {
    return this.topoNo ? this.topoNo.valor : null
  }

  /** Percorre do topo até a base, gerando um array para a interface. */
  mapear<U>(transformar: (valor: T, indice: number) => U): U[] {
    const resultado: U[] = []
    let atual = this.topoNo
    let indice = 0
    while (atual) {
      resultado.push(transformar(atual.valor, indice++))
      atual = atual.proximo
    }
    return resultado
  }
}
