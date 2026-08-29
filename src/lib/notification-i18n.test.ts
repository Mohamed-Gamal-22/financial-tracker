import { describe, expect, it } from "vitest";
import { localizeNotificationText } from "./notification-i18n";
import { notificationText } from "@/schemas/notification.schema";

describe("localizeNotificationText", () => {
  it("returns empty or Arabic text unchanged", () => {
    expect(localizeNotificationText("")).toBe("");
    expect(localizeNotificationText("تنبيه عربي")).toBe("تنبيه عربي");
  });

  it("translates spent X of Y patterns", () => {
    expect(localizeNotificationText("Spent 500 out of 1000")).toBe(
      "أنفقت 500 من 1000",
    );
  });

  it("translates monthly expense budget percent", () => {
    expect(
      localizeNotificationText("Monthly expense budget reached 80%"),
    ).toContain("80%");
  });

  it("maps English category names and falls back for English copy", () => {
    expect(
      localizeNotificationText("Food budget has reached 90%"),
    ).toContain("طعام");
    expect(localizeNotificationText("Something else happened")).toBe(
      "تنبيه بخصوص ميزانيتك",
    );
  });

  it("covers remaining budget alert patterns", () => {
    expect(
      localizeNotificationText("Warning: reached 70% of budget for Transport."),
    ).toContain("مواصلات");
    expect(
      localizeNotificationText(
        "You have reached 85% of your budget for Shopping.",
      ),
    ).toContain("تسوق");
    expect(
      localizeNotificationText(
        "Your spending on Coffee has reached 60%",
      ),
    ).toContain("قهوة");
    expect(
      localizeNotificationText("Budget for Rent has exceeded 95%"),
    ).toContain("إيجار");
    expect(
      localizeNotificationText("Groceries is at 50% of your budget"),
    ).toContain("بقالة");
    expect(
      localizeNotificationText("Alert threshold expense limit category Food"),
    ).toMatch(/تنبيه/);
    expect(localizeNotificationText("Budget alert 40%")).toContain("40%");
  });
});

describe("notificationText", () => {
  it("prefers message, then body, then title", () => {
    expect(
      notificationText({ _id: "1", message: "تنبيه", title: "عنوان" }),
    ).toBe("تنبيه");
    expect(notificationText({ _id: "1", body: "نص", title: "عنوان" })).toBe(
      "نص",
    );
    expect(notificationText({ _id: "1", title: "عنوان" })).toBe("عنوان");
    expect(notificationText({ _id: "1" })).toBe("إشعار جديد");
  });
});
