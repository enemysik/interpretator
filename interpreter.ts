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
export abstract class AST { }
export class BinOp extends AST {
  public left: AST;
  public op: Token;
  public right: AST
  constructor(left: AST, op: Token, right: AST) {
    super()
    this.left = left;
    this.op = op;
    this.right = right;
  }
}
export class UnaryOp extends AST {
  token: Token;
  op: Token;
  expr: AST
  constructor(op: Token, expr: AST) {
    super();
    this.token = op;
    this.op = op;
    this.expr = expr;
  }
}
export class Num extends AST {
  public token: Token;
  public value: ValueType;
  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value;
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
export class Parser {
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
  factor(): AST {
    const token = this.currentToken;
    if (token.type === 'Minus') {
      this.eat('Minus');
      return new UnaryOp(token, this.factor());
    }
    if (token.type === 'Plus') {
      this.eat('Plus');
      return new UnaryOp(token, this.factor());
    }
    if (token.type === 'Integer') {
      this.eat('Integer');
      return new Num(token);
    } else if (token.type === 'LParen') {
      this.eat('LParen');
      const node = this.expr();
      this.eat('RParen');
      return node;
    }
  }
  term(): AST {
    let node = this.factor();
    while ((['Div', 'Mul'] as TokenType[]).indexOf(this.currentToken.type) !== -1) {
      const token = this.currentToken;
      if (token.type === 'Mul') {
        this.eat('Mul');
      } else if (token.type === 'Div') {
        this.eat('Div');
      }
      node = new BinOp(node, token, this.factor());
    }
    return node;
  }
  expr(): AST {
    let node = this.term();
    while ((['Minus', 'Plus'] as TokenType[]).indexOf(this.currentToken.type) !== -1) {
      const token = this.currentToken;
      if (token.type === 'Minus') {
        this.eat('Minus');
      } else if (token.type === 'Plus') {
        this.eat('Plus');
      }
      node = new BinOp(node, token, this.term());
    }
    return node;
  }
  parse() {
    return this.expr();
  }
}
export class Interpreter {
  public parser: Parser;
  constructor(parser: Parser) {
    this.parser = parser;
  }
  visitBinOp(node: BinOp) {
    if (node.op.type === 'Plus')
      return this.visit(node.left) + this.visit(node.right);
    if (node.op.type === 'Minus')
      return this.visit(node.left) - this.visit(node.right);
    if (node.op.type === 'Mul')
      return this.visit(node.left) * this.visit(node.right);
    if (node.op.type === 'Div')
      return this.visit(node.left) / this.visit(node.right);
  }
  visitUnaryOp(node: UnaryOp) {
    const op = node.op.type;
    if (op === 'Plus')
      return +this.visit(node.expr);
    if (op === 'Minus')
      return -this.visit(node.expr);
  }
  visitNum(node: Num) {
    return node.value;
  }
  visit(node: AST) {
    if (node instanceof BinOp)
      return this.visitBinOp(node)
    if (node instanceof UnaryOp)
      return this.visitUnaryOp(node)
    if (node instanceof Num)
      return this.visitNum(node)
  }
  interpret() {
    const tree = this.parser.parse();
    return this.visit(tree);
  }
}
function main() {
  const text = '5 - - - + - (3 + 4) - +2';
  const lexer = new Lexer(text);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);
  const result = interpreter.interpret();
  console.log(result);
}
main();