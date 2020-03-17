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
  X = if (3 < 5;
    0;
    1)
  `;
  const lexer = new Lexer(text);
  // for (const token of new Detecter(lexer).enumVars()) console.log(token);// return;
  // for (const token of new Detecter(lexer).enumerateTokens()) console.log(token); // return;
  // console.log(new Converter(lexer).convert()); return;
  const parser = new Parser(lexer);
  const globalScope = {
    'Аппарат': 'HI',
    'Термометр': 'HI',
    'Барометр': 'HI',
    'VN': 3,
    'V_n': 7,
    'Тизм': 9,
    'Po': 9,
    'Т4': 9,
    'Т3': 9,
    'V4': 9,
    'V3': 9,
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
