/** Peça defeituosa que precisa ser substituída em um robô. */
export class Componente {
  constructor(
    readonly nome: string,
    readonly codigoSubstituicao: string,
    readonly tempoEstimadoSeg: number,
  ) {}

  confereCodigo(codigoDigitado: string): boolean {
    return codigoDigitado.trim().toUpperCase() === this.codigoSubstituicao
  }
}
