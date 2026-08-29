import { beforeEach, describe, expect, it } from "vitest";
import {
  consumePendingFullname,
  rememberPendingFullname,
} from "./pending-name";

describe("pending-name", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("remembers and consumes matching email case-insensitively", () => {
    rememberPendingFullname("User@Example.com", "أحمد محمد");
    expect(consumePendingFullname("user@example.com")).toBe("أحمد محمد");
    expect(consumePendingFullname("user@example.com")).toBeNull();
  });

  it("returns null on email mismatch", () => {
    rememberPendingFullname("a@b.com", "Name Here");
    expect(consumePendingFullname("other@b.com")).toBeNull();
  });
});
