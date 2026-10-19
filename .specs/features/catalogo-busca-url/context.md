# Busca e filtros do Catálogo no estado da URL Context

**Gathered:** 2026-10-19
**Spec:** `.specs/features/catalogo-busca-url/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Busca, filtros e página do Catálogo (`src/catalogo/`) compõem o estado da URL e sobrevivem a refresh e à navegação pelo histórico. Ordenação, falhas, respostas fora de ordem, Favoritos e detalhe do NFT ficam fora.

---

## Implementation Decisions

### Escopo e vocabulário

- Entram busca, filtros e página; ordenação fica fora (pergunta 1).
- "busca", "filtro", "categoria", "preço máximo", "página" e "paginação" são usados como nos cenários, sem editar o glossário (pergunta 2).

### Busca

- Aplicada ao confirmar (Enter ou botão), não a cada tecla (pergunta 4).
- Uma nova busca volta para a página 1 (pergunta 3).
- Encontra qualquer trecho do nome, sem diferenciar maiúsculas/minúsculas nem acentos (pergunta 8).

### Histórico e URL

- Cada mudança aplicada cria uma entrada no histórico (pergunta 4).
- Um valor inválido na URL é ignorado, o padrão é usado e a URL é corrigida sem nova entrada (pergunta 5).

### Cenários

- Critérios de URL, refresh e histórico acrescentados além dos 3 cenários (pergunta 6).
- Título do cenário 3 trocado só na spec; `cenarios-busca.md` não foi editado (pergunta 7).

### Agent's Discretion

Nenhuma.

### Declined / Undiscussed Gray Areas → Assumptions

- "Até 2 ETH" inclui 2 ETH; falhas, respostas fora de ordem e Favoritos ficam fora (premissas aceitas).

---

## Specific References

`cenarios-busca.md` (os 3 cenários do colecionador).

---

## Deferred Ideas

- Ordenação no estado da URL.
- Falhas da consulta e respostas fora de ordem (F3).
