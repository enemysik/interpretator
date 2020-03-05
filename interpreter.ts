/* eslint-disable require-jsdoc */
import {Parser, BinOp, UnaryOp, Num, Compound,
  NoOp, Assign, Program, Block, VarDecl, Type,
  ProcedureDecl, FunctionCall, Var, AST} from './parser';
import {ValueType} from './token';

type Scope = {
  [id: string]: any
}
export class Interpreter {
  private parser: Parser;
  GLOBAL_SCOPE: Scope;
  constructor(parser: Parser, globalScope = {}) {
    this.parser = parser;
    this.GLOBAL_SCOPE = globalScope;
  }
  error() {
    throw new Error('Invalid operation');
  }
  private visitBinOp(node: BinOp): number {
    if (node.op.type === 'Plus') {
      return this.visit(node.left) + this.visit(node.right);
    }
    if (node.op.type === 'Minus') {
      return this.visit(node.left) - this.visit(node.right);
    }
    if (node.op.type === 'Mul') {
      return this.visit(node.left) * this.visit(node.right);
    }
    if (node.op.type === 'FLOAT_DIV') {
      return this.visit(node.left) / this.visit(node.right);
    }
    if (node.op.type === 'INTEGER_DIV') {
      return Math.trunc(this.visit(node.left) / this.visit(node.right));
    }
    throw this.error();
  }
  private visitUnaryOp(node: UnaryOp): number {
    const op = node.op.type;
    if (op === 'Plus') {
      return +this.visit(node.expr);
    }
    if (op === 'Minus') {
      return -this.visit(node.expr);
    }
    throw this.error();
  }
  private visitNum(node: Num): number {
    return node.value as number;
  }
  private visitCompound(node: Compound) {
    node.children.forEach((c) => this.visit(c));
  }
  private visitNoOp(): void {}
  private visitAssign(node: Assign) {
    const varName = node.left.value as string;
    this.GLOBAL_SCOPE[varName] = this.visit(node.right);
  }
  private visitProgram(node: Program) {
    return this.visit(node.block);
  }
  private visitBlock(node: Block) {
    node.declarations.forEach((declaration) => {
      this.visit(declaration);
    });
    this.visit(node.compoundStatement);
  }
  private visitVarDecl() {}
  private visitType() {}
  private visitProcedureDecl() {}
  private visitFunctionCall(node: FunctionCall): ValueType {
    return this.GLOBAL_SCOPE[node.procName](
        ...node.actualParams.map((pn) => this.visit(pn)),
    );
  }
  private visitVar(node: Var) {
    const varName = node.value as string;
    const value = this.GLOBAL_SCOPE[varName];
    if (value === undefined) {
      throw new Error(`Name error ${varName}`);
    } else {
      return value;
    }
  }
  private visit(node: AST): any {
    if (node instanceof BinOp) {
      return this.visitBinOp(node);
    }
    if (node instanceof UnaryOp) {
      return this.visitUnaryOp(node);
    }
    if (node instanceof Num) {
      return this.visitNum(node);
    }
    if (node instanceof Assign) {
      return this.visitAssign(node);
    }
    if (node instanceof NoOp) {
      return this.visitNoOp();
    }
    if (node instanceof Var) {
      return this.visitVar(node);
    }
    if (node instanceof Compound) {
      return this.visitCompound(node);
    }
    if (node instanceof Program) {
      return this.visitProgram(node);
    }
    if (node instanceof Block) {
      return this.visitBlock(node);
    }
    if (node instanceof VarDecl) {
      return this.visitVarDecl();
    }
    if (node instanceof Type) {
      return this.visitType();
    }
    if (node instanceof ProcedureDecl) {
      return this.visitProcedureDecl();
    }
    if (node instanceof FunctionCall) {
      return this.visitFunctionCall(node);
    }
  }
  interpret() {
    const tree = this.parser.parse();
    return this.visit(tree);
  }
}
