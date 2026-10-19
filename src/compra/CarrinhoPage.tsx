import { formatarEth, multiplicar } from './eth'
import { useCarrinho } from './useCarrinho'
import type { Cotacao } from './tipos'

export function CarrinhoPage() {
  const {
    cotacao,
    avisos,
    dispensarAviso,
    confirmar,
    confirmando,
    pedido,
    confirmacaoImpedida,
    erroInesperado,
  } = useCarrinho()

  if (cotacao.isPending) return <p className="text-slate-500">Carregando o Carrinho…</p>
  if (cotacao.isError) {
    return (
      <p role="alert" className="text-red-700">
        Não foi possível carregar o Carrinho.
      </p>
    )
  }

  const dados = cotacao.data

  return (
    <section aria-labelledby="titulo-carrinho" className="space-y-6">
      <h1 id="titulo-carrinho" className="text-2xl font-semibold">
        Carrinho
      </h1>

      {avisos.length > 0 && (
        <ul aria-label="Avisos" data-testid="avisos" className="space-y-2">
          {avisos.map((aviso) => (
            <li
              key={aviso.id}
              role="status"
              className="flex items-start justify-between gap-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900"
            >
              <span>{aviso.texto}</span>
              <button
                type="button"
                onClick={() => dispensarAviso(aviso.id)}
                className="text-sm text-amber-700 underline"
              >
                Dispensar
              </button>
            </li>
          ))}
        </ul>
      )}

      <ItensDoCarrinho cotacao={dados} />
      <Resumo cotacao={dados} />

      {confirmacaoImpedida && (
        <div
          role="alert"
          data-testid="confirmacao-impedida"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-900"
        >
          <p className="font-medium">A Cotação mudou e nenhum Pedido foi criado.</p>
          <p>Confira os novos valores no resumo e confirme de novo.</p>
        </div>
      )}

      {erroInesperado && (
        <p role="alert" className="text-red-700">
          Não foi possível confirmar a compra agora. Os itens do Carrinho foram mantidos.
        </p>
      )}

      {pedido ? (
        <p
          role="status"
          data-testid="pedido-criado"
          className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900"
        >
          Pedido {pedido.id} criado ({pedido.estado}) no total de {formatarEth(pedido.cotacao.total)}.
        </p>
      ) : (
        <button
          type="button"
          onClick={confirmar}
          disabled={confirmando}
          className="rounded-md bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {confirmando
            ? 'Confirmando…'
            : confirmacaoImpedida
              ? 'Confirmar com os novos valores'
              : 'Confirmar compra'}
        </button>
      )}
    </section>
  )
}

function ItensDoCarrinho({ cotacao }: { cotacao: Cotacao }) {
  return (
    <ul
      aria-label="Itens do Carrinho"
      className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white"
    >
      {cotacao.itens.map((item) => (
        <li
          key={item.nftId}
          data-testid="item-carrinho"
          className="flex items-center justify-between gap-4 px-4 py-3"
        >
          <div>
            <p className="font-medium">{item.nome}</p>
            <p className="text-sm text-slate-600">
              <span data-testid="quantidade">{item.quantidade}</span> × {formatarEth(item.preco)}
            </p>
            {!item.disponivel && <p className="text-sm font-medium text-red-700">Edição esgotada</p>}
          </div>
          <p className="tabular-nums">{formatarEth(multiplicar(item.preco, item.quantidade))}</p>
        </li>
      ))}
    </ul>
  )
}

function Resumo({ cotacao }: { cotacao: Cotacao }) {
  return (
    <dl aria-label="Resumo" className="space-y-1 rounded-md border border-slate-200 bg-white px-4 py-3">
      <Linha rotulo="Subtotal" valor={formatarEth(cotacao.subtotal)} testId="resumo-subtotal" />
      {cotacao.cupom !== null && (
        <Linha
          rotulo={`Desconto (${cotacao.cupom})`}
          valor={`− ${formatarEth(cotacao.desconto)}`}
          testId="resumo-desconto"
        />
      )}
      <Linha rotulo="Taxa de rede" valor={formatarEth(cotacao.taxaRede)} testId="resumo-taxa-rede" />
      <Linha rotulo="Total" valor={formatarEth(cotacao.total)} testId="resumo-total" destaque />
    </dl>
  )
}

function Linha({
  rotulo,
  valor,
  testId,
  destaque = false,
}: {
  rotulo: string
  valor: string
  testId: string
  destaque?: boolean
}) {
  return (
    <div className={destaque ? 'flex justify-between border-t border-slate-200 pt-2 font-semibold' : 'flex justify-between'}>
      <dt>{rotulo}</dt>
      <dd data-testid={testId} className="tabular-nums">
        {valor}
      </dd>
    </div>
  )
}
