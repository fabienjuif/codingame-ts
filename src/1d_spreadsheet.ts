enum Operation {
  VALUE = "VALUE",
  ADD = "ADD",
  SUB = "SUB",
  MULT = "MULT",
}

interface Line {
  index: number;
  operation: Operation;
  arg1: string;
  arg2: string;
}

type ResultsMap = Map<number, number>;
type WaitingMap = Map<number, Line[]>;

enum ValueType {
  NUMBER = "NUMBER",
  UNKNOWN_REF = "UNKNOWN_REF",
  VOID = "VOID",
}

type ValueRes = { type: ValueType; value?: number };

const getRef = (arg: string) => parseInt(arg.replace("$", ""), 10);

const getValue =
  (results: ResultsMap) =>
  (arg: string): ValueRes => {
    if (arg[0] === "$") {
      const v = results.get(getRef(arg));
      if (v === undefined) {
        return {
          type: ValueType.UNKNOWN_REF,
          value: getRef(arg),
        };
      }

      return {
        type: ValueType.NUMBER,
        value: v,
      };
    } else if (arg[0] === "_") {
      return {
        type: ValueType.VOID,
      };
    }

    return {
      type: ValueType.NUMBER,
      value: parseInt(arg, 10),
    };
  };

const processLine =
  (results: ResultsMap) =>
  ({ index, operation, arg1, arg2 }: Line): ValueRes => {
    const arg1Value = getValue(results)(arg1);
    const arg2Value = getValue(results)(arg2);

    if (arg1Value.type === ValueType.VOID) {
      throw new Error("arg1 is VOID ?!");
    } else if (arg1Value.type === ValueType.UNKNOWN_REF) {
      return arg1Value;
    }

    const checkAnd = (
      impl: (val1: number, val2: number) => number
    ): ValueRes => {
      if (arg2Value.type === ValueType.UNKNOWN_REF) {
        return arg2Value;
      } else if (arg2Value.type === ValueType.VOID) {
        throw new Error("arg2 is VOID ?! (ADD)");
      }

      return {
        type: ValueType.NUMBER,
        value: impl(arg1Value.value as number, arg2Value.value as number),
      };
    };

    switch (operation) {
      case Operation.VALUE:
        return arg1Value;
      case Operation.ADD:
        return checkAnd((a, b) => a + b);
      case Operation.SUB:
        return checkAnd((a, b) => a - b);
      case Operation.MULT:
        return checkAnd((a, b) => a * b);
      default:
        throw new Error(`Unknown Operation ${operation}`);
    }
  };

function main(readline) {
  const results: ResultsMap = new Map();
  const waiting: WaitingMap = new Map();
  const N: number = parseInt(readline());
  for (let i = 0; i < N; i++) {
    var inputs: string[] = readline().split(" ");
    const operation: Operation = inputs[0] as Operation;
    const arg1: string = inputs[1];
    const arg2: string = inputs[2];

    const currentLine: Line = { index: i, arg1, arg2, operation };

    const runLine = (line: Line) => {
      const res = processLine(results)(line);
      if (res.type === ValueType.NUMBER) {
        results.set(line.index, res.value as number);
      } else if (res.type === ValueType.UNKNOWN_REF) {
        const w = waiting.get(res.value as number) || [];
        waiting.set(res.value as number, [...w, line]);
      } else {
        throw new Error("VOID ???");
      }

      const toRunAgain = waiting.get(line.index);
      waiting.delete(line.index);
      toRunAgain?.forEach(runLine);
    };

    runLine(currentLine);
  }

  for (let i = 0; i < N; i++) {
    console.log(String(results.get(i)));
  }
}

// CHANGE THIS ON CODINGAME
// main(readline)
// CHANGE THIS IN JEST
export { main };
