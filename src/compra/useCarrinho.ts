import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buscarCotacao, comoCotacaoDesatualizada, criarPedido } from './api'
import { compararCotacoes, type Aviso } from './comparar'
import type { Cotacao } from './tipos'

/** Intervalo da consulta periódica que mantém o Carrinho aberto atualizado. */
export const INTERVALO_ATUALIZACAO_MS = 5000

const CHAVE_COTACAO = ['carrinho', 'cotacao'] as const

export function useCarrinho() {
  const queryClient = useQueryClient()
  const cotacao = useQuery({
    queryKey: CHAVE_COTACAO,
    queryFn: buscarCotacao,
    refetchInterval: INTERVALO_ATUALIZACAO_MS,
  })

  // Toda Cotação nova (da consulta periódica ou da recusa ao confirmar) é comparada
  // com a anterior; cada diferença vira um aviso para o colecionador.
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const anterior = useRef<Cotacao | undefined>(undefined)
  useEffect(() => {
    const atual = cotacao.data
    if (!atual) return
    if (anterior.current && anterior.current !== atual) {
      const novos = compararCotacoes(anterior.current, atual)
      if (novos.length > 0) setAvisos((existentes) => [...existentes, ...novos])
    }
    anterior.current = atual
  }, [cotacao.data])

  const [confirmacaoImpedida, setConfirmacaoImpedida] = useState(false)
  const confirmacao = useMutation({
    mutationFn: criarPedido,
    onMutate: () => setConfirmacaoImpedida(false),
    onError: (erro) => {
      const desatualizada = comoCotacaoDesatualizada(erro)
      if (!desatualizada) return
      // Nenhum Pedido foi criado: mostra a nova Cotação e espera nova confirmação.
      // Os itens do Carrinho continuam os mesmos; só os valores mudam.
      queryClient.setQueryData(CHAVE_COTACAO, desatualizada.cotacao)
      setConfirmacaoImpedida(true)
    },
  })

  const erroInesperado =
    confirmacao.isError && !comoCotacaoDesatualizada(confirmacao.error) ? confirmacao.error : null

  return {
    cotacao,
    avisos,
    dispensarAviso: (id: string) => setAvisos((existentes) => existentes.filter((a) => a.id !== id)),
    /** Confirma a compra com os valores que o colecionador está vendo no resumo. */
    confirmar: () => {
      if (cotacao.data) confirmacao.mutate(cotacao.data)
    },
    confirmando: confirmacao.isPending,
    pedido: confirmacao.data ?? null,
    confirmacaoImpedida,
    erroInesperado,
  }
}
