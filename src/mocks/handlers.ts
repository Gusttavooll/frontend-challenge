import { http, HttpResponse } from 'msw'
import { iguais, multiplicar, percentual, somar, subtrair } from '../compra/eth'
import type { Cotacao, CotacaoDesatualizada, Pedido } from '../compra/tipos'
import { configurar, lerEstado, registrarPedido, resetar, type ConfiguracaoMock, type EstadoMock } from './estado'

function calcularCotacao(estado: EstadoMock): Cotacao {
  const itens = estado.carrinho.map(({ nftId, quantidade }) => {
    const nft = estado.nfts[nftId]
    return { nftId, nome: nft.nome, quantidade, preco: nft.preco, disponivel: nft.disponivel }
  })
  const subtotal = somar('0', ...itens.map((item) => multiplicar(item.preco, item.quantidade)))
  const desconto = estado.cupom ? percentual(subtotal, estado.cupom.percentual) : '0.00'
  return {
    itens,
    cupom: estado.cupom?.codigo ?? null,
    subtotal,
    desconto,
    taxaRede: estado.taxaRede,
    total: somar(subtrair(subtotal, desconto), estado.taxaRede),
  }
}

function mesmaCotacao(a: Cotacao, b: Cotacao): boolean {
  return (
    a.itens.length === b.itens.length &&
    a.itens.every((item, i) => {
      const outro = b.itens[i]
      return (
        item.nftId === outro.nftId &&
        item.quantidade === outro.quantidade &&
        item.disponivel === outro.disponivel &&
        iguais(item.preco, outro.preco)
      )
    }) &&
    a.cupom === b.cupom &&
    iguais(a.subtotal, b.subtotal) &&
    iguais(a.desconto, b.desconto) &&
    iguais(a.taxaRede, b.taxaRede) &&
    iguais(a.total, b.total)
  )
}

const api = [
  http.get('/api/sessao', () => HttpResponse.json({ usuario: lerEstado().usuario })),

  http.get('/api/carrinho/cotacao', () => HttpResponse.json(calcularCotacao(lerEstado()))),

  http.post('/api/pedidos', async ({ request }) => {
    const { cotacao: aceita } = (await request.json()) as { cotacao: Cotacao }
    const atual = calcularCotacao(lerEstado())

    if (!mesmaCotacao(aceita, atual) || atual.itens.some((item) => !item.disponivel)) {
      const corpo: CotacaoDesatualizada = { motivo: 'cotacao_desatualizada', cotacao: atual }
      return HttpResponse.json(corpo, { status: 409 })
    }

    const pedido: Pedido = { id: `PED-${lerEstado().pedidos.length + 1}`, estado: 'pendente', cotacao: aceita }
    registrarPedido(pedido)
    return HttpResponse.json(pedido, { status: 201 })
  }),
]

// Endpoints de controle, usados pelos testes para levar o mock a um estado conhecido.
const controle = [
  http.post('/__mock/reset', async ({ request }) => {
    const texto = await request.text()
    resetar(texto ? (JSON.parse(texto) as ConfiguracaoMock) : {})
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('/__mock/estado', async ({ request }) => {
    configurar((await request.json()) as ConfiguracaoMock)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/__mock/pedidos', () => HttpResponse.json(lerEstado().pedidos)),
]

export const handlers = [...api, ...controle]
