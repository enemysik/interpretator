/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {Lexer} from './lexer';
import {Parser} from './parser';
import {Interpreter} from './interpreter';
import {Detecter} from './detecter';
import {Converter} from './converter';

function main() {
  // const text = '5 - - - + - (3 + 4) - +2';
  const text = `
  Test="Hello;One"
  Дата_испытания=Дата
  Xкон=ПОМЕТОДИКЕN(Хмасс; 1)
  `;
  const lexer = new Lexer(text);
  // for (const token of new Detecter(lexer).enumArrayVars()) console.log(token);// return;
  // for (const token of new Detecter(text).enumerateTokens()) console.log(token); return;
  // console.log(new Converter(lexer).convert()); return;
  const parser = new Parser(lexer);
  const globalScope = {
    'D': 0.1,
    'A': 3,
    'B': 7,
    'Tx': 9,
    'Хмасс': 9,
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
