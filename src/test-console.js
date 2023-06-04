const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default;
const types = require('@babel/types')

const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx']
})

const fnNameArr = ['info', 'log', 'error', 'warn', 'debug']

traverse(ast, {
  CallExpression(path, state) {
    const { node } = path;
    const { callee } = node;
    if (
      types.isMemberExpression(callee)
      && callee.object.name === 'console'
      && fnNameArr.includes(callee.property.name)
    ) {
      const { line, column } = node.loc.start;
      node.arguments.unshift(types.stringLiteral(`we will rock you: ${line}, ${column}`))
    }
  }
})

const { code, map } = generate(ast)

console.log('[AST]:', code)