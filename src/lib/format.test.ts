import { afterEach, describe, expect, it, vi } from "vitest";
import {
  amountToneClass,
  categoryTypeOf,
  compareYearMonth,
  currentYearMonth,
  formatDateAr,
  formatMoney,
  resolveCategory,
  sumTotals,
} from "./format";

describe("resolveCategory / categoryTypeOf", () => {
  it("maps type strings to labeled refs", () => {
    expect(resolveCategory("income")).toEqual({
      _id: "income",
      name: "دخل",
      type: "income",
    });
    expect(resolveCategory("unknown")).toEqual({
      _id: "unknown",
      name: "—",
    });
    expect(resolveCategory(null as unknown as string)).toBeNull();
  });

  it("passes objects through and reads type / typeLabel", () => {
    const ref = { _id: "1", name: "طعام", type: "expense" as const };
    expect(resolveCategory(ref)).toBe(ref);
    expect(categoryTypeOf("savings")).toBe("savings");
    expect(categoryTypeOf(ref)).toBe("expense");
    expect(
      categoryTypeOf({ _id: "1", name: "x", typeLabel: "income" }),
    ).toBe("income");
  });
});

describe("formatMoney", () => {
  it("formats absolute amount with currency", () => {
    expect(formatMoney(1500)).toContain("ج.م");
    expect(formatMoney(-10)).toMatch(/^- /);
  });

  it("applies sign by category type when withSign is true", () => {
    expect(formatMoney(100, { withSign: true, type: "income" })).toMatch(
      /^\+ /,
    );
    expect(formatMoney(100, { withSign: true, type: "expense" })).toMatch(
      /^- /,
    );
    expect(formatMoney(100, { withSign: true, type: "savings" })).toMatch(
      /^\+ /,
    );
  });
});

describe("amountToneClass / formatDateAr / sumTotals", () => {
  it("returns tone classes by type", () => {
    expect(amountToneClass("income")).toBe("text-accent-success");
    expect(amountToneClass("expense")).toBe("text-accent-danger");
    expect(amountToneClass()).toBe("text-text-main");
  });

  it("returns raw string for invalid dates", () => {
    expect(formatDateAr("not-a-date")).toBe("not-a-date");
  });

  it("sums totals safely", () => {
    expect(sumTotals(undefined)).toBe(0);
    expect(sumTotals([])).toBe(0);
    expect(sumTotals([{ total: 10 }, { total: "5" as unknown as number }])).toBe(
      15,
    );
    expect(sumTotals([{ total: Number.NaN }])).toBe(0);
  });
});

describe("currentYearMonth / compareYearMonth", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns YYYY-MM for the current date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 25));
    expect(currentYearMonth()).toBe("2026-08");
  });

  it("compares months relative to a reference", () => {
    expect(compareYearMonth("2026-07", "2026-08")).toBe(-1);
    expect(compareYearMonth("2026-08", "2026-08")).toBe(0);
    expect(compareYearMonth("2026-09", "2026-08")).toBe(1);
    expect(compareYearMonth("bad", "2026-08")).toBe(-1);
  });
});
