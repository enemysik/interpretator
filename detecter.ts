/* eslint-disable require-jsdoc */
import {Lexer, TokensObject} from './lexer';
import {ChemicArrayToken, ChemicArrayVariableToken, VariableToken,
  FunctionToken} from './token';

export class Detecter {
  lexer: Lexer;
  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }
  * enumerateTokens() {
    const pos = this.lexer.pos;
    let token = this.lexer.getNextToken();
    while (token.type !== 'EOF') {
      token = this.lexer.getNextToken();
      yield token;
    }
    this.lexer.pos = pos;
  }
  enumVars() {
    const result: TokensObject = {};
    const pos = this.lexer.pos;
    let token = this.lexer.getNextToken();
    let nextToken = this.lexer.getNextToken();
    let nextNextToken = this.lexer.getNextToken();
    while (token.type !== 'EOF') {
      if (token.type === 'ID') {
        if (nextToken.type === 'ASSIGN') {
          if (nextNextToken instanceof ChemicArrayToken) {
            const tmp = new ChemicArrayVariableToken(token.type, token.value,
                nextNextToken.possibleValues, nextNextToken.editable);
            if (!result[token.value!]) {
              result[token.value!] = tmp;
            }
          } else {
            (token as VariableToken).isAssignable = true;
            if (!result[token.value!]) {
              result[token.value!] = token;
            }
          }
        } else {
          if (!(token instanceof FunctionToken)) {
            if (!result[token.value!]) {
              result[token.value!] = token;
            }
          }
        }
      }
      token = nextToken;
      nextToken = nextNextToken;
      nextNextToken = this.lexer.getNextToken();
    }
    this.lexer.pos = pos;
    return Object.values(result);
  }
}
