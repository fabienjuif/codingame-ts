import { main } from "./equivalent-resistance-circuit-building";
import { getExpectLog } from "./testUtils";

describe("equivalent-resistance-circuit-building", () => {
  const expectResults = getExpectLog(main);

  test("data test 03", () => {
    expectResults(
      `
        3
        A 24
        B 8
        C 48
        [ ( A B ) [ C A ] ]
      `,
      "10.7"
    );
  });
});
