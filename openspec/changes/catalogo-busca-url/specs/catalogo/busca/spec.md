# Spec Delta

## Purpose

Permite ao colecionador encontrar NFTs no Catálogo com busca, filtros, ordenação e paginação, mantendo esse estado na URL para que sobreviva a refresh e à navegação pelo histórico.

## ADDED Requirements

### Requirement: Filtros combinados
O Catálogo SHALL aplicar os filtros de categoria e de preço máximo em conjunto, mostrando só os NFTs que atendem a todos os filtros aplicados. O filtro de preço máximo SHALL incluir os NFTs cujo Preço exibido é menor ou igual ao valor escolhido. "Categoria" e "preço máximo" são termos de interface do filtro.

Origem: README §3, "Catálogo e detalhe": "Filtros devem ser combináveis; mudança de filtro deve reiniciar a paginação."

#### Scenario: Filtros combinados mostram só os NFTs que atendem aos dois
```gherkin
    Dado que o Catálogo tem 24 NFTs
    E 10 deles são da categoria "Arte"
    E 4 desses 10 custam até 2 ETH
    Quando o colecionador aplica o filtro de categoria "Arte"
    E aplica o filtro de preço máximo de 2 ETH
    Então o Catálogo mostra 4 NFTs
```

### Requirement: Mudança de filtro reinicia a paginação
Quando o colecionador aplica, altera ou remove um filtro, o Catálogo SHALL voltar para a página 1 do novo resultado.

Origem: README §3, "Catálogo e detalhe": "Filtros devem ser combináveis; mudança de filtro deve reiniciar a paginação."

#### Scenario: Mudar um filtro volta a paginação para a página 1
```gherkin
    Dado que o Catálogo tem 60 NFTs e mostra 12 por página
    E o filtro de categoria "Arte" está aplicado, com 30 NFTs
    E o colecionador está na página 3
    Quando ele aplica também o filtro de preço máximo de 2 ETH
    Então o Catálogo mostra a página 1 de 2
    E mostra 12 dos 18 NFTs que atendem aos dois filtros
```

### Requirement: Busca pelo nome e Catálogo vazio
A busca SHALL procurar o termo apenas no nome do NFT, ignorando maiúsculas e acentos. Quando nenhum NFT atende à busca e aos filtros, o Catálogo SHALL mostrar a mensagem "Nenhum NFT encontrado" e MUST NOT mostrar NFTs nem paginação.

Origem: README §3, "Catálogo e detalhe": "Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico." e "As consultas devem refletir os parâmetros enviados à API, com tratamento de resultados vazios, falhas e respostas fora de ordem." (nesta change, só resultados vazios).

#### Scenario: Busca sem resultado mostra mensagem de Catálogo vazio
```gherkin
    Dado que o Catálogo tem 24 NFTs
    E nenhum deles tem "Dragão" no nome
    Quando o colecionador busca por "Dragão"
    Então o Catálogo mostra a mensagem "Nenhum NFT encontrado"
    E não mostra nenhum NFT nem paginação
```

### Requirement: Estado do Catálogo sobrevive a refresh (acréscimo do agente)
Busca, filtros, ordenação e página SHALL compor o estado da URL. Ao recarregar a página, o Catálogo SHALL restaurar esse estado a partir da URL e mostrar o mesmo resultado.

Origem: README §3, "Catálogo e detalhe": "Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico."

#### Scenario: Refresh mantém busca, filtros, ordenação e página (acréscimo do agente)
```gherkin
    Dado que o colecionador buscou por "Lua"
    E aplicou o filtro de preço máximo de 2 ETH
    E escolheu a ordenação por Preço do menor para o maior
    E está na página 2
    Quando ele recarrega a página
    Então o Catálogo mostra a mesma busca, o mesmo filtro, a mesma ordenação e a página 2
    E mostra os mesmos NFTs de antes do refresh
```

### Requirement: Estado do Catálogo sobrevive à navegação pelo histórico (acréscimo do agente)
Cada mudança de busca, filtro, ordenação ou página SHALL gerar uma entrada no histórico do navegador. Voltar e avançar no histórico SHALL restaurar o estado do Catálogo correspondente àquela entrada.

Origem: README §3, "Catálogo e detalhe": "Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico."

#### Scenario: Voltar no histórico restaura o filtro anterior (acréscimo do agente)
```gherkin
    Dado que o colecionador aplicou o filtro de categoria "Arte"
    E depois aplicou o filtro de preço máximo de 2 ETH
    Quando ele volta uma vez no histórico do navegador
    Então o Catálogo mostra só o filtro de categoria "Arte" aplicado
    E mostra os NFTs que atendem a esse filtro
```

#### Scenario: Avançar no histórico reaplica o filtro desfeito (acréscimo do agente)
```gherkin
    Dado que o colecionador aplicou o filtro de categoria "Arte"
    E depois aplicou o filtro de preço máximo de 2 ETH
    E voltou uma vez no histórico do navegador
    Quando ele avança uma vez no histórico do navegador
    Então o Catálogo mostra os filtros de categoria "Arte" e de preço máximo de 2 ETH aplicados
    E mostra os NFTs que atendem aos dois filtros
```

### Requirement: Ordenação compõe o estado da URL (acréscimo do agente)
O Catálogo SHALL mostrar os NFTs na ordenação escolhida pelo colecionador, e essa ordenação SHALL fazer parte do estado da URL.

Origem: README §3, "Catálogo e detalhe": "Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico."

#### Scenario: Ordenação por Preço é aplicada e mantida na URL (acréscimo do agente)
```gherkin
    Dado que o Catálogo tem 24 NFTs
    Quando o colecionador escolhe a ordenação por Preço do menor para o maior
    Então o Catálogo mostra os NFTs do menor para o maior Preço exibido
    E a ordenação escolhida continua aplicada depois de recarregar a página
```
