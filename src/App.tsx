import { useQuery } from '@tanstack/react-query'
import { buscarSessao } from './compra/api'
import { CarrinhoPage } from './compra/CarrinhoPage'

export function App() {
  const sessao = useQuery({ queryKey: ['sessao'], queryFn: buscarSessao })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Marketplace de NFTs</span>
        {sessao.data && <span>Olá, {sessao.data.usuario.nome}</span>}
      </header>
      <main>
        <CarrinhoPage />
      </main>
    </div>
  )
}
