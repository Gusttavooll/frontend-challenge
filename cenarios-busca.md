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

  Cenário: Busca sem resultado mostra mensagem de Catálogo vazio
    Dado que o Catálogo tem 24 NFTs
    E nenhum deles tem "Dragão" no nome
    Quando o colecionador busca por "Dragão"
    Então o Catálogo mostra a mensagem "Nenhum NFT encontrado"
    E não mostra nenhum NFT nem paginação
