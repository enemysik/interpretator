import {Lexer} from './lexer';
import {ChemicArrayToken} from './token';

/* eslint-disable require-jsdoc */
export class Converter {
  private lexer: Lexer;
  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }
  convert() {
    let result = '';
    let token = this.lexer.getNextToken();
    while (token.type !== 'EOF') {
      if (token instanceof ChemicArrayToken) {
        result += '\'\'';
        token = this.lexer.getNextToken();
        continue;
      }
      switch (token.type) {
        case 'ID':
          const name = token.value as string;
          result += name.split(/\s+|\,|\./).join('_');
          break;
        case 'AND':
          result += ' && ';
          break;
        case 'OR':
          result += ' || ';
          break;
        case 'PIPE':
          result += ', ';
          break;
        case 'SEMI':
          result += ', ';
          break;
        case 'NOT_EQUAL':
          result += ' != ';
          break;
        default:
          result += token.value;
      }
      token = this.lexer.getNextToken();
    }
    return result;
  }
}
export default Converter;
