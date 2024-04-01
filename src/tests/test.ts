import { V1Swap } from "../../src/operations/V1Swap";

describe("V1Swap", () => {
  it("should execute the swap transaction on-chain without errors", async () => {
    // Call the function and ensure it doesn't throw any errors
    await expect(V1Swap()).resolves.not.toThrow();
  });
});