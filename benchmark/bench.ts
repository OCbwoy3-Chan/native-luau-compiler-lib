import { Bench } from 'tinybench'

import { compileLuau, CompileOptions } from '../index.js'

const source = `
  local function add(a: number, b: number): number
      return a + b
  end
  print(add(10, 20))
`;

const b = new Bench()

b.add('O2 compilation', () => {
  const options: CompileOptions = {
    optimizationLevel: 2,
    debugLevel: 0,
    coverageLevel: 0
  };
  compileLuau(source, options);
})

b.add('O0 compilation', () => {
  const options: CompileOptions = {
    optimizationLevel: 0,
    debugLevel: 0,
    coverageLevel: 0
  };
  compileLuau(source, options);
})

b.add('O0 C2 D compilation', () => {
  const options: CompileOptions = {
    optimizationLevel: 0,
    debugLevel: 1,
    coverageLevel: 2
  };
  compileLuau(source, options);
})

await b.run()

console.table(b.table())
