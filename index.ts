/* eslint-disable require-jsdoc */
import {Lexer} from './lexer';
import {Parser} from './parser';
import {Interpreter} from './interpreter';

function main() {
  // const text = '5 - - - + - (3 + 4) - +2';
  const text = `
  Арифметика="test;test2"
  test1 = 10e2
  C=5
  X=(10*C*(1+0,0012*(Tx-15)))
  F=3 * 5 + 3 <> 2 ^ 5 И 3 > 4
  `;
  const lexer = new Lexer(text);
  const parser = new Parser(lexer);
  const globalScope = {
    'D': 0.1,
    'A': 3,
    'B': 7,
    'Tx': 9,
    'if': function(condition: 0 | 1, trueResult: number,
        elseResult: number): number {
      return condition === 1 ? trueResult : elseResult;
    },
    'Если': function(condition: 0 | 1, trueResult: string,
        elseResult: string): string {
      return condition === 1 ? trueResult : elseResult;
    },
    'exp': function(x: number): number {
      return Math.exp(x);
    },
    'ln': function(x: number): number {
      return Math.log(x);
    },
    'sin': function(x: number): number {
      return Math.sin(x);
    },
    'cos': function(x: number): number {
      return Math.cos(x);
    },
    'tg': function(x: number): number {
      return Math.tan(x);
    },
    'ctg': function(x: number): number {
      return 1 / Math.tan(x);
    },
    'arcsin': function(x: number): number {
      return Math.asin(x);
    },
    'arccos': function(x: number): number {
      return Math.acos(x);
    },
    'arctg': function(x: number): number {
      return Math.atan(x);
    },
    'arcctg': function(x: number): number {
      return 1 / Math.atan(x); // TODO ???
    },
    'abs': function(x: number): number {
      return Math.abs(x);
    },
    'sqrt': function(x: number): number {
      return Math.sqrt(x);
    },
    'notzer': function(x: number): number {
      return x > 0 ? x : 0;
    },
    'Мтаблица': function(tableName: string, row: number, column: number) {
      console.log(tableName, row, column); // TODO implement
      return 0;
    },
    'INT': function(x: number) {
      return Math.trunc(x);
    },
    'FRAC': function(x: number) {
      return x % 1; // TODO accuracy
    },
    'ЧЗП': function(x: number) {
      console.log(x);
      return 0; // TODO implement
    },
    'Ошибка': function(text: string) {
      throw new Error(text);
    },
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
