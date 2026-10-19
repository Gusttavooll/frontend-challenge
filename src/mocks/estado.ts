import type { Pedido } from '../compra/tipos'

// Estado do "servidor" simulado pelo MSW. Fica no sessionStorage para sobreviver a
// um reload; cada contexto do Playwright começa com um sessionStorage vazio.

export interface NftMock {
  id: string
  nome: string
  preco: string
  disponivel: boolean
}

export interface ItemCarrinhoMock {
  nftId: string
  quantidade: number
}

export interface CupomMock {
  codigo: string
  /** Percentual inteiro aplicado sobre o subtotal. */
  percentual: number
}

export interface EstadoMock {
  usuario: { id: string; nome: string }
  nfts: Record<string, NftMock>
  carrinho: ItemCarrinhoMock[]
  taxaRede: string
  cupom: CupomMock | null
  pedidos: Pedido[]
}

export type ConfiguracaoMock = Partial<Pick<EstadoMock, 'carrinho' | 'taxaRede' | 'cupom'>> & {
  nfts?: Record<string, Partial<Omit<NftMock, 'id'>>>
}

const CHAVE = 'mock:estado'

export function estadoInicial(): EstadoMock {
  return {
    usuario: { id: 'colecionador-1', nome: 'Colecionador' },
    nfts: {
      'aurora-12': { id: 'aurora-12', nome: 'Aurora #12', preco: '100.00', disponivel: true },
      'mare-3': { id: 'mare-3', nome: 'Maré #3', preco: '50.00', disponivel: true },
    },
    carrinho: [{ nftId: 'aurora-12', quantidade: 2 }],
    taxaRede: '5.00',
    cupom: null,
    pedidos: [],
  }
}

export function lerEstado(): EstadoMock {
  const salvo = sessionStorage.getItem(CHAVE)
  return salvo ? (JSON.parse(salvo) as EstadoMock) : estadoInicial()
}

function salvarEstado(estado: EstadoMock): EstadoMock {
  sessionStorage.setItem(CHAVE, JSON.stringify(estado))
  return estado
}

/** Aplica uma configuração sobre o estado atual (Preço, disponibilidade, taxa, cupom, Carrinho). */
export function configurar(configuracao: ConfiguracaoMock, base: EstadoMock = lerEstado()): EstadoMock {
  const nfts = { ...base.nfts }
  for (const [id, mudancas] of Object.entries(configuracao.nfts ?? {})) {
    if (!nfts[id]) throw new Error(`NFT desconhecido no mock: ${id}`)
    nfts[id] = { ...nfts[id], ...mudancas }
  }
  return salvarEstado({
    ...base,
    nfts,
    carrinho: configuracao.carrinho ?? base.carrinho,
    taxaRede: configuracao.taxaRede ?? base.taxaRede,
    cupom: configuracao.cupom !== undefined ? configuracao.cupom : base.cupom,
  })
}

/** Volta ao estado conhecido das fixtures e, opcionalmente, aplica uma configuração. */
export function resetar(configuracao: ConfiguracaoMock = {}): EstadoMock {
  return configurar(configuracao, estadoInicial())
}

export function registrarPedido(pedido: Pedido): void {
  const estado = lerEstado()
  salvarEstado({ ...estado, pedidos: [...estado.pedidos, pedido] })
}
