import { describe, expect, it } from "vitest";
import { matchesTransactionTitle } from "./transaction-search";

describe("matchesTransactionTitle", () => {
  it("returns true for empty or whitespace queries", () => {
    expect(matchesTransactionTitle("راتب", "")).toBe(true);
    expect(matchesTransactionTitle("راتب", "   ")).toBe(true);
  });

  it("matches case-insensitively and partially", () => {
    expect(matchesTransactionTitle("Grocery Store", "grocery")).toBe(true);
    expect(matchesTransactionTitle("Grocery Store", "STORE")).toBe(true);
    expect(matchesTransactionTitle("راتب", "مصروف")).toBe(false);
  });
});
