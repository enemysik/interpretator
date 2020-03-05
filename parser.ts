
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
export class ProcedureDecl extends AST {
  procName: string;
  blockNode: Block
  constructor(procName: string, blockNode: Block) {
    super();
    this.procName = procName;
    this.blockNode = blockNode;
  }
  
}
export class FunctionCall extends AST {
  procName: string;
  actualParams: AST[];
  token: Token;
  constructor(procName: string, actualParams: AST[], token: Token) {
    super();
    this.procName = procName;
    this.actualParams = actualParams;
    this.token = token;
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
    if (this.lexer.currentChar === '(') {
      return this.functionCallStatement();
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
    } 
    if (this.currentToken.type === 'ID') {
      if (this.lexer.currentChar === '(') {
        return this.functionCallStatement();
      }
      return this.assignmentStatement();
    }
    return this.empty();
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
    const node = this.statementList();
    const root = new Compound();
    node.forEach(element => {
      root.children.push(element);
    });
    return root;
  }
  program() {
    const blockNode = this.block();
    const programNode = new Program('', blockNode);
    this.eat('EOF');
    return programNode;
  }
  block() {
    const declarationNode = [];
    const compoundStatementNode = this.compoundStatement();
    return new Block(declarationNode, compoundStatementNode);
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
  functionCallStatement() {
    const token = this.currentToken;
    const procName = token.value as string;
    this.eat('ID');
    this.eat('LParen');
    const actualParams = [];
    if (this.currentToken.type !== 'RParen') {
      const node = this.expr();
      actualParams.push(node);
    }
    while (this.currentToken.type === 'COMMA') {
      this.eat('COMMA');
      const node = this.expr();
      actualParams.push(node);
    }
    while (this.currentToken.type === 'PIPE') {
      this.eat('PIPE');
      const node = this.expr();
      actualParams.push(node);
    }
    while (this.currentToken.type === 'SEMI') {
      this.eat('SEMI');
      const node = this.expr();
      actualParams.push(node);
    }
    this.eat('RParen');
    return new FunctionCall(procName, actualParams, token);
  }
  parse() {
    const node = this.program();
    if (this.currentToken.type != 'EOF') {
      this.error();
    }
    return node;
  }
}