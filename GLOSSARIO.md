# Glossário — Marketplace de NFTs

## Contexto 1: Catálogo → src/catalogo/
O colecionador descobre e avalia NFTs antes de decidir comprar.

| Termo | Significado | Origem no README |
|---|---|---|
| NFT | Item colecionável exibido com galeria, informações e valor | §3 "Detalhes do NFT" |
| Edição | Cada unidade ou série limitada de um NFT, com sua própria disponibilidade (pode estar esgotada mesmo que o NFT exista) | §3 "edição indisponível" |
| Favorito | NFT que o colecionador adicionou como favorito para rever depois | §3 "Favoritos devem persistir para o usuário autenticado" |

## Contexto 2: Compra → src/compra/
O colecionador decide, paga e recebe a confirmação.

| Termo | Significado | Origem no README |
|---|---|---|
| Carrinho | Lista dos NFTs, com a quantidade de cada um, que o colecionador separou para comprar | §3 "Carrinho de NFTs" |
| Cotação | Valores validados pela API (desconto, taxa de rede, total) usados para finalizar | §3 "A cotação da API é a referência para finalizar o pedido" |
| Pedido | Compra enviada, com estado pendente, confirmado ou recusado | §3 "pedido pendente, confirmado e recusado" |

## Palavra que muda de sentido: Preço
- **Catálogo:** valor exibido para descobrir o NFT. Pode mudar a qualquer momento (§7, evento `nft.updated`).
- **Compra:** valor congelado na cotação e depois no snapshot do recibo. Mudança exige nova confirmação (§3 "Mudanças devem exigir nova confirmação do usuário"; "alterações posteriores no catálogo não podem modificar seus valores").
