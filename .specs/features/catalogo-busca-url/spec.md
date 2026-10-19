# Busca e filtros do Catálogo no estado da URL Specification

Contexto: Catálogo → `src/catalogo/`. Termos conforme o glossário (`GLOSSARIO.md`).
Origem: `README.md`, §3, "Catálogo e detalhe". As frases citadas são:

- **F1:** "Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico."
- **F2:** "Filtros devem ser combináveis; mudança de filtro deve reiniciar a paginação."
- **F3:** "As consultas devem refletir os parâmetros enviados à API, com tratamento de resultados vazios, falhas e respostas fora de ordem."

Notação: os critérios usam as palavras-chave EARS (WHEN / IF / THEN / SHALL) exigidas pelo validador; o conteúdo segue em português.

## Problem Statement

O colecionador descobre NFTs no Catálogo combinando busca, filtros e paginação. Se esse estado não estiver na URL, um refresh ou o botão Voltar do navegador descarta o que ele montou e o obriga a refazer a busca. A feature garante que busca, filtros e página fazem parte do estado da URL e sobrevivem a refresh e à navegação pelo histórico (F1).

## Goals

- [ ] Os 3 cenários do colecionador (seção "Cenários do colecionador") passam como estão escritos.
- [ ] Após refresh, Voltar ou Avançar, o Catálogo mostra exatamente a mesma busca, os mesmos filtros, a mesma página e os mesmos NFTs que o estado da URL descreve.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Ordenação no estado da URL | Faz parte de F1, mas fica fora do nome desta feature; decidido com o colecionador (pergunta 1) |
| Falhas da consulta e respostas fora de ordem | Parte de F3 tratada em outra feature; aqui entra só o resultado vazio |
| Favoritos | Outra frase da mesma seção; outra feature |
| Detalhe do NFT (acesso direto, NFT inexistente, Edição indisponível, limite de quantidade) | Outra frase da mesma seção; outra feature |
| Atualização do Preço em tempo real (`nft.updated`) enquanto um filtro está aplicado | §7; outra feature |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Escopo de F1 | Busca, filtros e página entram; ordenação fica fora | O nome da feature cita busca e filtros; o cenário 2 exige página | y (pergunta 1) |
| Vocabulário fora do glossário | Usar "busca", "filtro", "categoria", "preço máximo", "página" e "paginação" como nos cenários, sem editar o glossário; "Preço" sempre no sentido do Catálogo | São as palavras dos cenários do colecionador e do README | y (pergunta 2) |
| Busca reinicia a paginação? | Sim, uma nova busca volta para a página 1, como uma mudança de filtro | Mesma regra de F2 aplicada à busca | y (pergunta 3) |
| Granularidade do histórico | Cada mudança aplicada (filtro, busca, página) cria uma entrada no histórico | Voltar desfaz uma mudança por vez | y (pergunta 4) |
| Momento em que a busca é aplicada | Ao confirmar (Enter ou botão), não a cada tecla | Evita uma entrada no histórico por caractere | y (pergunta 4) |
| Estado inválido na URL | Ignorar só o valor inválido, usar o padrão (página 1, sem aquele filtro) e corrigir a URL sem criar entrada no histórico | O colecionador nunca fica em um Catálogo quebrado por um link editado à mão | y (pergunta 5) |
| Critérios além dos cenários | Acrescentar critérios de URL, refresh e histórico | Os 3 cenários não cobrem o centro de F1 | y (pergunta 6) |
| Título do cenário 3 | Nesta spec: "Busca sem resultado mostra a mensagem 'Nenhum NFT encontrado'"; Dado/Quando/Então inalterados; `cenarios-busca.md` não foi editado | Quem fica vazio é o resultado, não o Catálogo | y (pergunta 7) |
| Correspondência da busca | Qualquer trecho do nome do NFT, sem diferenciar maiúsculas/minúsculas nem acentos | O cenário 3 busca "no nome" | y (pergunta 8) |
| "Custam até 2 ETH" | O preço máximo inclui o próprio valor (Preço ≤ 2 ETH) | Leitura natural de "até" | y (premissa) |
| Falhas, respostas fora de ordem e Favoritos | Fora do escopo | Outras partes de F3 e da seção | y (premissa) |

**Open questions:** none - all resolved or logged above.

---

## Cenários do colecionador (base da spec)

Escritos pelo colecionador em `cenarios-busca.md`. As linhas Dado/Quando/Então estão copiadas sem alteração. Única diferença: o título do cenário 3, trocado a pedido do colecionador.

```gherkin
# language: pt
Funcionalidade: Busca e filtros do Catálogo

  Cenário: Filtros combinados mostram só os NFTs que atendem aos dois
    Dado que o Catálogo tem 24 NFTs
    E 10 deles são da categoria "Arte"
    E 4 desses 10 custam até 2 ETH
    Quando o colecionador aplica o filtro de categoria "Arte"
    E aplica o filtro de preço máximo de 2 ETH
    Então o Catálogo mostra 4 NFTs

  Cenário: Mudar um filtro volta a paginação para a página 1
    Dado que o Catálogo tem 60 NFTs e mostra 12 por página
    E o filtro de categoria "Arte" está aplicado, com 30 NFTs
    E o colecionador está na página 3
    Quando ele aplica também o filtro de preço máximo de 2 ETH
    Então o Catálogo mostra a página 1 de 2
    E mostra 12 dos 18 NFTs que atendem aos dois filtros

  Cenário: Busca sem resultado mostra a mensagem 'Nenhum NFT encontrado'
    Dado que o Catálogo tem 24 NFTs
    E nenhum deles tem "Dragão" no nome
    Quando o colecionador busca por "Dragão"
    Então o Catálogo mostra a mensagem "Nenhum NFT encontrado"
    E não mostra nenhum NFT nem paginação
```

---

## User Stories

### P1: Filtros combinados e paginação ⭐ MVP

**User Story**: Como colecionador, quero combinar filtros e ver a paginação recomeçar quando mudo um filtro, para avaliar só os NFTs que me interessam.

**Why P1**: F2 é obrigatória e os cenários 1 e 2 são a base da spec.

**Acceptance Criteria**:
1. WHEN o colecionador aplica o filtro de categoria "Arte" e o filtro de preço máximo de 2 ETH THEN o Catálogo SHALL mostrar somente os NFTs que atendem aos dois filtros (cenário 1: 4 de 24) `[CATBUSCA-01]`
2. WHEN o filtro de preço máximo está aplicado THEN o Catálogo SHALL incluir os NFTs cujo Preço é igual ao preço máximo `[CATBUSCA-02]`
3. WHEN o colecionador muda um filtro estando em qualquer página THEN o Catálogo SHALL mostrar a página 1 do novo resultado (cenário 2: página 1 de 2, 12 dos 18 NFTs) `[CATBUSCA-03]`

**Independent Test**: Com as massas dos cenários 1 e 2, aplicar os filtros e conferir a contagem de NFTs, a página e o total de páginas.

---

### P1: Busca pelo nome ⭐ MVP

**User Story**: Como colecionador, quero buscar NFTs pelo nome e saber claramente quando nada foi encontrado.

**Why P1**: A busca faz parte de F1 e o cenário 3 é a base da spec; o resultado vazio faz parte de F3.

**Acceptance Criteria**:
1. WHEN o colecionador confirma uma busca THEN o Catálogo SHALL mostrar somente os NFTs cujo nome contém o texto buscado, sem diferenciar maiúsculas/minúsculas nem acentos `[CATBUSCA-04]`
2. WHEN o colecionador digita na busca sem confirmar THEN o Catálogo SHALL manter o resultado e o estado da URL inalterados `[CATBUSCA-05]`
3. WHEN o colecionador confirma uma nova busca estando em qualquer página THEN o Catálogo SHALL mostrar a página 1 do novo resultado `[CATBUSCA-06]`
4. IF nenhum NFT atende à busca e aos filtros THEN o Catálogo SHALL mostrar a mensagem "Nenhum NFT encontrado" e não mostrar nenhum NFT nem paginação (cenário 3) `[CATBUSCA-07]`

**Independent Test**: Com a massa do cenário 3, buscar "Dragão" e ver a mensagem sem NFTs nem paginação; buscar "dragao" em uma massa com "Dragão Azul" e ver o NFT.

---

### P1: Estado da URL, refresh e histórico ⭐ MVP

**User Story**: Como colecionador, quero que a busca, os filtros e a página fiquem na URL, para não perder o que montei ao recarregar ou ao usar Voltar e Avançar.

**Why P1**: É o centro de F1 e o nome da feature.

**Acceptance Criteria**:
1. WHEN o colecionador aplica uma mudança de busca, filtro ou página THEN o Catálogo SHALL refletir no estado da URL a busca, os filtros e a página resultantes `[CATBUSCA-08]`
2. WHEN o colecionador aplica uma mudança de busca, filtro ou página THEN o Catálogo SHALL criar exatamente uma entrada nova no histórico `[CATBUSCA-09]`
3. WHEN o colecionador recarrega a página THEN o Catálogo SHALL mostrar a mesma busca, os mesmos filtros, a mesma página e os mesmos NFTs de antes do refresh `[CATBUSCA-10]`
4. WHEN o colecionador usa Voltar no navegador THEN o Catálogo SHALL mostrar a busca, os filtros, a página e os NFTs da entrada anterior do histórico `[CATBUSCA-11]`
5. WHEN o colecionador usa Avançar no navegador após Voltar THEN o Catálogo SHALL mostrar a busca, os filtros, a página e os NFTs da entrada seguinte do histórico `[CATBUSCA-12]`
6. IF o estado da URL traz um valor inválido (página inexistente, preço máximo que não é número, categoria inexistente) THEN o Catálogo SHALL ignorar só esse valor, usar o padrão (página 1 ou sem aquele filtro) e corrigir a URL sem criar entrada no histórico `[CATBUSCA-13]`

**Independent Test**: Aplicar o estado do cenário 2, recarregar e conferir; usar Voltar e Avançar e conferir cada entrada; abrir uma URL com página 99 e ver a página 1 com a URL corrigida.

---

## Edge Cases

- IF a URL traz página além do total THEN o Catálogo SHALL mostrar a página 1 e corrigir a URL (coberto por CATBUSCA-13)
- IF a busca e os filtros não deixam nenhum NFT THEN o Catálogo SHALL mostrar "Nenhum NFT encontrado" (coberto por CATBUSCA-07)
- WHEN o resultado cabe em uma página THEN o Catálogo SHALL mostrar a página 1 de 1

Varredura das dimensões implícitas: validação de entrada → CATBUSCA-13; integridade de transição de estado → CATBUSCA-09/11/12; falhas, concorrência/ordem e dependência externa → fora do escopo (F3, outra feature); demais dimensões N/A para este escopo.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status | Origem (README §3) |
| -------------- | ----- | ----- | ------ | ------------------ |
| CATBUSCA-01 | P1: Filtros combinados e paginação | - | Pending | F2 "Filtros devem ser combináveis" · cenário 1 |
| CATBUSCA-02 | P1: Filtros combinados e paginação | - | Pending | F2 "Filtros devem ser combináveis" · cenário 1 ("até 2 ETH") |
| CATBUSCA-03 | P1: Filtros combinados e paginação | - | Pending | F2 "mudança de filtro deve reiniciar a paginação" · cenário 2 |
| CATBUSCA-04 | P1: Busca pelo nome | - | Pending | F1 "Busca … devem compor o estado da URL" · cenário 3 |
| CATBUSCA-05 | P1: Busca pelo nome | - | Pending | F1 "Busca … devem compor o estado da URL" |
| CATBUSCA-06 | P1: Busca pelo nome | - | Pending | F2 "mudança de filtro deve reiniciar a paginação" |
| CATBUSCA-07 | P1: Busca pelo nome | - | Pending | F3 "com tratamento de resultados vazios" · cenário 3 |
| CATBUSCA-08 | P1: Estado da URL, refresh e histórico | - | Pending | F1 "devem compor o estado da URL" |
| CATBUSCA-09 | P1: Estado da URL, refresh e histórico | - | Pending | F1 "sobreviver a … navegação pelo histórico" |
| CATBUSCA-10 | P1: Estado da URL, refresh e histórico | - | Pending | F1 "sobreviver a refresh" |
| CATBUSCA-11 | P1: Estado da URL, refresh e histórico | - | Pending | F1 "sobreviver a … navegação pelo histórico" |
| CATBUSCA-12 | P1: Estado da URL, refresh e histórico | - | Pending | F1 "sobreviver a … navegação pelo histórico" |
| CATBUSCA-13 | P1: Estado da URL, refresh e histórico | - | Pending | F1 "devem compor o estado da URL" |

**Coverage:** 13 total, 0 mapped to tasks, 13 unmapped ⚠️ (tasks ainda não criadas)

---

## Success Criteria

- [ ] Os 3 cenários do colecionador passam sem alteração nas linhas Dado/Quando/Então.
- [ ] Os 13 requisitos CATBUSCA têm um teste E2E que passa (README §9, item 1).
