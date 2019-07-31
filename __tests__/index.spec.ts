import { Cnpj } from '../src'

describe(Cnpj.isValid, () => {
  test('Com pontuação', () => expect(Cnpj.isValid('31.214.261/0001-38')).toBe(true))

  test('Sem pontuação', () => expect(Cnpj.isValid('31214261000138')).toBe(true))

  test('Dígito verificador inválido', () =>
    expect(Cnpj.isValid('31.214.261/0001-39')).toBe(false))
})

describe(Cnpj.from, () => {
  test('Possíveis assinaturas', () => {
    const formatted = Cnpj.from('31.214.261/0001-38')
    const stripped = Cnpj.from('31214261000138')
    const withoutDvs = Cnpj.from('31.214.261/0001')

    expect(formatted.equals(stripped) && formatted.equals(withoutDvs)).toBe(true)
  })
})

describe(Cnpj.random, () => {
  test('Gera cnpj válido', () => expect(Cnpj.isValid(Cnpj.random().format())).toBe(true))
})

describe(Cnpj, () => {
  test('strip', () =>
    expect(Cnpj.from('31.214.261/0001-38').strip()).toBe('31214261000138'))

  test('format', () =>
    expect(Cnpj.from('31214261000138').format()).toBe('31.214.261/0001-38'))

  test('equals', () => {
    const formatted = Cnpj.from('31.214.261/0001-38')
    const stripped = Cnpj.from('31214261000138')

    expect(formatted.equals(stripped)).toBe(true)
  })
})
