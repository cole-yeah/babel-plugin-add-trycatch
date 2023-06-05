const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

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

const fnNameArr = ['info', 'log', 'error', 'warn', 'debug'].map(item => `console.${item}`)

traverse(ast, {
  CallExpression(path, state) {
    const { node } = path;
    const { callee, isNew } = node;
    if (isNew) return;
    const calleeName = generate(callee).code;
    console.log('xxxxx', calleeName)
    if (fnNameArr.includes(calleeName)) {
      const { line, column } = node.loc.start;
      const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true;
      if (path.findParent(p => p.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]));
        path.skip();
      } else {
        path.insertBefore(newNode)
      }
    }
  }
})

const { code, map } = generate(ast)

console.log('[AST]:', code)