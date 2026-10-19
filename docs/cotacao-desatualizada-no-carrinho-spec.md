# Cotação desatualizada no Carrinho

Contexto delimitado: **Compra**. Decisão registrada em [ADR 0001](adr/0001-cotacao-desatualizada-no-carrinho.md).

## Contexto

O colecionador junta NFTs no **Carrinho**, cada um com sua quantidade, e navega por um tempo antes de fechar a compra. Nesse tempo, o **Preço** e a disponibilidade de um NFT podem mudar sem que ele faça nada. No Catálogo, o Preço é o valor exibido e pode mudar a qualquer momento; na Compra, o Preço fica congelado na **Cotação** e não pode mudar sem nova confirmação do colecionador. O risco é chegar a um **Pedido** com valores diferentes dos que ele viu e aceitou, ou com uma edição que já acabou. O total também pode mudar com o Preço igual, por causa da taxa de rede ou do desconto.

## Decisão

- Com o Carrinho aberto, refletir as alterações de Preço e disponibilidade: avisar o colecionador e atualizar o resumo (subtotal, desconto, taxa de rede e total).
- Antes de confirmar, revalidar a Cotação: Preço, disponibilidade, cupom e taxas.
- Se algo mudou, impedir a confirmação, mostrar os novos valores e pedir nova confirmação.
- Criar o Pedido só com os valores da Cotação aceita pelo colecionador.
- Preservar os itens do Carrinho quando a confirmação for impedida.

## Fora de escopo

- O que fazer com um item esgotado depois do aviso (remover, manter, sugerir outro): o README não diz.
- O comportamento no momento de aplicar um cupom ou de voltar ao Carrinho depois de olhar outros NFTs: o README não diz.
- Como o Preço é exibido e muda no Catálogo.
- Medir custo em dinheiro ou tempo, reclamações ou desistências.
- Como as alterações chegam ao Carrinho (meio técnico de entrega).

## Critérios EARS

1. **Ubíqua:** O sistema deve criar o Pedido somente com os valores da Cotação aceita pelo colecionador.
   Origem: R4, R1; README §3 Pagamento e §3 Carrinho.
2. **Orientada a evento:** Quando o colecionador solicitar a confirmação da compra, o sistema deve revalidar Preço, disponibilidade, cupom e taxa de rede da Cotação.
   Origem: R3, R1; README §3 Pagamento.
3. **Orientada a estado:** Enquanto o Carrinho estiver aberto, o sistema deve avisar o colecionador de cada alteração de Preço ou disponibilidade recebida e atualizar subtotal, desconto, taxa de rede e total do resumo.
   Origem: R2, R5; README §3 Carrinho e §7.
4. **Feature opcional:** Onde houver cupom aplicado ao Carrinho, o sistema deve recalcular o desconto do cupom e atualizar o total do resumo antes de aceitar a confirmação da compra.
   Origem: R5 (indireta); README §3 Pagamento.
5. **Comportamento indesejado:** Se a Cotação estiver desatualizada no momento da confirmação, então o sistema deve impedir a criação do Pedido, mostrar os novos valores, pedir nova confirmação ao colecionador e preservar os itens do Carrinho.
   Origem: R1, R4, R3; README §7 passo 4 e §3 Pagamento.

## Cenários BDD

```gherkin
# language: pt
Funcionalidade: Cotação desatualizada no Carrinho

  Cenário: Preço muda enquanto o Carrinho está aberto
    Dado que o Carrinho do colecionador tem 2 unidades do NFT "Aurora #12" com Preço de 100,00 cada
    E a taxa de rede é 5,00
    E o resumo mostra subtotal de 200,00 e total de 205,00
    Quando o Preço do NFT "Aurora #12" muda para 120,00 com o Carrinho aberto
    Então o colecionador é avisado de que o Preço do NFT "Aurora #12" mudou de 100,00 para 120,00
    E o resumo mostra subtotal de 240,00 e total de 245,00
    # Origem: R2, R5; README §3 Carrinho e §7.

  Cenário: Confirmação impedida porque a taxa de rede mudou com o Preço igual
    Dado que o colecionador aceitou uma Cotação com subtotal de 200,00, taxa de rede de 5,00 e total de 205,00
    E o Carrinho do colecionador tem 2 unidades do NFT "Aurora #12" com Preço de 100,00 cada
    E a taxa de rede passou para 8,00 sem mudança no Preço
    Quando o colecionador confirma a compra
    Então nenhum Pedido é criado
    E o colecionador vê a nova Cotação com taxa de rede de 8,00 e total de 208,00
    E o colecionador precisa confirmar de novo
    E o Carrinho continua com as 2 unidades do NFT "Aurora #12"
    # Origem: R5, R1, R4; README §3 Carrinho, §3 Pagamento e §7.

  Cenário: Edição esgotada descoberta na hora de confirmar
    Dado que o Carrinho do colecionador tem 1 unidade do NFT "Aurora #12" com Preço de 100,00
    E 1 unidade do NFT "Maré #3" com Preço de 50,00
    E a edição do NFT "Maré #3" esgotou depois que a Cotação foi aceita
    Quando o colecionador confirma a compra
    Então nenhum Pedido é criado
    E o colecionador é avisado de que a edição do NFT "Maré #3" está esgotada
    E o Carrinho continua com os 2 itens
    # Origem: R3; README §6.
```
