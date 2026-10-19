import type { Page } from '@playwright/test'
import type { ConfiguracaoMock } from '../src/mocks/estado'

// Controla o estado do mock pelos endpoints /__mock/*, que o MSW atende dentro da página.

async function chamar(page: Page, metodo: string, caminho: string, corpo?: unknown) {
  const status = await page.evaluate(
    async ({ metodo, caminho, corpo }) => {
      const resposta = await fetch(caminho, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
      })
      return resposta.status
    },
    { metodo, caminho, corpo },
  )
  if (status >= 400) throw new Error(`${metodo} ${caminho} respondeu ${status}`)
}

/** Abre o Carrinho a partir de um estado conhecido do mock. */
export async function abrirCarrinho(page: Page, configuracao: ConfiguracaoMock) {
  await page.clock.install()
  await page.goto('/')
  // O app só renderiza depois que o MSW está ativo.
  await page.getByRole('heading', { name: 'Carrinho' }).waitFor()
  await chamar(page, 'POST', '/__mock/reset', configuracao)
  await page.reload()
  await page.getByRole('heading', { name: 'Carrinho' }).waitFor()
}

export async function configurarMock(page: Page, configuracao: ConfiguracaoMock) {
  await chamar(page, 'PATCH', '/__mock/estado', configuracao)
}

export async function pedidosCriados(page: Page): Promise<unknown[]> {
  return page.evaluate(async () => (await fetch('/__mock/pedidos')).json())
}

/**
 * Pausa o relógio da página para que a consulta periódica não rode entre a mudança
 * no mock e o clique em confirmar: a mudança só é descoberta na confirmação.
 */
export async function pausarConsultaPeriodica(page: Page) {
  const agora = await page.evaluate(() => Date.now())
  await page.clock.pauseAt(agora + 1000)
}
