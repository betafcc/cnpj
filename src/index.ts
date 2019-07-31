type Brand<K, T> = K & { __brand: T }

export type CnpjString = Brand<string, 'CnpjString'>

export const checkDigit = (numbers: string): number => {
  let i = 2

  const n =
    11 -
    (Array.from(numbers)
      .reverse()
      .reduce((acc, n) => {
        const b = acc + Number.parseInt(n, 10) * i
        i = i + 2 === 9 ? 2 : i + 1
        return b
      }, 0) %
      11)

  return n > 9 ? 0 : n
}

const checkDigits = (cnpjBaseStripped: string): string => {
  const a = checkDigit(cnpjBaseStripped)

  return '' + a + checkDigit(cnpjBaseStripped + a)
}

const strip = (cnpj: string) => cnpj.replace(/[.\/-]/g, '')

const isValidStripped = (stripped: string): stripped is CnpjString =>
  !!stripped.match(/^\d{14}$/) &&
  stripped.slice(-2) === checkDigits(stripped.slice(0, -2))

const format = (s: string): CnpjString =>
  `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}/${s.slice(8, 12)}-${s.slice(
    12,
    14
  )}` as CnpjString

/**
 * Random int in [0, max] (inclusive)
 */
const randInt = (max: number): number => Math.floor(Math.random() * (max + 1))

export class Cnpj {
  /**
   * Retorna `true` se o argumento é uma `string` com um cnpj válido
   *
   *
   * Com pontuação:
   * ```ts
   * Cnpj.isValid('31.214.261/0001-38') // true
   * ```
   *
   * Sem pontuação:
   * ```ts
   * Cnpj.isValid('31214261000138') // true
   * ```
   *
   * Dígito verificador inválido:
   * ```ts
   * Cnpj.isValid('31214261000139') // false
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
   * Cnpj.from('31.214.261/0001-38') // Completo e pontuado
   * Cnpj.from('31214261000138') // Completo e não pontuado
   * Cnpj.from('31.214.261/0001') // Sem os dígitos verificadores
   * ```
   */
  static from(cnpj: string): Cnpj {
    if (typeof cnpj !== 'string') throw TypeError(`first argument must be string`)

    let stripped = strip(cnpj)

    if (!stripped.match(/^\d+$/)) {
      throw RangeError(`first argument must contain only numbers, '.', '-' and '/'`)
    }

    if (stripped.length === 12) stripped += checkDigits(stripped)
    if (stripped.length === 14 && isValidStripped(stripped)) {
      return new Cnpj(format(stripped))
    }

    throw Error(`Invalid arguments`)
  }

  /**
   * Gera um Cnpj aleatório
   *
   * ```ts
   * Cnpj.random() // Cnpj { __cnpj: '31.214.261/0001-38' }
   * ```
   */
  static random(): Cnpj {
    return Cnpj.from(Array.from(Array(12), () => randInt(9)).join(''))
  }

  private constructor(private readonly __cnpj: CnpjString) {}

  equals(other: Cnpj): boolean {
    return this.format() === other.format()
  }

  /**
   * ```ts
   * Cnpj.from('31.214.261/0001-38').strip() // '31214261000138'
   * ```
   */
  strip(): CnpjString {
    return strip(this.format()) as CnpjString
  }

  /**
   * ```ts
   * Cnpj.from('31214261000138').format() // '31.214.261/0001-38'
   * ```
   */
  format(): CnpjString {
    return this.__cnpj
  }
}
