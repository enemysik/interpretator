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

export class Lexer {
  text: string;
  pos: number;
  currentChar: string;
  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }
  error() {
    throw new Error('Invalid character');
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
}

export class Interpreter {
  public lexer: Lexer
  public currentToken: Token;
  constructor(lexer: Lexer) {
    this.currentToken = null;
    this.lexer = lexer;
  }
  error() {
    throw new Error('Invalid syntax');
  }
  eat(tokenType: TokenType) {
    if (this.currentToken.type === tokenType)
      this.currentToken = this.lexer.getNextToken();
    else
    this.error();
  }
  term() {
    const token = this.currentToken;
    this.eat('Integer');
    return token.value;
  }
  expr() {
    let result = this.term() as number;
    while (['Minus', 'Plus'].indexOf(this.currentToken.type) !== -1) {
      const token = this.currentToken;
      if (token.type === 'Minus') {
        this.eat('Minus');
        result -= this.term() as number;
      } else if (token.type === 'Plus') {
        this.eat('Plus');
        result += this.term() as number;
      }
    }
    return result;
  }
}
function main() {
  const text = '54  -3';
  const lexer = new Lexer(text);
  const interpreter = new Interpreter(lexer);
  const result = interpreter.expr();
  console.log(result);
}
main();