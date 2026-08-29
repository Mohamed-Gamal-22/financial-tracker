import { describe, expect, it } from "vitest";
import {
  apiAlertMessage,
  normalizeAlertMessage,
} from "./normalizeAlertMessage";

describe("apiAlertMessage / normalizeAlertMessage", () => {
  it("uses fallback for empty or Done messages", () => {
    expect(apiAlertMessage(undefined, "تم")).toBe("تم");
    expect(apiAlertMessage("  ", "تم")).toBe("تم");
    expect(apiAlertMessage("Done", "تم")).toBe("تم");
    expect(apiAlertMessage("done", "تم")).toBe("تم");
  });

  it("keeps real backend messages", () => {
    expect(apiAlertMessage("تم الحفظ", "تم")).toBe("تم الحفظ");
  });

  it("normalizes bare Done to Arabic success", () => {
    expect(normalizeAlertMessage("Done")).toBe("تم بنجاح");
    expect(normalizeAlertMessage("عملية ناجحة")).toBe("عملية ناجحة");
  });
});
