import { describe, expect, it } from "vitest";
import { updateNameSchema } from "./user.schema";
import { categoryTypeSchema } from "./category.schema";

describe("updateNameSchema", () => {
  it("delegates to fullname rules", () => {
    expect(
      updateNameSchema.safeParse({ fullname: "أحمد محمد" }).success,
    ).toBe(true);
    expect(updateNameSchema.safeParse({ fullname: "أحمد" }).success).toBe(
      false,
    );
  });
});

describe("categoryTypeSchema", () => {
  it("accepts income, expense, savings only", () => {
    expect(categoryTypeSchema.safeParse("income").success).toBe(true);
    expect(categoryTypeSchema.safeParse("expense").success).toBe(true);
    expect(categoryTypeSchema.safeParse("savings").success).toBe(true);
    expect(categoryTypeSchema.safeParse("food").success).toBe(false);
  });
});
