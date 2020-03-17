/* eslint-disable require-jsdoc */
import Lexer from './lexer';
import Token from './token';

export class ErrorHandler {
  lexer: Lexer;
  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }
  formatErrorMessage(token: Token): string {
    const pos = this.lexer.pos;
    const tokenValue = token.value?.toString() || '';
    const underlinedTokenValue = '\u0332' + tokenValue.split('').join('\u0332');
    let message = 'Invalid syntax. \n';

    message += `Line ${this.lexer.line}, `;
    message += `Col ${(pos - this.lexer.lineStartPosition) - tokenValue.length +
      1}\n`;

    message += '...\n' + this.lexer.text.slice(this.lexer.pos -
      tokenValue.length - 10, this.lexer.pos - tokenValue.length);
    message += underlinedTokenValue;
    message += this.lexer.text.slice(this.lexer.pos,
        this.lexer.pos + 10) + '\n...';
    return message;
  }
  formatErrorMessageV2(token: Token): string {
    const pos = this.lexer.pos;
    const tokenValue = token.value?.toString() || '';
    const underlinedTokenValue = '\u0332' + tokenValue.split('').join('\u0332');
    let message = 'Invalid syntax. \n';

    message += `Line ${this.lexer.line}, `;
    message += `Col ${(pos - this.lexer.lineStartPosition) - tokenValue.length +
      1}\n`;
    let i = pos - tokenValue.length;
    let tmp = '';
    while (i !== 0 && this.lexer.text[i] !== '\n' &&
        this.lexer.text[i] !== '\r') {
      tmp = this.lexer.text[i--] + tmp;
    }
    i--;
    message += '...\n' + tmp + '\n';
    tmp = '';
    while (i !== 0 && this.lexer.text[i] !== '\n' &&
        this.lexer.text[i] !== '\r') {
      tmp = this.lexer.text[i--] + tmp;
    }
    message += '\n' + tmp + '\n';
    message += underlinedTokenValue;
    i = pos;
    tmp = '';
    while (i !== this.lexer.text.length - 1 &&
        this.lexer.text[i] !== '\n' &&
        this.lexer.text[i] !== '\r') {
      tmp += this.lexer.text[i++];
    }
    i++;
    message += tmp + '\n';
    tmp = '';
    while (i !== this.lexer.text.length - 1 &&
        this.lexer.text[i] !== '\n' &&
        this.lexer.text[i] !== '\r') {
      tmp += this.lexer.text[i++];
    }
    message += tmp + '\n...';
    return message;
  }
}
