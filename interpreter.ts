export type BinOpsType = 'Plus' | 'Minus' | 'Mul' |'INTEGER_DIV' |'FLOAT_DIV';
export type PascalKeywordsType = 'BEGIN' | 'END' | 'PROGRAM'| 'VAR'| 'INTEGER_DIV'| 'INTEGER'| 'REAL';
export type TokenType = BinOpsType | PascalKeywordsType | SyntaxType | 'EOF' | 'ASSIGN' | 'SEMI' | 'DOT' | 'ID' | 'INTEGER_CONST' |'REAL_CONST';
export type SyntaxType ='COLON' | 'COMMA' | 'LParen' | 'RParen';

export type ValueType = string | number;
export const WORD_OR_DIGIT_REGEXP = /([А-Яа-яA-Za-z]|\d)/;
export const WORD_REGEXP = /[А-Яа-яA-Za-z]/;
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
export class Compound extends AST {
  children = [];
  constructor() {
    super();
  }
}
export class Assign extends AST {
  left: Var;
  token: Token;
  right: AST;
  constructor(left: Var, op: Token, right: AST) {
    super();
    this.left = left;
    this.token = op;
    this.right = right;
  }
}
export class Var extends AST {
  token: Token;
  value: ValueType;
  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value
  }
}
export class NoOp extends AST { }
export class Program extends AST {
  name: string;
  block: Block;
  constructor(name: string, block: Block) {
    super();
    this.name = name;
    this.block = block;
  } 
}
export class Block extends AST {
  declarations: [VarDecl];
  compoundStatement: Compound;
  constructor(declaration, compoundStatement: Compound) {
    super();
    this.declarations = declaration;
    this.compoundStatement = compoundStatement;
  }
}
export class VarDecl extends AST {
  varNode: Var;
  typeNode: Type;
  constructor(varNode: Var, typeNode: Type) {
    super();
    this.varNode = varNode;
    this.typeNode = typeNode;
  }
}
export class Type extends AST {
  token: Token;
  constructor(token: Token) {
    super();
    this.token = token;
  }
}
export class Lexer {
  private text: string;
  private pos: number;
  private currentChar: string;
  private static RESERVED_KEYWORDS = {
    BEGIN: new Token('BEGIN', 'BEGIN'),
    END: new Token('END', 'END'),
    PROGRAM: new Token('PROGRAM', 'PROGRAM'),
    VAR: new Token('VAR', 'VAR'),
    DIV: new Token('INTEGER_DIV', 'DIV'),
    INTEGER: new Token('INTEGER', 'INTEGER'),
    REAL: new Token('REAL', 'REAL'),
}
  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }
  private peek() {
    const peekPosition = this.pos + 1;
    if (peekPosition > this.text.length - 1) {
      return null;
    } else {
      return this.text[peekPosition];
    }
  }
  private _id() {
    let result = '';
    while (this.currentChar != null && WORD_OR_DIGIT_REGEXP.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    const token = Lexer.RESERVED_KEYWORDS[result] || new Token('ID', result);
    return token;
  }
  private skipComment() {
    while (!/\}/.test(this.currentChar)) {
      this.advance();
    }
    this.advance();
  }
  private error() {
    throw new Error('Invalid character');
  }
  private advance() {
    this.pos++;
    if (this.pos > this.text.length - 1)
      this.currentChar = null;
    else
      this.currentChar = this.text[this.pos];
  }
  private skipWhiteSpace() {
    while (this.currentChar != null && 
      (this.currentChar === ' ' || this.currentChar === '\n'))
      this.advance();
  }
  private number() {
    let result = '';
    while (this.currentChar != null && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (/\./.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
      while (this.currentChar != null && /\d/.test(this.currentChar)) {
        result +=this.currentChar;
        this.advance();
      }
      return new Token('REAL_CONST', result);
    } else {
      return new Token('INTEGER_CONST', result);
    }
  }
  getNextToken() {
    while (this.currentChar != null) {
      if (this.currentChar === ' ' || this.currentChar === '\n') {
        this.skipWhiteSpace();
        continue;
      }
      if (/\{/.test(this.currentChar)) {
        this.advance();
        this.skipComment();
        continue;
      }
      if (WORD_REGEXP.test(this.currentChar)) {
        return this._id();
      }
      
      if (/\:/.test(this.currentChar) && /\=/.test(this.peek())) {
        this.advance();
        this.advance();
        return new Token('ASSIGN', ':=');
      }

      if (/\:/.test(this.currentChar)) {
        this.advance();
        return new Token('COLON', ':');
      }

      if (/\,/.test(this.currentChar)) {
        this.advance();
        return new Token('COMMA', ',');
      }

      if (/\;/.test(this.currentChar)) {
        this.advance();
        return new Token('SEMI', ';');
      }

      if (/\./.test(this.currentChar)) {
        this.advance();
        return new Token('DOT', '.');
      }

      if (/\d/.test(this.currentChar))
        return this.number();

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
        return new Token('FLOAT_DIV', '/')
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
    throw new Error(`Invalid syntax. ${this.currentToken.type}:${this.currentToken.value}`);
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
    if (token.type === 'INTEGER_CONST') {
      this.eat('INTEGER_CONST');
      return new Num(token);
    }
    if (token.type === 'REAL_CONST') {
      this.eat('REAL_CONST');
      return new Num(token);
    }
    if (token.type === 'LParen') {
      this.eat('LParen');
      const node = this.expr();
      this.eat('RParen');
      return node;
    }
    return this.variable();
  }
  term(): AST {
    let node = this.factor();
    while ((['INTEGER_DIV', 'FLOAT_DIV', 'Mul'] as TokenType[]).indexOf(this.currentToken.type) !== -1) {
      const token = this.currentToken;
      if (token.type === 'Mul') {
        this.eat('Mul');
      } else if (token.type === 'INTEGER_DIV') {
        this.eat('INTEGER_DIV');
      } if (token.type === 'FLOAT_DIV') {
        this.eat('FLOAT_DIV')
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
  empty() {
    return new NoOp();
  }
  variable() {
    const node = new Var(this.currentToken);  
    this.eat('ID');
    return node;
  }
  assignmentStatement() {
    const left = this.variable();
    const token = this.currentToken;
    this.eat('ASSIGN');
    const right = this.expr();
    const node = new Assign(left, token, right);
    return node;
  }
  statement() {
    if (this.currentToken.type === 'BEGIN') {
      return this.compoundStatement();
    } else if (this.currentToken.type === 'ID') {
      return this.assignmentStatement();
    } else {
      return this.empty();
    }
  }
  statementList() {
    const node = this.statement();
    const results = [node];
    while (this.currentToken.type === 'SEMI') {
      this.eat('SEMI');
      results.push(this.statement());
    }
    if (this.currentToken.type === 'ID') {
      this.error();
    }
    return results;
  }
  compoundStatement() {
    this.eat('BEGIN');
    const node = this.statementList();
    this.eat('END');
    const root = new Compound();
    node.forEach(element => {
      root.children.push(element);
    });
    return root;
  }
  program() {
    this.eat('PROGRAM');
    const varNode = this.variable();
    const progName = varNode.value as string;
    this.eat('SEMI');
    const blockNode = this.block();
    const programNode = new Program(progName, blockNode);
    this.eat('DOT');
    return programNode;
  }
  block() {
    const declarationNode = this.declaration();
    const compoundStatementNode = this.compoundStatement();
    return new Block(declarationNode, compoundStatementNode);
  }
  declaration() {
    const declarations = [];
    if (this.currentToken.type === 'VAR') {
      this.eat('VAR');
      // @ts-ignore
      while (this.currentToken.type === 'ID') {
        const varDecl = this.variableDeclaration()
        declarations.push(varDecl);
        this.eat('SEMI');
      }
    }
    return declarations;
  }
  variableDeclaration() {
    const varNodes = [new Var(this.currentToken)];
    this.eat('ID');
    while (this.currentToken.type === 'COMMA') {
      this.eat('COMMA');
      varNodes.push(new Var(this.currentToken));
      this.eat('ID');
    }
    this.eat('COLON');

    const typeNode = this.typeSpec();
    return [varNodes.map(varNode => new VarDecl(varNode, typeNode))];
  }
  typeSpec() {
    const token = this.currentToken;
    if (this.currentToken.type === 'INTEGER') {
      this.eat('INTEGER');
    } else {
      this.eat('REAL');
    }
    return new Type(token);
  }
  parse() {
    const node = this.program();
    if (this.currentToken.type != 'EOF') {
      this.error();
    }
    return node;
  }
}
export class Interpreter {
  private parser: Parser;
  GLOBAL_SCOPE = {};
  constructor(parser: Parser) {
    this.parser = parser;
  }
  private visitBinOp(node: BinOp) {
    if (node.op.type === 'Plus')
      return this.visit(node.left) + this.visit(node.right);
    if (node.op.type === 'Minus')
      return this.visit(node.left) - this.visit(node.right);
    if (node.op.type === 'Mul')
      return this.visit(node.left) * this.visit(node.right);
    if (node.op.type === 'FLOAT_DIV')
      return this.visit(node.left) / this.visit(node.right);
    if (node.op.type === 'INTEGER_DIV')
      return Math.trunc(this.visit(node.left) / this.visit(node.right));
  }
  private visitUnaryOp(node: UnaryOp) {
    const op = node.op.type;
    if (op === 'Plus')
      return +this.visit(node.expr);
    if (op === 'Minus')
      return -this.visit(node.expr);
  }
  private visitNum(node: Num) {
    return node.value;
  }
  private visitCompound(node: Compound) {
    node.children.forEach(c => this.visit(c));
  }
  private visitNoOp(node: NoOp): void {}
  private visitAssign(node: Assign) {
    const varName = node.left.value;
    this.GLOBAL_SCOPE[varName] = this.visit(node.right);
  }
  private visitProgram(node: Program) {
    return this.visit(node.block);
  }
  private visitBlock(node: Block) {
    node.declarations.forEach(declaration => {
      this.visit(declaration);
    });
    this.visit(node.compoundStatement);
  }
  private visitVarDecl(node: VarDecl) {}
  private visitType(node: Type) {}
  private visitVar(node: Var) {
    const varName = node.value;
    const value = this.GLOBAL_SCOPE[varName];
    if (value === undefined) {
      throw new Error(`Name error ${varName}`);
    } else {
      return value;
    }
  }
  private visit(node: AST) {
    if (node instanceof BinOp)
      return this.visitBinOp(node)
    if (node instanceof UnaryOp)
      return this.visitUnaryOp(node)
    if (node instanceof Num)
      return this.visitNum(node)
    if (node instanceof Assign)
      return this.visitAssign(node)
    if (node instanceof NoOp)
      return this.visitNoOp(node)
    if (node instanceof Var)
      return this.visitVar(node)
    if (node instanceof Compound)
      return this.visitCompound(node)
    if (node instanceof Program)
      return this.visitProgram(node)
    if (node instanceof Block)
      return this.visitBlock(node)
    if (node instanceof VarDecl)
      return this.visitVarDecl(node)
    if (node instanceof Type)
      return this.visitType(node)
  }
  interpret() {
    const tree = this.parser.parse();
    return this.visit(tree);
  }
}
function main() {
  // const text = '5 - - - + - (3 + 4) - +2';
  const text = `
  PROGRAM Part10AST;
  VAR
     a, b : INTEGER;
     y    : REAL;
  
  BEGIN {Part10AST}
     a := 2;
     b := 10 * a + 10 * a DIV 4;
     y := 20 / 7 + 3.14;
  END.  {Part10AST}`;
  const lexer = new Lexer(text);

  // let tmp = lexer.getNextToken();
  // do {
  //   console.log(tmp);
  //   tmp = lexer.getNextToken();
  // } while (tmp.type !== 'EOF')
  
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);
  interpreter.interpret();
  console.log(interpreter.GLOBAL_SCOPE);
}
try {
  main();
} catch (ex) {
  console.error(ex.message);
}