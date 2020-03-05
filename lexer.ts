/* eslint-disable require-jsdoc */
import {Token} from './token';

export const WORD_OR_DIGIT_REGEXP = /([А-Яа-яA-Za-z]|\d|\,)/;
export const WORD_REGEXP = /[А-Яа-яA-Za-z]/;

type TokensObject = {
  [name: string]: Token;
}
export class Lexer {
  private text: string;
  private pos: number;
  public currentChar: string | null;
  private static RESERVED_KEYWORDS: TokensObject = {
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
    while (this.currentChar != null &&
      WORD_OR_DIGIT_REGEXP.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    const token = Lexer.RESERVED_KEYWORDS[result] || new Token('ID', result);
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
  private advance() {
    this.pos++;
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
    if (/(\,|\.)/.test(this.currentChar!)) {
      result += '.'; // js support only DOT
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
  string() {
    let result = '';
    this.advance();
    while (this.currentChar != null && !(/\"/.test(this.currentChar))) {
      result += this.currentChar;
      this.advance();
    }
    this.advance();
    let editable = false; // TODO find where i should it use
    if (this.currentChar != null && /\+/.test(this.currentChar)) {
      editable = true;
    }
    if (/\;/.test(result)) {
      return new Token('ARRAY_CONST', result);
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
      if (WORD_REGEXP.test(this.currentChar)) {
        return this._id();
      }
      if (/\"/.test(this.currentChar)) {
        return this.string();
      }

      if (/\=/.test(this.currentChar)) {
        this.advance();
        return new Token('ASSIGN', '=');
      }

      if (this.currentChar === '\n') {
        this.advance();
        return new Token('ENTER', '\n');
      }

      if (/\"/.test(this.currentChar)) {
        this.advance();
        return new Token('DQuote', '"');
      }

      if (/\^/.test(this.currentChar)) {
        this.advance();
        return new Token('CARET', '^');
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
      if (/\|/.test(this.currentChar)) {
        this.advance();
        return new Token('PIPE', '|');
      }

      if (/\d/.test(this.currentChar)) {
        return this.number();
      }

      if (/\+/.test(this.currentChar)) {
        this.advance();
        return new Token('Plus', '+');
      }

      if (/\-/.test(this.currentChar)) {
        this.advance();
        return new Token('Minus', '-');
      }

      if (/\*/.test(this.currentChar)) {
        this.advance();
        return new Token('Mul', '*');
      }

      if (/\//.test(this.currentChar)) {
        this.advance();
        return new Token('FLOAT_DIV', '/');
      }

      if (/\(/.test(this.currentChar)) {
        this.advance();
        return new Token('LParen', '(');
      }

      if (/\)/.test(this.currentChar)) {
        this.advance();
        return new Token('RParen', ')');
      }

      this.error();
    }
    return new Token('EOF', null);
  }
}
