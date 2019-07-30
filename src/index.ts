type Brand<K, T> = K & { __brand: T }

export type CnpjString = Brand<string, 'CnpjString'>

const checkDigit = (numbers: string): number => {
  const n =
    11 -
    (Array.from(numbers)
      .reverse()
      .reduce((acc, n, i) => acc + Number.parseInt(n, 10) * (i + 2), 0) %
      11)

  return n > 9 ? 0 : n
}

const checkDigits = (cnpjBaseStripped: string): string => {
  const a = checkDigit(cnpjBaseStripped)

  return '' + a + checkDigit(cnpjBaseStripped + a)
}

const strip = (cnpj: string) => cnpj.replace(/[.-]/g, '')

const isValidStripped = (stripped: string): stripped is CnpjString =>
  !!stripped.match(/^\d{11}$/) &&
  stripped.slice(-2) === checkDigits(stripped.slice(0, -2))

const format = (s: string): CnpjString =>
  `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-${s.slice(9, 11)}` as CnpjString

/**
 * Random int in [0, max] (inclusive)
 */
const randInt = (max: number): number => Math.floor(Math.random() * (max + 1))

const choose = <T>(arr: T[]): T => arr[randInt(arr.length - 1)]

export class Cnpj {
  /**
   * Retorna `true` se o argumento é uma `string` com um cnpj válido
   *
   *
   * Com pontuação:
   * ```ts
   * Cnpj.isValid('453.178.287-91') // true
   * ```
   *
   * Sem pontuação:
   * ```ts
   * Cnpj.isValid('45317828791') // true
   * ```
   *
   * Dígito verificador inválido:
   * ```ts
   * Cnpj.isValid('45317828792') // false
   * ```
   */
  static isValid(cnpj: unknown): cnpj is CnpjString {
    if (typeof cnpj !== 'string') return false
    else return isValidStripped(strip(cnpj))
  }

  /**
   * Gera um objeto Cnpj
   *
   * Possíveis assinaturas:
   * ```ts
   * Cnpj.from('453.178.287-91') // Completo e pontuado
   * Cnpj.from('45317828791') // Completo e não pontuado
   * Cnpj.from('453.178.287') // Sem os dígitos verificadores
   * Cnpj.from('453.178.28', 'RJ') // Específicando a UF pela sigla
   * ```
   */
  static from(cnpj: string): Cnpj {
    if (typeof cnpj !== 'string') throw TypeError(`first argument must be string`)

    let stripped = strip(cnpj)

    if (!stripped.match(/^\d+$/)) {
      throw RangeError(`first argument must contain only numbers, '.' and '-'`)
    }

    // TODO
    if (stripped.length === 9) stripped += checkDigits(stripped)
    if (stripped.length === 11 && isValidStripped(stripped)) {
      return new Cnpj(format(stripped))
    }

    throw Error(`Invalid arguments`)
  }

  /**
   * Gera um Cnpj aleatório
   *
   * ```ts
   * Cnpj.random() // Cnpj { __cnpj: '453.178.287-91' }
   * Cnpj.random('RJ') // Cnpj { __cnpj: '453.178.287-91' }
   * ```
   */
  static random(): Cnpj {
    // TODO
    return Cnpj.from(Array.from(Array(8), () => randInt(9)).join(''))
  }

  private constructor(private readonly __cnpj: CnpjString) {}

  equals(other: Cnpj): boolean {
    return this.format() === other.format()
  }

  /**
   * ```ts
   * Cnpj.from('453.178.287-91').strip() // '45317828791'
   * ```
   */
  strip(): CnpjString {
    return strip(this.format()) as CnpjString
  }

  /**
   * ```ts
   * Cnpj.from('45317828791').format() // '453.178.287-91'
   * ```
   */
  format(): CnpjString {
    return this.__cnpj
  }
}
