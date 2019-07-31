# @betafcc/cnpj

Micro-utilitário para validação e geração de CNPJs

## Install

```sh
npm i @betafcc/cnpj
```

## Usage

```ts
import { Cnpj } from '@betafcc/cnpj'
```

ou

```ts
const { Cnpj } = require('@betafcc/cnpj')
```

### static **from**(`cnpj`: string): *Cnpj*

Gera um objeto Cnpj

Possíveis assinaturas:

```ts
Cnpj.from('31.214.261/0001-38') // Completo e pontuado
Cnpj.from('31214261000138') // Completo e não pontuado
Cnpj.from('31.214.261/0001') // Sem os dígitos verificadores
```

___

### static **isValid**(`cnpj`: unknown): *boolean*

Retorna `true` se o argumento é uma `string` com um cnpj válido

Com pontuação:

```ts
Cnpj.isValid('31.214.261/0001-38') // true
```

Sem pontuação:

```ts
Cnpj.isValid('31214261000138') // true
```

Dígito verificador inválido:

```ts
Cnpj.isValid('31.214.261/0001-39') // false
```

___

### static **random**(): *Cnpj*

Gera um Cnpj aleatório

```ts
Cnpj.random() // Cnpj { __cnpj: '31.214.261/0001-38' }
```

___

### **format**(): *CnpjString*

```ts
Cnpj.from('31214261000138').format() // '31.214.261/0001-38'
```

___

### **strip**(): *CnpjString*

```ts
Cnpj.from('31.214.261/0001-38').strip() // '31214261000138'
```

___

### **equals**(`other`: Cnpj): *boolean*

___
