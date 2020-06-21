import { getRandomInt } from "@/lib/random_int";

describe("random int", () => {
  test("get one random int ", () => {
    expect(getRandomInt(1, 2)).toBe(1);
  });
});
