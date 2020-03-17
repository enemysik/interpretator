/* eslint-disable require-jsdoc */
import {Parser, BinOp, UnaryOp, Num, Compound,
  NoOp, Assign, Program, Block, VarDecl, Type,
  ProcedureDecl, FunctionCall, Var, AST, Str, Arr, BoolOp} from './parser';
import {ValueType} from './token';
import {Lexer} from './lexer';
import {GLOBAL_SCOPE_PROTOTYPE, Scope} from './global-functions-scope';

export class Interpreter {
  private parser: Parser;
  GLOBAL_SCOPE: Scope;
  constructor(parser: Parser | string, globalScope = {}) {
    if (typeof parser === 'string') {
      this.parser = new Parser(new Lexer(parser));
    } else {
      this.parser = parser;
    }
    this.GLOBAL_SCOPE = globalScope;
  }
  error(node: AST) {
    throw new Error('Invalid operation' + JSON.stringify(node));
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
      const left = this.visit(node.left);
      const right = this.visit(node.right);
      if (right === 0) {
        let errorMessage = 'Cannot divide by zero.';
        if (node.right instanceof Var) {
          errorMessage += ` Variable name ${node.right.value}`;
        }
        throw new Error(errorMessage);
      }
      return left / right;
    }
    if (node.op.type === 'CARET') {
      return Math.pow(this.visit(node.left), this.visit(node.right));
    }
    throw this.error(node);
  }
  private visitBoolOp(node: BoolOp): boolean {
    if (node.op.type === 'MORE') {
      return this.visit(node.left) > this.visit(node.right);
    }
    if (node.op.type === 'LESS') {
      return this.visit(node.left) < this.visit(node.right);
    }
    if (node.op.type === 'MORE_OR_EQUAL') {
      return this.visit(node.left) >= this.visit(node.right);
    }
    if (node.op.type === 'LESS_OR_EQUAL') {
      return this.visit(node.left) <= this.visit(node.right);
    }
    if (node.op.type === 'NOT_EQUAL') {
      return this.visit(node.left) !== this.visit(node.right);
    }
    if (node.op.type === 'EQUAL') {
      const left = this.visit(node.left);
      const right = this.visit(node.right);
      console.log(`EQUAL ${left} === ${right}`);
      return left === right;
    }
    if (node.op.type === 'AND') {
      return this.visit(node.left) && this.visit(node.right);
    }
    if (node.op.type === 'OR') {
      return this.visit(node.left) || this.visit(node.right);
    }
    throw this.error(node);
  }
  private visitUnaryOp(node: UnaryOp): number {
    const op = node.op.type;
    if (op === 'Plus') {
      return +this.visit(node.expr);
    }
    if (op === 'Minus') {
      return -this.visit(node.expr);
    }
    throw this.error(node);
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
    if (node.right instanceof Arr) return; // TODO ignore combo variables
    const right = this.visit(node.right);
    // console.log('assign', varName, this.GLOBAL_SCOPE[varName],
    //     typeof this.GLOBAL_SCOPE[varName], right, typeof right,
    //     typeof node.right);
    this.GLOBAL_SCOPE[varName] = right;
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
    const func = GLOBAL_SCOPE_PROTOTYPE[node.procName.toUpperCase()];
    if (typeof func !== 'function') {
      throw new Error(`Function ${node.procName} not found.`);
    }
    return func(
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
  private visitStr(node: Str) {
    return node.value;
  }
  private visitArr(node: Arr) {
    return node.array;
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
    if (node instanceof Str) {
      return this.visitStr(node);
    }
    if (node instanceof Arr) {
      return this.visitArr(node);
    }
    if (node instanceof BoolOp) {
      return this.visitBoolOp(node) ? 1 : 0;
    }
  }
  interpret() {
    const tree = this.parser.parse();
    return this.visit(tree);
  }
}
export default Interpreter;
