import { expect, test } from '@playwright/test'
import { abrirCarrinho, configurarMock, pausarConsultaPeriodica, pedidosCriados } from './mock'

// Funcionalidade: Cotação desatualizada no Carrinho
// (docs/cotacao-desatualizada-no-carrinho-spec.md)

const INTERVALO_DA_CONSULTA_PERIODICA = 5000

test.describe('Cotação desatualizada no Carrinho', () => {
  test('Preço muda enquanto o Carrinho está aberto', async ({ page }) => {
    // Dado que o Carrinho do colecionador tem 2 unidades do NFT "Aurora #12" com Preço de 100,00 cada
    // E a taxa de rede é 5,00
    await abrirCarrinho(page, { carrinho: [{ nftId: 'aurora-12', quantidade: 2 }], taxaRede: '5.00' })
    const aurora = page.getByTestId('item-carrinho').filter({ hasText: 'Aurora #12' })
    await expect(aurora.getByTestId('quantidade')).toHaveText('2')
    await expect(aurora).toContainText('100,00 ETH')
    await expect(page.getByTestId('resumo-taxa-rede')).toHaveText('5,00 ETH')
    // E o resumo mostra subtotal de 200,00 e total de 205,00
    await expect(page.getByTestId('resumo-subtotal')).toHaveText('200,00 ETH')
    await expect(page.getByTestId('resumo-total')).toHaveText('205,00 ETH')

    // Quando o Preço do NFT "Aurora #12" muda para 120,00 com o Carrinho aberto
    await configurarMock(page, { nfts: { 'aurora-12': { preco: '120.00' } } })
    await page.clock.fastForward(INTERVALO_DA_CONSULTA_PERIODICA)

    // Então o colecionador é avisado de que o Preço do NFT "Aurora #12" mudou de 100,00 para 120,00
    await expect(page.getByTestId('avisos')).toContainText(
      'O Preço do NFT "Aurora #12" mudou de 100,00 ETH para 120,00 ETH.',
    )
    // E o resumo mostra subtotal de 240,00 e total de 245,00
    await expect(page.getByTestId('resumo-subtotal')).toHaveText('240,00 ETH')
    await expect(page.getByTestId('resumo-total')).toHaveText('245,00 ETH')
  })

  test('Confirmação impedida porque a taxa de rede mudou com o Preço igual', async ({ page }) => {
    // Dado que o colecionador aceitou uma Cotação com subtotal de 200,00, taxa de rede de 5,00 e total de 205,00
    // E o Carrinho do colecionador tem 2 unidades do NFT "Aurora #12" com Preço de 100,00 cada
    await abrirCarrinho(page, { carrinho: [{ nftId: 'aurora-12', quantidade: 2 }], taxaRede: '5.00' })
    await expect(page.getByTestId('resumo-subtotal')).toHaveText('200,00 ETH')
    await expect(page.getByTestId('resumo-taxa-rede')).toHaveText('5,00 ETH')
    await expect(page.getByTestId('resumo-total')).toHaveText('205,00 ETH')
    const aurora = page.getByTestId('item-carrinho').filter({ hasText: 'Aurora #12' })
    await expect(aurora.getByTestId('quantidade')).toHaveText('2')
    await expect(aurora).toContainText('100,00 ETH')

    // E a taxa de rede passou para 8,00 sem mudança no Preço
    await pausarConsultaPeriodica(page)
    await configurarMock(page, { taxaRede: '8.00' })

    // Quando o colecionador confirma a compra
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await page.clock.resume()

    // Então nenhum Pedido é criado
    await expect(page.getByTestId('confirmacao-impedida')).toContainText('nenhum Pedido foi criado')
    await expect(page.getByTestId('pedido-criado')).toHaveCount(0)
    expect(await pedidosCriados(page)).toHaveLength(0)
    // E o colecionador vê a nova Cotação com taxa de rede de 8,00 e total de 208,00
    await expect(page.getByTestId('resumo-taxa-rede')).toHaveText('8,00 ETH')
    await expect(page.getByTestId('resumo-total')).toHaveText('208,00 ETH')
    // E o colecionador precisa confirmar de novo
    await expect(page.getByRole('button', { name: 'Confirmar com os novos valores' })).toBeVisible()
    // E o Carrinho continua com as 2 unidades do NFT "Aurora #12"
    await expect(page.getByTestId('item-carrinho')).toHaveCount(1)
    await expect(aurora.getByTestId('quantidade')).toHaveText('2')
  })

  test('Edição esgotada descoberta na hora de confirmar', async ({ page }) => {
    // Dado que o Carrinho do colecionador tem 1 unidade do NFT "Aurora #12" com Preço de 100,00
    // E 1 unidade do NFT "Maré #3" com Preço de 50,00
    await abrirCarrinho(page, {
      carrinho: [
        { nftId: 'aurora-12', quantidade: 1 },
        { nftId: 'mare-3', quantidade: 1 },
      ],
    })
    const aurora = page.getByTestId('item-carrinho').filter({ hasText: 'Aurora #12' })
    const mare = page.getByTestId('item-carrinho').filter({ hasText: 'Maré #3' })
    await expect(aurora.getByTestId('quantidade')).toHaveText('1')
    await expect(aurora).toContainText('100,00 ETH')
    await expect(mare.getByTestId('quantidade')).toHaveText('1')
    await expect(mare).toContainText('50,00 ETH')

    // E a edição do NFT "Maré #3" esgotou depois que a Cotação foi aceita
    await pausarConsultaPeriodica(page)
    await configurarMock(page, { nfts: { 'mare-3': { disponivel: false } } })

    // Quando o colecionador confirma a compra
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await page.clock.resume()

    // Então nenhum Pedido é criado
    await expect(page.getByTestId('confirmacao-impedida')).toContainText('nenhum Pedido foi criado')
    await expect(page.getByTestId('pedido-criado')).toHaveCount(0)
    expect(await pedidosCriados(page)).toHaveLength(0)
    // E o colecionador é avisado de que a edição do NFT "Maré #3" está esgotada
    await expect(page.getByTestId('avisos')).toContainText('A edição do NFT "Maré #3" está esgotada.')
    // E o Carrinho continua com os 2 itens
    await expect(page.getByTestId('item-carrinho')).toHaveCount(2)
    await expect(aurora).toBeVisible()
    await expect(mare).toBeVisible()
  })
})
