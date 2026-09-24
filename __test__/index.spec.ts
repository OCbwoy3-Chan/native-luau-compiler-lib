import test from 'ava'

import { compileLuau } from '../index'

const source = `
  local function add(a: number, b: number): number
    return a + b
  end

  return add(10, 20)
`

test('compiles Luau source to bytecode', (t) => {
  const bytecode = compileLuau(source)

  t.true(Buffer.isBuffer(bytecode))
  t.true(bytecode.length > 0)
})

test('uses the documented default compiler options', (t) => {
  const defaultBytecode = compileLuau(source)
  const explicitDefaultBytecode = compileLuau(source, {
    optimizationLevel: 1,
    coverageLevel: 0,
    debugLevel: 1,
  })

  t.deepEqual(defaultBytecode, explicitDefaultBytecode)
})

test('accepts every supported compiler option level', (t) => {
  for (const level of [0, 1, 2]) {
    const bytecode = compileLuau(source, {
      optimizationLevel: level,
      coverageLevel: level,
      debugLevel: level,
    })

    t.true(bytecode.length > 0)
  }
})
