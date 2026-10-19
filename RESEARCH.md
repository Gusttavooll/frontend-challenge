# Research — Preço e disponibilidade que mudam com o carrinho aberto

Domínio: marketplace de NFTs do Desafio Frontend.

Trechos do README usados como base:

- **T1 (§3, Carrinho):** "Refletir alterações de preço e disponibilidade recebidas enquanto o carrinho estiver aberto."
- **T2 (§3, Pagamento e confirmação):** "Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra. Mudanças devem exigir nova confirmação do usuário."
- **T3 (§7, Tempo real):** "1. Um NFT está no carrinho. 2. Seu preço ou disponibilidade muda durante a navegação. 3. A interface informa a alteração e atualiza o resumo. 4. O checkout impede a confirmação com uma cotação desatualizada."

## Quem sente a dor

O colecionador que está comprando. É uma pessoa que já entrou na sua conta (§3, Conta e sessão) no marketplace.

- Ele não compra necessariamente um NFT por vez. Pode juntar vários NFTs no carrinho, com uma quantidade para cada um, antes de fechar o pedido.
- Ele passa um tempo navegando com o carrinho aberto. Nesse tempo, o preço ou a disponibilidade de um NFT pode mudar sem que ele tenha feito nada (T1, T3).
- Ele não controla essas mudanças, e a decisão de comprar depende do valor que está vendo.
- Se ele acompanha o mercado de perto ou compra de forma casual: **o README não diz**.
- Se é a primeira compra dele ou não: **o README não diz**.

## Em que momento ela aparece

1. **Na hora de confirmar a compra — na minha avaliação, o momento que mais dói; o README não diz qual dói mais.** O colecionador já decidiu e vai pagar. Qualquer diferença entre o valor que ele viu e o valor cobrado pesa mais aqui: ele pode pagar um valor que não esperava ou tentar comprar uma edição que já acabou. Por isso o README exige que mudanças peçam uma nova confirmação antes de fechar (T2, T3 passo 4).
2. **Enquanto navega com o carrinho aberto.** O preço ou a disponibilidade muda e ele precisa ser avisado e ver o resumo atualizado. Sem isso, decide com informação velha (T1, T3 passos 2 e 3).

Se a dor também aparece em outros momentos, como ao voltar ao carrinho depois de olhar outros NFTs ou ao aplicar um cupom: **o README não diz**. O README cita o cupom como algo a ser conferido antes de confirmar (T2), mas não diz que a dor aparece no momento em que ele é aplicado.

## O que essa pessoa diria, com as próprias palavras

- **R1:** "Eu vi um valor no carrinho e, quando fui pagar, era outro." *(apoia-se em T3, passo 4: "O checkout impede a confirmação com uma cotação desatualizada.")*
- **R2:** "Ninguém me avisou que o preço tinha mudado enquanto eu estava no carrinho." *(apoia-se em T1 e em T3, passo 3: "A interface informa a alteração…")*
- **R3:** "Eu ia comprar aquela edição, mas ela tinha acabado e eu só descobri na hora de confirmar." *(apoia-se em T2: "Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra.")*
- **R4:** "Não quero pagar um valor que eu não vi: se mudou, me mostra e me pergunta de novo antes de fechar." *(apoia-se em T2: "Mudanças devem exigir nova confirmação do usuário.")*
- **R5:** "O resumo do carrinho estava com um total e o pagamento com outro." *(apoia-se em T3, passo 3: "…e atualiza o resumo." e em T2, que inclui cupom e taxas; e no README (§3, Carrinho): "Exibir subtotal, desconto, taxa de rede e total coerentes…". O total pode mudar mesmo que o preço do NFT continue igual.)*

## O que isso custa hoje

- **Dinheiro:** quanto, **o README não diz**. O risco é o colecionador pagar um valor diferente do que viu, seja por mudança de preço, de taxa ou de desconto. Por isso o README exige uma nova confirmação antes de fechar (T2).
- **Erro:** ele pode tentar fechar um pedido com uma edição que já não está disponível. O README (§6) cita "preço alterado ou edição esgotada durante a compra" como uma situação prevista e diz que a confirmação só pode acontecer com a cotação em dia (T3, passo 4). O erro que se quer evitar é confirmar uma compra com informação velha.
- **Tempo:** quanto tempo ele perde, **o README não diz**. Há só um indício: o README pede "Preservar os itens em falhas" (§3, Pagamento e confirmação), o que sugere que ter de montar o carrinho de novo seria um custo. Isso fica registrado como indício, não como fato.
- **Para o marketplace (reclamações, desistências, perda de confiança):** **o README não diz**.

## O que já foi tentado (se algo foi)

**O README não diz.** Ele não menciona nenhuma versão anterior do marketplace nem nenhuma tentativa de resolver o problema. Também não diz como o colecionador lida com isso hoje, por exemplo se confere o preço por conta própria ou se recarrega a página.

## Ligação com a semana 5

O `GLOSSARIO.md` divide o marketplace em contextos. Esta dor pertence ao **contexto Compra**: "O colecionador decide, paga e recebe a confirmação". Ela não pertence ao Catálogo, onde o colecionador só descobre e avalia NFTs.

Termos do glossário envolvidos:

- **Carrinho:** a lista dos NFTs, com a quantidade de cada um, que o colecionador separou para comprar. É onde ele está quando o preço ou a disponibilidade muda (T1).
- **Cotação:** os valores conferidos pelo marketplace (desconto, taxa de rede, total) que servem de referência para finalizar. Uma cotação desatualizada não pode ser confirmada (T3, passo 4).
- **Pedido:** a compra enviada, com estado pendente, confirmado ou recusado. A dor é chegar a um Pedido com valores diferentes dos que o colecionador viu e aceitou (R1, R4).
- **Preço:** é a palavra que muda de sentido entre os contextos, e é aí que mora o problema. No **Catálogo**, o preço é o valor exibido para descobrir o NFT e pode mudar a qualquer momento. Na **Compra**, o preço fica congelado na cotação e depois no recibo, e qualquer mudança exige nova confirmação. A dor acontece justamente na passagem de um sentido para o outro: o colecionador está na Compra, mas o preço do Catálogo continua mudando por baixo.

---

## Checklist de saída

- [x] **Não tem nenhuma palavra de solução técnica neste arquivo.** *(Feito. Conferi o texto procurando nomes de tecnologia e termos técnicos. A palavra "checkout" aparece só dentro da citação literal do README.)*
- [ ] **Uma pessoa que não conhece o projeto consegue ler e entender o problema.** *(Pendente. O texto foi escrito para isso, mas falta testar com alguém de fora do projeto.)*
- [ ] **A pessoa que sente a dor diria "é isso mesmo".** *(Pendente. As frases R1 a R5 foram escritas a partir do README e desta sessão, não ditas por um colecionador de verdade. Falta mostrar a um colecionador.)*
