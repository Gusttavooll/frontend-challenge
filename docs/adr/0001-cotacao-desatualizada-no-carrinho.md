# 1. Cotação desatualizada no Carrinho exige nova confirmação antes do Pedido

## Status

Proposta.

## Contexto

O colecionador, já com a conta aberta no marketplace, junta vários NFTs no **Carrinho**, com uma quantidade para cada um, e passa um tempo navegando antes de fechar a compra. Nesse tempo, o preço e a disponibilidade de um NFT podem mudar sem que ele tenha feito nada, e ele não controla essas mudanças.

O problema está na palavra **Preço**, que muda de sentido entre os contextos:

- No **Catálogo**, o Preço é o valor exibido e pode mudar a qualquer momento.
- Na **Compra**, o Preço fica congelado na **Cotação** e não pode mudar sem nova confirmação do colecionador.

O colecionador está na Compra, mas o Preço do Catálogo continua mudando por baixo. O risco é ele chegar a um **Pedido** com valores diferentes dos que viu e aceitou: pagar um valor que não esperava ou tentar comprar uma edição que já acabou. O total também pode mudar mesmo que o Preço do NFT continue igual, por causa da taxa de rede ou do desconto.

O README do desafio exige:

- **T1 (§3, Carrinho):** "Refletir alterações de preço e disponibilidade recebidas enquanto o carrinho estiver aberto."
- **T2 (§3, Pagamento e confirmação):** "Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra. Mudanças devem exigir nova confirmação do usuário."
- **T3 (§7, Tempo real):** a interface informa a alteração, atualiza o resumo, e a confirmação com uma Cotação desatualizada é impedida.
- **§3, Carrinho:** "Exibir subtotal, desconto, taxa de rede e total coerentes…"
- **§3, Pagamento e confirmação:** "Preservar os itens em falhas."
- **§6:** "preço alterado ou edição esgotada durante a compra" é uma situação prevista.

O momento que mais dói é a hora de confirmar a compra (avaliação própria; o README não diz qual momento dói mais). O segundo momento é enquanto o colecionador navega com o Carrinho aberto.

## Decisão

No contexto Compra:

1. Enquanto o Carrinho estiver aberto, as alterações de Preço e disponibilidade recebidas são refletidas: o colecionador é avisado e o resumo do Carrinho (subtotal, desconto, taxa de rede e total) é atualizado.
2. Antes de confirmar a compra, a Cotação é revalidada: Preço, disponibilidade, cupom e taxas.
3. Se a revalidação encontrar qualquer diferença, a Cotação é considerada desatualizada. A confirmação é impedida, os novos valores são mostrados e o colecionador precisa confirmar de novo.
4. O Pedido só é criado com os valores da Cotação que o colecionador viu e aceitou.
5. Quando a confirmação for impedida, os itens do Carrinho são preservados.

## Consequências

**Positivas**

- O colecionador não paga um valor que não viu (R1, R4).
- O colecionador é avisado das mudanças enquanto ainda está no Carrinho, e não só na hora de pagar (R2).
- Uma edição esgotada é detectada antes de o Pedido ser criado (R3).
- O resumo do Carrinho e o valor da confirmação ficam coerentes, inclusive quando só a taxa de rede ou o desconto mudam (R5).
- O sentido de Preço em Compra fica protegido: o valor congelado na Cotação não é trocado pelo valor do Catálogo sem o colecionador saber.

**Negativas e pontos em aberto**

- O colecionador pode precisar confirmar mais de uma vez se os valores mudarem durante a compra.
- O README não diz:
  - o que acontece com um item esgotado depois que o colecionador é avisado;
  - se a dor também aparece ao voltar ao Carrinho ou ao aplicar um cupom;
  - quanto custa hoje, em dinheiro ou em tempo, para o colecionador ou para o marketplace.
- As frases R1 a R5 ainda não foram validadas com um colecionador de verdade.
