/* eslint-disable require-jsdoc */
type BinOpsType = 'Plus' | 'Minus' | 'Mul' |'FLOAT_DIV';
type VariableType = 'REAL_CONST' | 'STRING_CONST' |
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
}
export class VariableToken extends Token {
  isAssignable = false;
}
export class FunctionToken extends Token { }

export class ChemicArrayToken extends Token {
  possibleValues: string[];
  editable: boolean;
  constructor(type: TokenType, value: ValueType, possibleValues: string[],
      editable: boolean) {
    super(type, value);
    this.possibleValues = possibleValues;
    this.editable = editable;
  }
}
export class ChemicArrayVariableToken extends ChemicArrayToken { }
