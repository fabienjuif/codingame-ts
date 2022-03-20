type Resistance = { name: string; value: number };
type Bank = Map<Resistance["name"], Resistance>;
enum StackItemType {
  PARALLEL = "PARALLEL",
  SERIE = "SERIE",
  VALUE = "VALUE",
}
type StackItem = {
  type: StackItemType;
  args: number[];
};

function main(readline) {
  const bank: Bank = new Map();

  const N: number = parseInt(readline());
  for (let i = 0; i < N; i++) {
    var inputs: string[] = readline().split(" ");
    const name: string = inputs[0];
    const R: number = parseInt(inputs[1], 10);

    bank.set(name, { name, value: R });
  }
  const circuit: string[] = readline().split(" ");

  const stack: StackItem[] = [];
  circuit.forEach((item) => {
    if (item === "[") {
      stack.push({ type: StackItemType.PARALLEL, args: [] });
    } else if (item === "(") {
      stack.push({ type: StackItemType.SERIE, args: [] });
    } else if (item === "]" || item === ")") {
      const stackItem = stack.pop();
      if (stackItem === undefined) {
        throw new Error(`No more stack item!`);
      }

      let value;
      if (stackItem.type === StackItemType.PARALLEL) {
        value = 1 / stackItem.args.reduce((curr, arg) => curr + 1 / arg, 0);
      } else if (stackItem.type === StackItemType.SERIE) {
        value = stackItem.args.reduce((curr, arg) => curr + arg, 0);
      } else {
        throw new Error(`Close a stack without a known type ${stackItem.type}`);
      }

      if (stack.length === 0) {
        // end
        console.log(value.toFixed(1));
      } else {
        const stackItem = stack[stack.length - 1];
        if (stackItem === undefined) {
          throw new Error(`No more stack item!`);
        }
        stackItem.args.push(value);
      }
    } else {
      const resistance = bank.get(item);
      if (resistance === undefined) {
        throw new Error(`Item unknown: "${item}"!`);
      }

      const stackItem = stack[stack.length - 1];
      if (stackItem === undefined) {
        throw new Error(`No more stack item!`);
      }
      stackItem.args.push(resistance.value);
    }
  });
}

// CHANGE THIS ON CODINGAME
// main(readline)
// CHANGE THIS IN JEST
export { main };
