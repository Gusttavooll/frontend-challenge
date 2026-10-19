# Proposal

## Why

O colecionador precisa encontrar NFTs no Catálogo combinando busca, filtros, ordenação e paginação, sem perder o que escolheu ao recarregar a página ou ao voltar e avançar no histórico. O README (§3, "Catálogo e detalhe") exige que esse estado viva na URL.

## What Changes

- Busca pelo nome do NFT, ignorando maiúsculas e acentos.
- Filtros de interface "categoria" e "preço máximo", combináveis entre si. O preço máximo inclui o valor exato e usa o Preço exibido do NFT.
- Mudança de filtro reinicia a paginação para a página 1.
- Busca, filtros, ordenação e página compõem o estado da URL e sobrevivem a refresh e à navegação pelo histórico.
- Catálogo vazio mostra a mensagem "Nenhum NFT encontrado", sem NFTs nem paginação.

Fora desta change: tratamento de falhas e de respostas fora de ordem, Preço por Edição, detalhe do NFT e Favoritos.

## Capabilities

### New Capabilities
- `catalogo/busca`: busca, filtros, ordenação e paginação do Catálogo, com estado na URL que sobrevive a refresh e ao histórico.

### Modified Capabilities
<!-- Nenhuma: o projeto ainda não tem specs. -->

## Impact

- Código novo em `src/catalogo/` (o projeto ainda não tem código-fonte).
- Rota do Catálogo e seus parâmetros de busca na URL.
- Contrato REST de listagem de NFTs com busca, filtros, ordenação e paginação (README §5, recurso "NFTs").
- Handlers e fixtures MSW para a listagem de NFTs.
- Testes E2E com Playwright (README §9, item 1).
