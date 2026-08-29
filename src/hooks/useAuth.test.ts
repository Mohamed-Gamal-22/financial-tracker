import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockClear = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    clear: mockClear,
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/services/api/user", () => ({
  logoutUser: vi.fn(),
}));

vi.mock("@/services/auth/session-utils", () => ({
  clearLegacyAuthStorage: vi.fn(),
}));

import { signOut, useSession } from "next-auth/react";
import { logoutUser } from "@/services/api/user";
import { clearLegacyAuthStorage } from "@/services/auth/session-utils";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("maps authenticated session user", () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { id: "1", email: "a@b.com", fullname: "أحمد محمد" },
        accessToken: "tok",
      },
      status: "authenticated",
      update: vi.fn(),
    } as never);

    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: "1",
      email: "a@b.com",
      fullname: "أحمد محمد",
    });
    expect(result.current.accessToken).toBe("tok");
  });

  it("clears session and query client even when logout API fails", async () => {
    mockClear.mockClear();
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { id: "1", email: "a@b.com", fullname: "أحمد" },
        accessToken: "tok",
      },
      status: "authenticated",
      update: vi.fn(),
    } as never);
    vi.mocked(logoutUser).mockRejectedValue(new Error("network"));
    vi.mocked(signOut).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.logout("/login");
    });

    expect(logoutUser).toHaveBeenCalledWith("one");
    expect(mockClear).toHaveBeenCalledTimes(1);
    expect(clearLegacyAuthStorage).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
