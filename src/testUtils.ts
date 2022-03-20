const toLines = (dataset: string) =>
  dataset
    .replace(/\\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter((v, index, arr) => {
      if (v.length === 0 && [0, arr.length - 1].includes(index)) return false;
      return true;
    });

const getReadline = (dataset: string) => {
  let index = 0;

  const lines = toLines(dataset);

  return () => {
    return lines[index++];
  };
};

export const getExpectLog = (fn: (...r: any) => void) => {
  const log = jest.fn();
  const realConsoleLog = console.log;
  beforeAll(() => {
    console.log = log;
  });
  afterAll(() => {
    console.log = realConsoleLog;
  });
  beforeEach(() => {
    log.mockClear();
  });

  return (inputs: string, results: string) => {
    fn(getReadline(inputs));
    expect(log.mock.calls).toEqual(toLines(results).map((r) => [r]));
  };
};
