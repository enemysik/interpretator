export type Scope = {
  [id: string]: Function;
} & Object

export const GLOBAL_SCOPE_PROTOTYPE: Scope = {
  ['if'.toUpperCase()]: function(condition: 0 | 1 | boolean, trueResult: number,
      elseResult: number): number {
    console.log(`if(${condition}|${trueResult}|${elseResult}`);
    if (typeof condition === 'boolean') {
      return condition ? trueResult : elseResult;
    }
    if (typeof condition === 'number') {
      return condition === 1 ? trueResult : elseResult;
    }
    throw new Error('Wrong function argument');
  },
  ['Если'.toUpperCase()]: function(condition: 0 | 1, trueResult: string,
      elseResult: string): string {
    return this['if'](condition, trueResult, elseResult);
  },
  ['exp'.toUpperCase()]: function(x: number): number {
    return Math.exp(x);
  },
  ['ln'.toUpperCase()]: function(x: number): number {
    return Math.log(x);
  },
  ['sin'.toUpperCase()]: function(x: number): number {
    return Math.sin(x);
  },
  ['cos'.toUpperCase()]: function(x: number): number {
    return Math.cos(x);
  },
  ['tg'.toUpperCase()]: function(x: number): number {
    return Math.tan(x);
  },
  ['ctg'.toUpperCase()]: function(x: number): number {
    return 1 / Math.tan(x);
  },
  ['arcsin'.toUpperCase()]: function(x: number): number {
    return Math.asin(x);
  },
  ['arccos'.toUpperCase()]: function(x: number): number {
    return Math.acos(x);
  },
  ['arctg'.toUpperCase()]: function(x: number): number {
    return Math.atan(x);
  },
  ['arcctg'.toUpperCase()]: function(x: number): number {
    return 1 / Math.atan(x); // TODO ???
  },
  ['abs'.toUpperCase()]: function(x: number): number {
    return Math.abs(x);
  },
  ['sqrt'.toUpperCase()]: function(x: number): number {
    return Math.sqrt(x);
  },
  ['notzer'.toUpperCase()]: function(x: number): number {
    return x > 0 ? x : 0;
  },
  ['Мтаблица'.toUpperCase()]: function(tableName: string, row: number,
      column: number) {
    console.log(tableName, row, column); // TODO implement
    return 0;
  },
  ['Цифры'.toUpperCase()]: function(value: number, n: number, type: 0 | 1) {
    if (type === 1) {
      if (n >= 0) {
        return +value.toFixed(n);
      }
      if (n < 0) {
        const l = value.toString().split('.')[0].length;
        return +value.toPrecision(l + n);
      }
    } else {
      return +value.toPrecision(n);
    }
  },
  ['Пометодике'.toUpperCase()]: function(value: number) {
    return value; // TODO implement
  },
  ['ПометодикеN'.toUpperCase()]: function(value: number, n: number) {
    return +value.toFixed(n); // TODO implement
  },
  ['INT'.toUpperCase()]: function(x: number) {
    return Math.trunc(x);
  },
  ['FRAC'.toUpperCase()]: function(x: number) {
    return x % 1; // TODO accuracy
  },
  ['ЧЗП'.toUpperCase()]: function(x: number) {
    console.log(x);
    return 0; // TODO implement
  },
  ['Ошибка'.toUpperCase()]: function(text: string) {
    throw new Error(text);
  },
};
