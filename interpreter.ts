export type TokenType = 'EOF' | 'Integer' | 'Plus'
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
  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.currentToken = null;
  }
  error() {
    throw new Error('Error parsing input');
  }
  getNextToken() {
    const text = this.text;
    if (this.pos > text.length - 1)
      return new Token('EOF', null);

    const currentChar = text[this.pos];
    if (/\d/.test(currentChar)) {
      const token = new Token('Integer', Number(currentChar))
      this.pos++;
      return token;
    }

    if (/\+/.test(currentChar)) {
      const token = new Token('Plus', currentChar)
      this.pos++;
      return token;
    }
    this.error();
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
    this.eat('Plus');
    const right = this.currentToken;
    this.eat('Integer');
    const result = (left.value as number) + (right.value as number);
    return result;
  }
}
function main() {
  const text = '5+3';
  const interpreter = new Interpreter(text);
  const result = interpreter.expr();
  console.log(result);
}
main();