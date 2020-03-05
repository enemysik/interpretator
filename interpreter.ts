export type TokenType = 'EOF' | 'Integer' | 'Plus' | 'Minus'
export type ValueType = string | number;

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

export class Interpreter {
  text: string;
  pos: number;
  currentToken: Token;
  currentChar: string;
  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.currentToken = null;
    this.currentChar = this.text[this.pos];
  }
  error() {
    throw new Error('Error parsing input');
  }
  advance() {
    this.pos++;
    if (this.pos > this.text.length - 1)
      this.currentChar = null;
    else
      this.currentChar = this.text[this.pos];
  }
  skipWhiteSpace() {
    while (this.currentChar != null && this.currentChar === ' ')
      this.advance();
  }
  integer() {
    let result = '';
    while (this.currentChar != null && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return Number(result);
  }
  getNextToken() {
    while (this.currentChar != null) {
      if (this.currentChar === ' ')
        this.skipWhiteSpace();

      if (/\d/.test(this.currentChar))
        return new Token('Integer', this.integer())

      if (/\+/.test(this.currentChar)) {
        this.advance()
        return new Token('Plus', '+')
      }

      if (/\-/.test(this.currentChar)) {
        this.advance()
        return new Token('Minus', '-')
      }
      this.error();
    }
    return new Token('EOF', null);
  }
  eat(tokenType: TokenType) {
    if (this.currentToken.type === tokenType)
      this.currentToken = this.getNextToken();
    else
    this.error();
  }
  expr() {
    this.currentToken = this.getNextToken();
    const left = this.currentToken;
    this.eat('Integer');

    const op = this.currentToken;
    if (op.type === 'Minus')
      this.eat('Minus');
    else
      this.eat('Plus');

    const right = this.currentToken;
    this.eat('Integer');
    
    let result;
    if (op.type === 'Minus')
      result = (left.value as number) - (right.value as number);
    else
      result = (left.value as number) + (right.value as number);
    return result;
  }
}
function main() {
  const text = '54  -3';
  const interpreter = new Interpreter(text);
  const result = interpreter.expr();
  console.log(result);
}
main();