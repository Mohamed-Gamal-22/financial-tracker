import { describe, expect, it } from "vitest";
import {
  isIsoDate,
  isYearMonth,
  normalizeTxDate,
  parseIsoDate,
  parseYearMonth,
  toIsoDate,
  toYearMonth,
  yearMonthFromPeriod,
} from "./date-value";

describe("date-value helpers", () => {
  it("validates ISO date and year-month shapes", () => {
    expect(isIsoDate("2026-03-15")).toBe(true);
    expect(isIsoDate("2026-3-15")).toBe(false);
    expect(isIsoDate(undefined)).toBe(false);
    expect(isYearMonth("2026-03")).toBe(true);
    expect(isYearMonth("2026-03-15")).toBe(false);
  });

  it("parses valid calendar dates and rejects invalid ones", () => {
    expect(parseIsoDate("2026-02-28")).toBeInstanceOf(Date);
    expect(parseIsoDate("2026-02-30")).toBeUndefined();
    expect(parseYearMonth("2026-02")).toBeInstanceOf(Date);
    expect(parseYearMonth("bad")).toBeUndefined();
  });

  it("round-trips Date to ISO / year-month", () => {
    const date = new Date(2026, 2, 15);
    expect(toIsoDate(date)).toBe("2026-03-15");
    expect(toYearMonth(date)).toBe("2026-03");
  });

  it("extracts year-month from period strings", () => {
    expect(yearMonthFromPeriod("2026-03")).toBe("2026-03");
    expect(yearMonthFromPeriod("2026-03-15")).toBe("2026-03");
    expect(yearMonthFromPeriod("garbage")).toBe("");
    expect(yearMonthFromPeriod()).toBe("");
  });

  it("normalizes transaction dates", () => {
    expect(normalizeTxDate("2026-03-15")).toBe("2026-03-15");
    expect(normalizeTxDate("2026-03-15T12:00:00.000Z")).toBe("2026-03-15");
    expect(normalizeTxDate("")).toBe("");
    expect(normalizeTxDate("not-a-date")).toBe("not-a-date");
  });
});
