# Tasks

Pré-requisito: o projeto ainda não tem código-fonte. Esta change assume que o scaffold da stack obrigatória (README §2: React, TypeScript, TanStack Router, TanStack Query, Axios, MSW, Playwright) já existe antes do grupo 1.

## 1. Contrato e mocks da listagem de NFTs

- [ ] 1.1 Definir em `src/catalogo/` o tipo dos parâmetros do Catálogo (busca, categoria, preço máximo, ordenação, página) e o contrato REST de listagem de NFTs, com Preço como string decimal em ETH; verificar com a checagem de tipos e documentar o contrato junto aos demais contratos REST (README §12)
- [ ] 1.2 Criar fixtures MSW determinísticas para os três cenários do usuário (24 NFTs com 10 de "Arte" e 4 deles até 2 ETH, incluindo ao menos um de exatamente 2 ETH; 60 NFTs com 30 de "Arte" e 18 deles até 2 ETH; nenhum NFT com "Dragão" no nome); verificar com testes unitários que contam os NFTs de cada fixture
- [ ] 1.3 Implementar o handler MSW de listagem: busca só no nome, ignorando maiúsculas e acentos; categoria; preço máximo com comparação decimal menor ou igual; ordenação; paginação de 12 por página; verificar com testes unitários do handler, incluindo "dragao" encontrando "Dragão" e o NFT de exatamente 2 ETH incluído

## 2. Estado do Catálogo na URL

- [ ] 2.1 Declarar busca, categoria, preço máximo, ordenação e página como parâmetros de busca validados na rota do Catálogo, com valores padrão; verificar que um parâmetro inválido na URL cai no padrão, com teste unitário de validação
- [ ] 2.2 Fazer cada mudança de busca, filtro, ordenação ou página gerar uma entrada no histórico, e toda mudança de filtro voltar para a página 1; verificar com o teste E2E do cenário "Mudar um filtro volta a paginação para a página 1"
- [ ] 2.3 Buscar a listagem pela API com a chave da consulta derivada dos parâmetros da URL; verificar que o refresh e o histórico restauram o resultado, com os testes E2E dos cenários de refresh e de voltar/avançar no histórico (acréscimos do agente)

## 3. Interface do Catálogo

- [ ] 3.1 Ligar os controles de busca, filtro de categoria, filtro de preço máximo, ordenação e paginação ao estado da URL; verificar com os testes E2E dos cenários "Filtros combinados mostram só os NFTs que atendem aos dois" e "Ordenação por Preço é aplicada e mantida na URL"
- [ ] 3.2 Mostrar o estado de Catálogo vazio com a mensagem "Nenhum NFT encontrado", sem NFTs nem paginação; verificar com o teste E2E do cenário "Busca sem resultado mostra mensagem de Catálogo vazio"

## 4. Verificação integrada

- [ ] 4.1 Rodar todos os cenários desta spec com Playwright em Chromium, nos viewports desktop e mobile, com os mocks MSW; verificar que o relatório HTML não tem falhas
