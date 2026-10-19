// Valores em ETH trafegam como strings decimais ("100.00"). Toda conta é feita
// em bigint com 18 casas (wei), sem passar por number, para não perder precisão.

const CASAS = 18
const ESCALA = 10n ** BigInt(CASAS)
const FORMATO = /^(-)?(\d+)(?:\.(\d+))?$/

export function paraWei(valor: string): bigint {
  const partes = FORMATO.exec(valor.trim())
  if (!partes) throw new Error(`Valor em ETH inválido: "${valor}"`)
  const [, sinal, inteiro, fracao = ''] = partes
  if (fracao.length > CASAS) throw new Error(`Valor em ETH com mais de ${CASAS} casas: "${valor}"`)
  const wei = BigInt(inteiro) * ESCALA + BigInt(fracao.padEnd(CASAS, '0'))
  return sinal ? -wei : wei
}

/** String decimal canônica, com no mínimo 2 casas: 100n * 10^18 → "100.00". */
export function deWei(wei: bigint): string {
  const negativo = wei < 0n
  const absoluto = negativo ? -wei : wei
  const inteiro = absoluto / ESCALA
  const fracao = (absoluto % ESCALA).toString().padStart(CASAS, '0').replace(/0+$/, '').padEnd(2, '0')
  return `${negativo ? '-' : ''}${inteiro}.${fracao}`
}

export function somar(...valores: string[]): string {
  return deWei(valores.reduce((total, valor) => total + paraWei(valor), 0n))
}

export function subtrair(a: string, b: string): string {
  return deWei(paraWei(a) - paraWei(b))
}

export function multiplicar(valor: string, quantidade: number): string {
  if (!Number.isSafeInteger(quantidade)) throw new Error(`Quantidade deve ser inteira: ${quantidade}`)
  return deWei(paraWei(valor) * BigInt(quantidade))
}

/** Aplica um percentual inteiro, truncando no wei: percentual("200.00", 10) → "20.00". */
export function percentual(valor: string, pct: number): string {
  if (!Number.isSafeInteger(pct)) throw new Error(`Percentual deve ser inteiro: ${pct}`)
  return deWei((paraWei(valor) * BigInt(pct)) / 100n)
}

export function iguais(a: string, b: string): boolean {
  return paraWei(a) === paraWei(b)
}

/** Formato de exibição pt-BR: "1234.5" → "1.234,50 ETH". */
export function formatarEth(valor: string): string {
  const [inteiro, fracao] = deWei(paraWei(valor)).split('.')
  const sinal = inteiro.startsWith('-') ? '-' : ''
  const milhares = inteiro.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${sinal}${milhares},${fracao} ETH`
}
