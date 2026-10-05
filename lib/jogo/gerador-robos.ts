import { Componente } from './componente'
import { type ModeloRobo, Prioridade, Robo } from './robo'

const MODELOS: readonly ModeloRobo[] = [
  { nome: 'Atlas-7', imagem: '/robos/atlas.png' },
  { nome: 'Vespa D2', imagem: '/robos/vespa.png' },
  { nome: 'Mecha K-9', imagem: '/robos/k9.png' },
  { nome: 'Titã MK2', imagem: '/robos/tita.png' },
]

const NOMES_COMPONENTES: readonly string[] = [
  'Servo do braço',
  'Núcleo de energia',
  'Sensor óptico',
  'Placa lógica',
  'Atuador hidráulico',
  'Bateria de íons',
  'Giroscópio',
  'Módulo de rede',
  'Chip de memória',
  'Motor da esteira',
  'Válvula de resfriamento',
  'Antena de sinal',
]

const CARACTERES_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Fábrica responsável por sortear (Random) os robôs que chegam à oficina. */
export class GeradorDeRobos {
  private proximoId = 1

  constructor(
    private readonly maxComponentes: number,
    private readonly tamanhoCodigo: number,
  ) {}

  gerar(rodada: number): Robo {
    const modelo = this.sortearDe(MODELOS)
    const robo = new Robo(this.proximoId++, modelo, this.sortearPrioridade(), rodada)

    const limite = Math.min(this.maxComponentes, 2 + Math.floor(rodada / 2))
    const quantidade = this.inteiroEntre(1, limite)
    for (let i = 0; i < quantidade; i++) {
      robo.adicionarComponenteDefeituoso(
        new Componente(
          this.sortearDe(NOMES_COMPONENTES),
          this.gerarCodigo(),
          this.inteiroEntre(5, 30),
        ),
      )
    }
    return robo
  }

  private sortearPrioridade(): Prioridade {
    const sorteio = Math.random()
    if (sorteio < 0.2) return Prioridade.EMERGENCIA
    if (sorteio < 0.7) return Prioridade.PADRAO
    return Prioridade.BAIXO_RISCO
  }

  private gerarCodigo(): string {
    let codigo = ''
    for (let i = 0; i < this.tamanhoCodigo; i++) {
      codigo += CARACTERES_CODIGO[Math.floor(Math.random() * CARACTERES_CODIGO.length)]
    }
    return codigo
  }

  private sortearDe<T>(opcoes: readonly T[]): T {
    return opcoes[Math.floor(Math.random() * opcoes.length)]
  }

  private inteiroEntre(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1))
  }
}
