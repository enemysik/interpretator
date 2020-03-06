/* eslint-disable require-jsdoc */
import {Token, ChemicArrayToken, VariableToken, FunctionToken} from './token';

export const WORD_OR_DIGIT_REGEXP = /([А-Яа-яA-Za-z]|\d|\,|\_|\s|\.)/;
export const WORD_REGEXP = /[А-Яа-яA-Za-z]/;

export type TokensObject = {
  [name: string]: Token;
}
export class Lexer {
  private text: string;
  public pos: number;
  public currentChar: string | null;
  private static RESERVED_KEYWORDS: TokensObject = {
    'И': new Token('AND', 'И'),
    'ИЛИ': new Token('OR', 'ИЛИ'),
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
  private peekWord() {
    let result = '';
    let peekPosition = this.pos;
    while (this.text[peekPosition] != null &&
      WORD_OR_DIGIT_REGEXP.test(this.text[peekPosition]) &&
      !/\s/.test(this.text[peekPosition])) {
      result += this.text[peekPosition];
      peekPosition++;
    }
    return result;
  }
  private _id() {
    let result = '';
    while (this.currentChar != null &&
       WORD_OR_DIGIT_REGEXP.test(this.currentChar)) {
      const peekedWord = this.peekWord();
      if (Lexer.RESERVED_KEYWORDS[peekedWord] !== undefined) {
        if (result === '') {
          this.advance(peekedWord.length);
          return Lexer.RESERVED_KEYWORDS[peekedWord];
        } else {
          break;
        }
      } else {
        if (peekedWord === '') break;
        this.advance(peekedWord.length);
        result += peekedWord;
        if (this.currentChar === ' ') {
          result += ' ';
          this.advance();
        }
      }
    }
    result = result.trim();
    if (this.currentChar == '(') {
      return new FunctionToken('ID', result);
    }
    const token = Lexer.RESERVED_KEYWORDS[result] ||
      new VariableToken('ID', result);
    return token;
  }
  private skipComment() {
    while (!/\}/.test(this.currentChar!)) {
      this.advance();
    }
    this.advance();
  }
  private error() {
    throw new Error('Invalid character');
  }
  private advance(length = 1) {
    this.pos += length;
    if (this.pos > this.text.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }
  private skipWhiteSpace() {
    while (this.currentChar != null && this.currentChar === ' ') {
      this.advance();
    }
  }
  private number() {
    let result = '';
    while (this.currentChar != null && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    const isFloat = /(\,|\.)/.test(this.currentChar!);
    if (isFloat) {
      result += '.'; // js support only DOT
      this.advance();
      while (this.currentChar != null && /\d/.test(this.currentChar)) {
        result +=this.currentChar;
        this.advance();
      }
    }
    const isExp = /\e/.test(this.currentChar!);
    if (isExp) {
      result += 'e';
      this.advance();
      if (/\-|\+/.test(this.currentChar!)) {
        result += this.currentChar;
        this.advance();
      }
      while (this.currentChar != null && /\d/.test(this.currentChar)) {
        result +=this.currentChar;
        this.advance();
      }
    }
    return new Token('REAL_CONST', result);
  }
  string() {
    let result = '';
    this.advance();
    while (this.currentChar != null && !(/\"/.test(this.currentChar))) {
      result += this.currentChar;
      this.advance();
    }
    this.advance();
    let editable = false;
    if (this.currentChar != null && /\+/.test(this.currentChar)) {
      editable = true;
      this.advance();
    }
    if (/\;/.test(result)) {
      return new ChemicArrayToken('STRING_CONST',
          result, result.split(';'), editable);
    } else {
      return new Token('STRING_CONST', result);
    }
  }
  getNextToken() {
    while (this.currentChar != null) {
      if (this.currentChar === ' ') {
        this.skipWhiteSpace();
        continue;
      }
      if (/\{/.test(this.currentChar)) {
        this.advance();
        this.skipComment();
        continue;
      }
      // #region Two symbol operators
      if (/\=/.test(this.currentChar) && /\=/.test(this.peek()!)) {
        this.advance();
        this.advance();
        return new Token('EQUAL', '==');
      }

      if (/\</.test(this.currentChar) && /\>/.test(this.peek()!)) {
        this.advance();
        this.advance();
        return new Token('NOT_EQUAL', '<>');
      }

      if (/\>/.test(this.currentChar) && /\=/.test(this.peek()!)) {
        this.advance();
        this.advance();
        return new Token('MORE_OR_EQUAL', '>=');
      }

      if (/\</.test(this.currentChar) && /\=/.test(this.peek()!)) {
        this.advance();
        this.advance();
        return new Token('LESS_OR_EQUAL', '<=');
      }
      // #endregion
      // #region boolean operators
      if (/\>/.test(this.currentChar)) {
        this.advance();
        return new Token('MORE', '>');
      }

      if (/\</.test(this.currentChar)) {
        this.advance();
        return new Token('LESS', '<');
      }
      // #endregion
      // #region const detection
      if (/\"/.test(this.currentChar)) {
        return this.string();
      }

      if (/\d/.test(this.currentChar)) {
        return this.number();
      }
      // #endregion
      // #region function arguments separators
      if (/\;/.test(this.currentChar)) {
        this.advance();
        return new Token('SEMI', ';');
      }

      if (/\|/.test(this.currentChar)) {
        this.advance();
        return new Token('PIPE', '|');
      }
      // #endregion
      // #region Math operations
      if (/\*/.test(this.currentChar)) {
        this.advance();
        return new Token('Mul', '*');
      }

      if (/\//.test(this.currentChar)) {
        this.advance();
        return new Token('FLOAT_DIV', '/');
      }

      if (/\-/.test(this.currentChar)) {
        this.advance();
        return new Token('Minus', '-');
      }
      if (/\+/.test(this.currentChar)) {
        this.advance();
        return new Token('Plus', '+');
      }
      if (/\^/.test(this.currentChar)) {
        this.advance();
        return new Token('CARET', '^');
      }
      // #endregion
      // #region parentheses
      if (/\(/.test(this.currentChar)) {
        this.advance();
        return new Token('LParen', '(');
      }

      if (/\)/.test(this.currentChar)) {
        this.advance();
        return new Token('RParen', ')');
      }
      // #endregion

      if (WORD_REGEXP.test(this.currentChar)) {
        return this._id();
      }

      if (/\=/.test(this.currentChar)) {
        this.advance();
        return new Token('ASSIGN', '=');
      }

      if (this.currentChar === '\n') {
        this.advance();
        return new Token('ENTER', '\n');
      }

      this.error();
    }
    return new Token('EOF', null);
  }
}
