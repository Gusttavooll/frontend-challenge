# Diferenças: o que escrevi × o que o agente fez

1. **Acrescentou:** 3 requisitos e 4 cenários novos (refresh, voltar e avançar no histórico, ordenação por Preço) que eu não tinha escrito, todos marcados como "acréscimo do agente".
2. **Mudou:** no meu cenário 1, "custam menos de 2 ETH" virou "custam até 2 ETH", porque o filtro é "preço máximo" e a frase original se contradizia. Ele só mudou isso depois de eu autorizar.
3. **Perguntou:** fez 8 perguntas antes de criar a change, por exemplo se "categoria" e "preço máximo" deveriam entrar no glossário, já que não estavam lá.

## Comparação OpenSpec × TLC (busca e filtros do Catálogo)

**Quem perguntou mais:** empate, 8 perguntas cada (o OpenSpec ainda listou 3 sem resposta). As perguntas foram de tipos diferentes: o OpenSpec achou a contradição entre "menos de 2 ETH" e "preço máximo" no meu cenário 1, e o TLC achou que o título do cenário 3 dizia "Catálogo vazio" quando quem ficava vazio era o resultado da busca.

**Quem inventou mais:** o TLC, em volume. Acrescentou 10 critérios além dos 3 que vieram dos meus cenários, uma tabela de 11 premissas, casos de borda e um context.md, mas não escreveu cenários novos. O OpenSpec acrescentou 3 requisitos e 4 cenários (refresh, histórico e ordenação) e colocou a ordenação no escopo, que o TLC deixou de fora.

**Qual eu usaria neste projeto:** o TLC, porque a tabela de premissas e o "fora de escopo" deixam explícito o que foi decidido e o que o README não diz, e o enunciado cobra que nada entre sem origem. O ponto fraco é que os critérios extras ficam sem cenário, então eu teria de escrevê-los à mão para virarem teste.

**Detalhe de ambiente:** no Windows `python3` não existe, então o validador do TLC rodou com `python` (3.13.0).
