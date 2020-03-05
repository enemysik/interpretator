/* eslint-disable require-jsdoc */
type BinOpsType = 'Plus' | 'Minus' | 'Mul' |'INTEGER_DIV' |'FLOAT_DIV';
type VariableType = 'INTEGER_CONST' |'REAL_CONST' | 'STRING_CONST' |
  'ARRAY_CONST';
type SyntaxType ='COLON' | 'COMMA' | 'LParen' | 'RParen' | 'PIPE' |
  'SEMI' | 'DOT' | 'ENTER' | 'DQuote';
export type TokenType = BinOpsType | SyntaxType | VariableType |
  'EOF' | 'ASSIGN' | 'ID';

export type ValueType = string | number | null;

export class Token {
  public type: TokenType;
  public value: ValueType;
  constructor(type: TokenType, value: ValueType) {
    this.type = type;
    this.value = value;
  }
  toString() {
    return `Token(${this.type}, ${this.value})`;
  }
}
