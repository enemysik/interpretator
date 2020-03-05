function main() {
  // const text = '5 - - - + - (3 + 4) - +2';
  const text = `
  C=test(5| 6| 3);
  X=(10*C*(1+0.0012*(Tx-15)));
  `;
  const lexer = new Lexer(text);

  // let tmp = lexer.getNextToken();
  // const tokens = [tmp];
  // do {
  //   tmp = lexer.getNextToken();
  //   tokens.push(tmp);
  // } while (tmp.type !== 'EOF')
  // for (let i = 0; i < tokens.length; i++) {
  //   if (tokens[i].type === 'ASSIGN') {
  //     console.log(tokens[i - 1].value);
  //   }
  // }
  // for (let i = 0; i < tokens.length; i++) {
  //   if (tokens[i].type === 'ID') {
  //     console.log(tokens[i].value);
  //   }
  // }
  
  const parser = new Parser(lexer);
  const globalScope = {
    'D': 0.1,
    'A': 3,
    'B': 7,
    'Tx': 9,
    test: (a, b, c) => {
      console.log(a, b, c);
      return 5;
    }
  };
  const interpreter = new Interpreter(parser, globalScope);
  interpreter.interpret();
  console.log(interpreter.GLOBAL_SCOPE);
}
try {
  main();
} catch (ex) {
  console.error(ex.message);
}