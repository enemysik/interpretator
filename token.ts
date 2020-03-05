/* eslint-disable require-jsdoc */
export type BinOpsType = 'Plus' | 'Minus' | 'Mul' |'INTEGER_DIV' |'FLOAT_DIV';
export type PascalKeywordsType = 'BEGIN' | 'END' | 'PROGRAM'| 'VAR'|
  'INTEGER_DIV'| 'INTEGER'| 'REAL' | 'PROCEDURE';
export type TokenType = BinOpsType | PascalKeywordsType | SyntaxType |
  'EOF' | 'ASSIGN' | 'SEMI' | 'DOT' | 'ID' | 'INTEGER_CONST' |'REAL_CONST';
export type SyntaxType ='COLON' | 'COMMA' | 'LParen' | 'RParen' | 'PIPE';
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
