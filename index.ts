/* eslint-disable require-jsdoc */
import {Lexer} from './lexer';
import {Parser} from './parser';
import {Interpreter} from './interpreter';

function main() {
  // const text = '5 - - - + - (3 + 4) - +2';
  const text = `
  Наличие_смолы и_пыли="test;test2"
  D1.контрольного раствора= 10e2
  C=if(0; 1, 3)
  X=(10*C*(1+0,0012*(Tx-15)))
  F= 3 <> C И F > 4
  {F=3 * 5 + 3 <> 2 ^ 5 И C > 4}
  `;
  const lexer = new Lexer(text);
  for (const token of lexer.enumerateNotAssignedVariables()) console.log(token); return;
  // for (const token of lexer.enumerateTokens()) console.log(token); return;
  const parser = new Parser(lexer);
  const globalScope = {
    'D': 0.1,
    'A': 3,
    'B': 7,
    'Tx': 9,
  };
  const interpreter = new Interpreter(parser, globalScope);
  interpreter.interpret();
  console.log(JSON.stringify(interpreter.GLOBAL_SCOPE));
}
try {
  main();
} catch (ex) {
  console.error(ex.message);
}
// let tmp = lexer.getNextToken();
// const tokens = [tmp];
// do {
//   tmp = lexer.getNextToken();
//   tokens.push(tmp);
// } while (tmp.type !== 'EOF')
// for (let i = 0; i < tokens.length; i++) {
//   if (tokens[i].type === 'ASSIGN') {
//     console.log(tokens[i - 1].value);
//   }
// }
// for (let i = 0; i < tokens.length; i++) {
//   if (tokens[i].type === 'ID') {
//     console.log(tokens[i].value);
//   }
// }
