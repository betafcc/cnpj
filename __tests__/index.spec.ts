import { Cnpj } from '../src'

describe(Cnpj.isValid, () => {
  test('Com pontuação', () => expect(Cnpj.isValid('453.178.287-91')).toBe(true))

  test('Sem pontuação', () => expect(Cnpj.isValid('45317828791')).toBe(true))

  test('Dígito verificador inválido', () =>
    expect(Cnpj.isValid('45317828792')).toBe(false))
})

describe(Cnpj.from, () => {
  test('Possíveis assinaturas', () => {
    const formatted = Cnpj.from('453.178.287-91')
    const stripped = Cnpj.from('45317828791')
    const withoutDvs = Cnpj.from('453.178.287')

    expect(formatted.equals(stripped) && formatted.equals(withoutDvs)).toBe(true)
  })
})

describe(Cnpj.random, () => {
  test('Gera cnpj válido', () => expect(Cnpj.isValid(Cnpj.random().format())).toBe(true))
})

describe(Cnpj, () => {
  test('strip', () => expect(Cnpj.from('453.178.287-91').strip()).toBe('45317828791'))
  test('format', () => expect(Cnpj.from('45317828791').format()).toBe('453.178.287-91'))
  test('equals', () => {
    const formatted = Cnpj.from('453.178.287-91')
    const stripped = Cnpj.from('45317828791')

    expect(formatted.equals(stripped)).toBe(true)
  })
})
