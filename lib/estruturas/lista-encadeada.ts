import { NoDuplo } from './no'

export type Predicado<T> = (valor: T) => boolean
/** Retorna < 0 se `a` deve vir antes de `b`, > 0 se depois e 0 se empatarem. */
export type Comparador<T> = (a: T, b: T) => number

/**
 * Lista duplamente encadeada implementada manualmente.
 * Mantém referências para a cabeça (primeiro nó) e a cauda (último nó).
 */
export class ListaDuplamenteEncadeada<T> {
  private cabeca: NoDuplo<T> | null = null
  private cauda: NoDuplo<T> | null = null
  private quantidade = 0

  get tamanho(): number {
    return this.quantidade
  }

  estaVazia(): boolean {
    return this.quantidade === 0
  }

  get primeiro(): T | null {
    return this.cabeca ? this.cabeca.valor : null
  }

  get ultimo(): T | null {
    return this.cauda ? this.cauda.valor : null
  }

  // ---------- Inserções ----------

  inserirNoInicio(valor: T): void {
    const novo = new NoDuplo(valor)
    if (!this.cabeca) {
      this.cabeca = this.cauda = novo
    } else {
      novo.proximo = this.cabeca
      this.cabeca.anterior = novo
      this.cabeca = novo
    }
    this.quantidade++
  }

  inserirNoFim(valor: T): void {
    const novo = new NoDuplo(valor)
    if (!this.cauda) {
      this.cabeca = this.cauda = novo
    } else {
      novo.anterior = this.cauda
      this.cauda.proximo = novo
      this.cauda = novo
    }
    this.quantidade++
  }

  /**
   * Insere mantendo a lista ordenada. O novo valor é colocado antes do
   * primeiro nó que deve vir depois dele; em caso de empate fica depois
   * dos existentes (inserção estável, respeita a ordem de chegada).
   */
  inserirOrdenado(valor: T, comparar: Comparador<T>): void {
    let atual = this.cabeca
    while (atual && comparar(valor, atual.valor) >= 0) {
      atual = atual.proximo
    }

    if (!atual) {
      this.inserirNoFim(valor)
      return
    }
    if (atual === this.cabeca) {
      this.inserirNoInicio(valor)
      return
    }

    const novo = new NoDuplo(valor)
    const anterior = atual.anterior as NoDuplo<T>
    novo.anterior = anterior
    novo.proximo = atual
    anterior.proximo = novo
    atual.anterior = novo
    this.quantidade++
  }

  // ---------- Remoções ----------

  private desligarNo(no: NoDuplo<T>): T {
    if (no.anterior) no.anterior.proximo = no.proximo
    else this.cabeca = no.proximo

    if (no.proximo) no.proximo.anterior = no.anterior
    else this.cauda = no.anterior

    no.anterior = no.proximo = null
    this.quantidade--
    return no.valor
  }

  removerPrimeiro(): T | null {
    return this.cabeca ? this.desligarNo(this.cabeca) : null
  }

  removerUltimo(): T | null {
    return this.cauda ? this.desligarNo(this.cauda) : null
  }

  /** Remove o primeiro elemento que satisfaz o predicado. */
  remover(predicado: Predicado<T>): T | null {
    const no = this.buscarNo(predicado)
    return no ? this.desligarNo(no) : null
  }

  limpar(): void {
    this.cabeca = this.cauda = null
    this.quantidade = 0
  }

  // ---------- Buscas e alterações ----------

  private buscarNo(predicado: Predicado<T>): NoDuplo<T> | null {
    let atual = this.cabeca
    while (atual) {
      if (predicado(atual.valor)) return atual
      atual = atual.proximo
    }
    return null
  }

  buscar(predicado: Predicado<T>): T | null {
    const no = this.buscarNo(predicado)
    return no ? no.valor : null
  }

  /** Posição (base 0) do primeiro elemento que satisfaz o predicado, ou -1. */
  indiceDe(predicado: Predicado<T>): number {
    let atual = this.cabeca
    let indice = 0
    while (atual) {
      if (predicado(atual.valor)) return indice
      atual = atual.proximo
      indice++
    }
    return -1
  }

  contem(predicado: Predicado<T>): boolean {
    return this.buscarNo(predicado) !== null
  }

  /** Substitui o valor do primeiro nó que satisfaz o predicado. */
  alterar(predicado: Predicado<T>, novoValor: T): boolean {
    const no = this.buscarNo(predicado)
    if (!no) return false
    no.valor = novoValor
    return true
  }

  contar(predicado: Predicado<T>): number {
    let total = 0
    let atual = this.cabeca
    while (atual) {
      if (predicado(atual.valor)) total++
      atual = atual.proximo
    }
    return total
  }

  // ---------- Ordenação ----------

  /**
   * Insertion sort sobre os próprios nós: cada nó é desligado da lista
   * original e religado na posição correta de uma nova sequência.
   */
  ordenar(comparar: Comparador<T>): void {
    let atual = this.cabeca
    this.limpar()
    while (atual) {
      const proximo = atual.proximo
      this.inserirOrdenado(atual.valor, comparar)
      atual = proximo
    }
  }

  // ---------- Percursos ----------

  percorrer(visitar: (valor: T, indice: number) => void): void {
    let atual = this.cabeca
    let indice = 0
    while (atual) {
      visitar(atual.valor, indice++)
      atual = atual.proximo
    }
  }

  percorrerDoFim(visitar: (valor: T, indice: number) => void): void {
    let atual = this.cauda
    let indice = this.quantidade - 1
    while (atual) {
      visitar(atual.valor, indice--)
      atual = atual.anterior
    }
  }

  /**
   * Percorre os nós e gera um array apenas para a renderização da
   * interface gráfica. O armazenamento continua sendo a lista.
   */
  mapear<U>(transformar: (valor: T, indice: number) => U): U[] {
    const resultado: U[] = []
    this.percorrer((valor, indice) => {
      resultado.push(transformar(valor, indice))
    })
    return resultado
  }

  /** Percorre apenas os `limite` primeiros nós, parando o laço mais cedo. */
  mapearPrimeiros<U>(limite: number, transformar: (valor: T, indice: number) => U): U[] {
    const resultado: U[] = []
    let atual = this.cabeca
    let indice = 0
    while (atual && indice < limite) {
      resultado.push(transformar(atual.valor, indice++))
      atual = atual.proximo
    }
    return resultado
  }
}
