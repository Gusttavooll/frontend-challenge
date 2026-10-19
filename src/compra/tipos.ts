export interface ItemCotacao {
  nftId: string
  nome: string
  quantidade: number
  /** Preço unitário congelado nesta Cotação (string decimal em ETH). */
  preco: string
  disponivel: boolean
}

/** Valores validados pela API para o Carrinho. É a referência para criar o Pedido. */
export interface Cotacao {
  itens: ItemCotacao[]
  cupom: string | null
  subtotal: string
  desconto: string
  taxaRede: string
  total: string
}

export type EstadoPedido = 'pendente' | 'confirmado' | 'recusado'

export interface Pedido {
  id: string
  estado: EstadoPedido
  cotacao: Cotacao
}

export interface Sessao {
  usuario: { id: string; nome: string }
}

/** Resposta 409 de POST /pedidos: a Cotação enviada não vale mais. */
export interface CotacaoDesatualizada {
  motivo: 'cotacao_desatualizada'
  cotacao: Cotacao
}
