
export class Interpreter {
  private parser: Parser;
  GLOBAL_SCOPE;
  constructor(parser: Parser, globalScope = {}) {
    this.parser = parser;
    this.GLOBAL_SCOPE = globalScope;
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
  private visitProcedureDecl(node: ProcedureDecl) {}
  private visitFunctionCall(node: FunctionCall) {
    return this.GLOBAL_SCOPE[node.procName](...node.actualParams.map(pn => this.visit(pn)))
  }
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
    if (node instanceof ProcedureDecl)
      return this.visitProcedureDecl(node)
    if (node instanceof FunctionCall)
      return this.visitFunctionCall(node)
  }
  interpret() {
    const tree = this.parser.parse();
    return this.visit(tree);
  }
}
