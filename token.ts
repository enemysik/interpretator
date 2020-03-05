/* eslint-disable require-jsdoc */
type BinOpsType = 'Plus' | 'Minus' | 'Mul' |'FLOAT_DIV';
type VariableType = 'INTEGER_CONST' |'REAL_CONST' | 'STRING_CONST' |
  'ARRAY_CONST';
type SyntaxType = 'LParen' | 'RParen' | 'PIPE' |
  'SEMI' | 'ENTER' | 'CARET';
type BooleanType = 'EQUAL' | 'NOT_EQUAL' | 'MORE' | 'LESS' |
  'MORE_OR_EQUAL' | 'LESS_OR_EQUAL' | 'OR' | 'AND';
export type TokenType = BinOpsType | SyntaxType | VariableType | BooleanType |
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
