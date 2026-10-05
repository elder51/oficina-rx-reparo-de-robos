/**
 * Nó de lista duplamente encadeada: guarda o valor e ponteiros
 * para o nó anterior e para o próximo.
 */
export class NoDuplo<T> {
  public anterior: NoDuplo<T> | null = null
  public proximo: NoDuplo<T> | null = null

  constructor(public valor: T) {}
}

/**
 * Nó de encadeamento simples (usado pela Pilha e pela Fila):
 * guarda o valor e apenas o ponteiro para o próximo.
 */
export class NoSimples<T> {
  public proximo: NoSimples<T> | null = null

  constructor(public valor: T) {}
}
