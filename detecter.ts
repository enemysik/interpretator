/* eslint-disable require-jsdoc */
import {Lexer, TokensObject} from './lexer';
import {ChemicArrayToken, ChemicArrayVariableToken, VariableToken,
  FunctionToken} from './token';

export class Detecter extends Lexer {
  * enumerateTokens() {
    const pos = this.pos;
    let token = this.getNextToken();
    while (token.type !== 'EOF') {
      token = this.getNextToken();
      yield token;
    }
    this.pos = pos;
  }
  enumVars() {
    const result: TokensObject = {};
    const pos = this.pos;
    let token = this.getNextToken();
    let nextToken = this.getNextToken();
    let nextNextToken = this.getNextToken();
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
      nextNextToken = this.getNextToken();
    }
    this.pos = pos;
    return Object.values(result);
  }
}
