# REVIEW — Cotação desatualizada no Carrinho (contexto Compra)

## O que pedi na sessão de Plan
Numa sessão nova, dei só o conteúdo do RESEARCH.md, o nome do contexto (Compra) e os termos do glossário (Carrinho, Cotação, Pedido, Preço). Pedi uma ADR no formato Nygard e um documento enxuto com 5 critérios EARS (um de cada padrão) e 3 cenários BDD em Gherkin, com pelo menos 1 de erro ou limite. Proibi tecnologia nos critérios e código na sessão.

## O que o agente devolveu
Uma ADR com status "Proposta" e uma spec com os 5 padrões EARS e 3 cenários (caminho feliz, erro e limite). Os nomes "Aurora #12" e "Maré #3" e os valores (100,00, taxa 5,00, total 205,00) foram inventados por ele, e ele avisou disso. Conferi as contas: 2 × 100,00 + 5,00 = 205,00, e com a taxa em 8,00 o total é 208,00.

## O que rejeitei ou reescrevi, e por quê
1. **EARS 4 (cupom):** o agente escreveu "revalidar o desconto do cupom". Reescrevi para "recalcular o desconto do cupom e atualizar o total do resumo". Nenhuma frase R fala de cupom; a única ligação é indireta, pela R5 (total diferente do pagamento). Mantive o critério porque o padrão "Onde" precisa de uma feature opcional e o cupom é a única do README nesse fluxo, e registrei a origem como indireta.
2. **Cenário 2:** o Então dizia "o Carrinho continua com as 2 unidades", mas o Dado nunca dizia que eram 2. Acrescentei isso no Dado.
3. **Cenário 3:** o último Então dizia que o Carrinho continuava só com a "Aurora #12", o que sugeria que o item esgotado saía do Carrinho. O README só diz "Preservar os itens em falhas" e não decide o que fazer com o item esgotado. Troquei por "o Carrinho continua com os 2 itens".
4. **Origem de cada critério:** acrescentei a cada EARS e cada cenário a frase R do RESEARCH.md e a seção do README. Nos cenários ela ficou como comentário (#), para não quebrar o Gherkin.

## Decisões na sessão de Implement
O agente achou 3 pontos em que a spec não decide e perguntou. Escolhi sempre o mais simples:
- **Cupom:** só no mock, sem tela e sem teste, porque nenhum cenário BDD cobre cupom.
- **Cotação aceita:** são os valores que estão na tela quando o colecionador clica em Confirmar. Isso bate com o cenário 2.
- **Item esgotado:** o botão continua habilitado e a API recusa a cada tentativa. Não decidi a interface do item esgotado porque o README não diz. Botão desabilitado fica como melhoria futura.

## Para o revisor ver
- Nos cenários 2 e 3 os testes pausam o relógio (page.clock) entre a mudança no mock e o clique; sem isso a consulta periódica de 5 s poderia perceber a mudança antes e o teste ficaria instável.
- A verificação "nenhum Pedido é criado" lê o estado do mock (GET /__mock/pedidos), a única exceção à regra de testar só pela interface.
- Os critérios EARS 4 e a R5 ainda não foram validados com um colecionador de verdade.
