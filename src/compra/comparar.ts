import { formatarEth, iguais } from './eth'
import type { Cotacao } from './tipos'

export interface Aviso {
  id: string
  texto: string
}

let sequencia = 0
const aviso = (texto: string): Aviso => ({ id: `aviso-${++sequencia}`, texto })

/** Diferenças de Preço, disponibilidade, cupom e taxas entre duas Cotações do mesmo Carrinho. */
export function compararCotacoes(antes: Cotacao, depois: Cotacao): Aviso[] {
  const avisos: Aviso[] = []

  for (const item of depois.itens) {
    const anterior = antes.itens.find((i) => i.nftId === item.nftId)
    if (!anterior) continue
    if (!iguais(anterior.preco, item.preco)) {
      avisos.push(
        aviso(
          `O Preço do NFT "${item.nome}" mudou de ${formatarEth(anterior.preco)} para ${formatarEth(item.preco)}.`,
        ),
      )
    }
    if (anterior.disponivel && !item.disponivel) {
      avisos.push(aviso(`A edição do NFT "${item.nome}" está esgotada.`))
    } else if (!anterior.disponivel && item.disponivel) {
      avisos.push(aviso(`A edição do NFT "${item.nome}" voltou a ficar disponível.`))
    }
  }

  if (!iguais(antes.taxaRede, depois.taxaRede)) {
    avisos.push(
      aviso(`A taxa de rede mudou de ${formatarEth(antes.taxaRede)} para ${formatarEth(depois.taxaRede)}.`),
    )
  }
  if (antes.cupom !== depois.cupom || !iguais(antes.desconto, depois.desconto)) {
    avisos.push(
      aviso(`O desconto mudou de ${formatarEth(antes.desconto)} para ${formatarEth(depois.desconto)}.`),
    )
  }

  return avisos
}
