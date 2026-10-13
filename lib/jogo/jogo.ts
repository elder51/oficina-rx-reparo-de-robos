import { Fila } from '../estruturas/fila'
import { ListaDuplamenteEncadeada } from '../estruturas/lista-encadeada'
import { GeradorDeRobos } from './gerador-robos'
import { Oficina } from './oficina'
import { type EntradaRanking, type Ranking } from './ranking'
import { type ResultadoSubstituicao, type Robo, ROTULO_PRIORIDADE, Prioridade } from './robo'

export type StatusJogo = 'jogando' | 'vitoria' | 'derrota'
export type TipoEvento = 'chegada' | 'entrada' | 'sucesso' | 'erro' | 'consertado' | 'alerta'

export interface Evento {
  id: number
  tipo: TipoEvento
  mensagem: string
  instanteMs: number
}

export interface ConfiguracaoJogo {
  nome: string
  capacidade: number
  totalRodadas: number
  intervaloRodadaMs: number
  intervaloEsteiraMs: number
  minRobosPorRodada: number
  maxRobosPorRodada: number
  maxComponentes: number
  tamanhoCodigo: number
  penalidadeErroMs: number
}

export const DIFICULDADES: Record<'facil' | 'normal' | 'dificil', ConfiguracaoJogo> = {
  facil: {
    nome: 'Fácil',
    capacidade: 6,
    totalRodadas: 6,
    intervaloRodadaMs: 18000,
    intervaloEsteiraMs: 2500,
    minRobosPorRodada: 1,
    maxRobosPorRodada: 2,
    maxComponentes: 3,
    tamanhoCodigo: 3,
    penalidadeErroMs: 2000,
  },
  normal: {
    nome: 'Normal',
    capacidade: 5,
    totalRodadas: 8,
    intervaloRodadaMs: 18000,
    intervaloEsteiraMs: 2000,
    minRobosPorRodada: 1,
    maxRobosPorRodada: 3,
    maxComponentes: 4,
    tamanhoCodigo: 4,
    penalidadeErroMs: 3000,
  },
  dificil: {
    nome: 'Difícil',
    capacidade: 4,
    totalRodadas: 10,
    intervaloRodadaMs: 18000,
    intervaloEsteiraMs: 1500,
    minRobosPorRodada: 2,
    maxRobosPorRodada: 4,
    maxComponentes: 6,
    tamanhoCodigo: 5,
    penalidadeErroMs: 5000,
  },
}

const MAX_EVENTOS = 25
export const TEMPO_TRANSITO_MS = 4000

/**
 * Controla uma partida. Combina as três estruturas:
 * - Fila  `esteira`: robôs que chegaram e aguardam para entrar (FIFO);
 * - Lista `oficina`: robôs em atendimento, ordenados por prioridade;
 * - Pilha (dentro de cada Robo): componentes defeituosos a substituir.
 */
export class Jogo {
  readonly oficina: Oficina
  readonly esteira = new Fila<Robo>()
  private readonly eventos = new ListaDuplamenteEncadeada<Evento>()
  private readonly gerador: GeradorDeRobos

  private statusAtual: StatusJogo = 'jogando'
  private rodadaAtual = 0
  private transito: { robo: Robo; iniciouEmMs: number } | null = null
  private idSelecionado: number | null = null
  private consertados = 0
  private substituidos = 0
  private errosCometidos = 0
  private bonusRapidezAcumuladoMs = 0
  private proximoIdEvento = 1

  private readonly inicioMs: number
  private fimMs: number | null = null
  private ultimaRodadaMs = 0
  private ultimaEsteiraMs = 0
  private agoraMs: number

  private entradaRanking: EntradaRanking | null = null
  private ouvinte: (() => void) | null = null
  private versaoAtual = 0

  constructor(
    readonly jogador: string,
    readonly config: ConfiguracaoJogo,
    private readonly ranking: Ranking,
    agoraMs: number,
  ) {
    this.oficina = new Oficina(config.capacidade)
    this.gerador = new GeradorDeRobos(config.maxComponentes, config.tamanhoCodigo)
    this.inicioMs = agoraMs
    this.agoraMs = agoraMs
    this.registrarEvento('alerta', `Turno iniciado por ${jogador}. Boa sorte!`)
    this.iniciarRodada()
  }

  // ---------- Observador (para a interface reagir às mudanças) ----------

  inscrever(ouvinte: () => void): () => void {
    this.ouvinte = ouvinte
    return () => {
      if (this.ouvinte === ouvinte) this.ouvinte = null
    }
  }

  get versao(): number {
    return this.versaoAtual
  }

  private notificar(): void {
    this.versaoAtual++
    this.ouvinte?.()
  }

  // ---------- Leitura de estado ----------

  get inicio(): number {
    return this.inicioMs
  }
  get status(): StatusJogo {
    return this.statusAtual
  }
  get rodada(): number {
    return this.rodadaAtual
  }
  get robosConsertados(): number {
    return this.consertados
  }
  get componentesSubstituidos(): number {
    return this.substituidos
  }
  get erros(): number {
    return this.errosCometidos
  }
  get bonusRapidezMs(): number {
    return this.bonusRapidezAcumuladoMs
  }
  get resultadoNoRanking(): EntradaRanking | null {
    return this.entradaRanking
  }

  get roboEmTransito(): Robo | null {
    return this.transito?.robo ?? null
  }

  get roboSelecionado(): Robo | null {
    return this.idSelecionado === null ? null : this.oficina.buscarPorId(this.idSelecionado)
  }

  get tempoTotalMs(): number {
    const fim = this.fimMs ?? this.agoraMs
    return Math.max(
      0,
      fim -
        this.inicioMs +
        this.errosCometidos * this.config.penalidadeErroMs -
        this.bonusRapidezAcumuladoMs,
    )
  }

  get msAteProximaRodada(): number | null {
    if (this.rodadaAtual >= this.config.totalRodadas) return null
    return Math.max(0, this.config.intervaloRodadaMs - (this.agoraMs - this.ultimaRodadaMs))
  }

  mapearEventos<U>(transformar: (e: Evento, indice: number) => U): U[] {
    return this.eventos.mapear(transformar)
  }

  // ---------- Laço principal ----------

  tick(agoraMs: number): void {
    if (this.statusAtual !== 'jogando') return
    this.agoraMs = agoraMs

    if (
      this.rodadaAtual < this.config.totalRodadas &&
      agoraMs - this.ultimaRodadaMs >= this.config.intervaloRodadaMs
    ) {
      this.iniciarRodada()
    }

    if (this.transito && agoraMs - this.transito.iniciouEmMs >= TEMPO_TRANSITO_MS) {
      this.admitirRoboEmTransito()
    }

    if (
      this.transito === null &&
      !this.esteira.estaVazia() &&
      agoraMs - this.ultimaEsteiraMs >= this.config.intervaloEsteiraMs
    ) {
      this.iniciarTransito()
    }

    this.verificarFimDeJogo()
    this.notificar()
  }

  private iniciarRodada(): void {
    this.rodadaAtual++
    this.ultimaRodadaMs = this.agoraMs
    const quantidade =
      this.config.minRobosPorRodada +
      Math.floor(
        Math.random() * (this.config.maxRobosPorRodada - this.config.minRobosPorRodada + 1),
      )
    const quantidadeFinal =
      this.rodadaAtual <= 2 && Math.random() < 0.7 ? Math.max(1, quantidade - 1) : quantidade

    for (let i = 0; i < quantidadeFinal; i++) {
      const robo = this.gerador.gerar(this.rodadaAtual)
      this.esteira.enfileirar(robo)
      this.registrarEvento(
        'chegada',
        `${robo.rotulo} chegou na esteira (${ROTULO_PRIORIDADE[robo.prioridade]}, ${robo.totalComponentes} peça(s)).`,
      )
    }
  }

  private iniciarTransito(): void {
    const robo = this.esteira.desenfileirar()
    if (!robo) return
    this.ultimaEsteiraMs = this.agoraMs
    this.transito = { robo, iniciouEmMs: this.agoraMs }
  }

  private admitirRoboEmTransito(): void {
    const robo = this.transito?.robo
    if (!robo) return
    this.transito = null
    this.oficina.admitir(robo)
    this.registrarEvento(
      robo.prioridade === Prioridade.EMERGENCIA ? 'alerta' : 'entrada',
      `${robo.rotulo} entrou na oficina na posição ${this.oficina.posicaoDe(robo.id) + 1}.`,
    )
    if (this.idSelecionado === null) this.idSelecionado = robo.id
  }

  private verificarFimDeJogo(): void {
    if (this.oficina.excedeuCapacidade()) {
      this.registrarEvento('erro', 'Capacidade da oficina excedida! Turno encerrado.')
      this.encerrar('derrota')
      return
    }
    const todasRodadasGeradas = this.rodadaAtual >= this.config.totalRodadas
    if (
      todasRodadasGeradas &&
      this.esteira.estaVazia() &&
      this.transito === null &&
      this.oficina.estaVazia()
    ) {
      this.registrarEvento('consertado', 'Todos os robôs foram consertados!')
      this.encerrar('vitoria')
    }
  }

  private encerrar(status: StatusJogo): void {
    this.statusAtual = status
    this.fimMs = this.agoraMs
    this.entradaRanking = this.ranking.registrar({
      jogador: this.jogador,
      robosConsertados: this.consertados,
      componentesSubstituidos: this.substituidos,
      tempoTotalMs: this.tempoTotalMs,
      venceu: status === 'vitoria',
    })
  }

  // ---------- Ações do jogador ----------

  selecionarRobo(id: number): void {
    if (this.statusAtual !== 'jogando') return
    if (this.oficina.buscarPorId(id)) {
      this.idSelecionado = id
      this.notificar()
    }
  }

  substituirComponente(codigo: string): ResultadoSubstituicao | null {
    const robo = this.roboSelecionado
    if (!robo || this.statusAtual !== 'jogando') return null

    const resultado = robo.tentarSubstituir(codigo)
    if (resultado.tipo === 'codigo-incorreto') {
      this.errosCometidos++
      this.registrarEvento(
        'erro',
        `Código "${codigo.toUpperCase()}" incorreto para ${resultado.esperado.nome}. +${this.config.penalidadeErroMs / 1000}s de penalidade.`,
      )
    } else if (resultado.tipo === 'sucesso') {
      this.substituidos++
      this.registrarEvento('sucesso', `Componente "${resultado.componente.nome}" substituído em ${robo.rotulo}.`)
      if (resultado.roboConsertado) {
        this.consertados++
        this.oficina.liberar(robo.id)
        this.registrarEvento('consertado', `${robo.rotulo} 100% consertado e liberado!`)
        this.idSelecionado = this.oficina.proximoDaLista?.id ?? null
        this.concederBonusSeOficinaVazia()
      }
    }

    this.verificarFimDeJogo()
    this.notificar()
    return resultado
  }

  private concederBonusSeOficinaVazia(): void {
    if (
      this.rodadaAtual >= this.config.totalRodadas ||
      !this.oficina.estaVazia() ||
      !this.esteira.estaVazia() ||
      this.transito !== null
    ) {
      return
    }

    const bonus = Math.max(
      0,
      this.config.intervaloRodadaMs - (this.agoraMs - this.ultimaRodadaMs),
    )
    if (bonus === 0) return

    this.bonusRapidezAcumuladoMs += bonus
    this.registrarEvento(
      'sucesso',
      `Oficina liberada antes da próxima rodada: bônus de ${Math.ceil(bonus / 1000)} s descontado do tempo final.`,
    )
  }

  private registrarEvento(tipo: TipoEvento, mensagem: string): void {
    this.eventos.inserirNoInicio({
      id: this.proximoIdEvento++,
      tipo,
      mensagem,
      instanteMs: this.agoraMs - this.inicioMs,
    })
    if (this.eventos.tamanho > MAX_EVENTOS) this.eventos.removerUltimo()
  }
}
