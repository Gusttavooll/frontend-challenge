import axios from 'axios'
import type { Cotacao, CotacaoDesatualizada, Pedido, Sessao } from './tipos'

export const cliente = axios.create({ baseURL: '/api' })

export async function buscarSessao(): Promise<Sessao> {
  const { data } = await cliente.get<Sessao>('/sessao')
  return data
}

export async function buscarCotacao(): Promise<Cotacao> {
  const { data } = await cliente.get<Cotacao>('/carrinho/cotacao')
  return data
}

/** Envia a Cotação que o colecionador viu e aceitou; a API revalida antes de criar o Pedido. */
export async function criarPedido(cotacaoAceita: Cotacao): Promise<Pedido> {
  const { data } = await cliente.post<Pedido>('/pedidos', { cotacao: cotacaoAceita })
  return data
}

export function comoCotacaoDesatualizada(erro: unknown): CotacaoDesatualizada | null {
  if (axios.isAxiosError<CotacaoDesatualizada>(erro) && erro.response?.status === 409) {
    return erro.response.data
  }
  return null
}
