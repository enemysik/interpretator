export type TokenType = 'EOF' | 'Integer' | 'Plus' | 'Minus' | 'Div' | 'Mul' | 'LParen' | 'RParen'
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

      if (/\*/.test(this.currentChar)) {
        this.advance()
        return new Token('Mul', '*')
      }

      if (/\//.test(this.currentChar)) {
        this.advance()
        return new Token('Div', '/')
      }

      if (/\(/.test(this.currentChar)) {
        this.advance()
        return new Token('LParen', '(')
      }

      if (/\)/.test(this.currentChar)) {
        this.advance()
        return new Token('RParen', ')')
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
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
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
  factor() {
    const token = this.currentToken;
    if (token.type === 'Integer') {
      this.eat('Integer');
      return token.value;
    } else if (token.type === 'LParen') {
      this.eat('LParen');
      const result = this.expr();
      this.eat('RParen');
      return result;
    }
  }
  term() {
    let result = this.factor() as number;
    while ((['Div', 'Mul'] as TokenType[]).indexOf(this.currentToken.type) !== -1) {
      const token = this.currentToken;
      if (token.type === 'Mul') {
        this.eat('Mul');
        result *= this.term() as number;
      } else if (token.type === 'Div') {
        this.eat('Div');
        result /= this.term() as number;
      }
    }
    return result;
  }
  expr() {
    let result = this.term() as number;
    while ((['Minus', 'Plus'] as TokenType[]).indexOf(this.currentToken.type) !== -1) {
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
  const text = '5 + 7 * (2 - 3)';
  const lexer = new Lexer(text);
  const interpreter = new Interpreter(lexer);
  const result = interpreter.expr();
  console.log(result);
}
main();