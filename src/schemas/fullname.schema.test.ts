import { describe, expect, it } from "vitest";
import { fullnameSchema } from "./fullname.schema";

describe("fullnameSchema", () => {
  it("accepts Arabic full names with 2+ words", () => {
    expect(fullnameSchema.safeParse("أحمد محمد").success).toBe(true);
    expect(fullnameSchema.safeParse("محمد علي حسن").success).toBe(true);
  });

  it("accepts English full names with 2+ words", () => {
    expect(fullnameSchema.safeParse("John Doe").success).toBe(true);
    expect(fullnameSchema.safeParse("Mary Jane Watson").success).toBe(true);
  });

  it("rejects single word names", () => {
    expect(fullnameSchema.safeParse("أحمد").success).toBe(false);
    expect(fullnameSchema.safeParse("John").success).toBe(false);
  });

  it("rejects mixed Arabic and English", () => {
    expect(fullnameSchema.safeParse("أحمد Doe").success).toBe(false);
  });

  it("rejects names with numbers or symbols", () => {
    expect(fullnameSchema.safeParse("John2 Doe").success).toBe(false);
    expect(fullnameSchema.safeParse("أحمد-محمد").success).toBe(false);
  });

  it("rejects too short or too long values", () => {
    expect(fullnameSchema.safeParse("A").success).toBe(false);
    expect(fullnameSchema.safeParse(`${"A".repeat(49)} B`).success).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const result = fullnameSchema.safeParse("  John Doe  ");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("John Doe");
  });
});
