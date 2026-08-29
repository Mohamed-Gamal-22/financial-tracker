import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("../../alerts", () => ({
  useAlert: vi.fn(),
}));

vi.mock("@/components/auth/AuthDividerWithGoogle", () => ({
  default: () => <div data-testid="google-divider" />,
}));

vi.mock("@/services/auth/pending-name", () => ({
  consumePendingFullname: vi.fn(() => null),
}));

vi.mock("@/services/auth/session-utils", async () => {
  const actual = await vi.importActual<
    typeof import("@/services/auth/session-utils")
  >("@/services/auth/session-utils");
  return {
    ...actual,
    clearLegacyAuthStorage: vi.fn(),
  };
});

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAlert } from "../../alerts";
import LoginForm from "./LoginForm";

function renderLogin() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

describe("LoginForm", () => {
  const showAlert = vi.fn();
  const push = vi.fn();
  const refresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAlert).mockReturnValue({ showAlert } as never);
    vi.mocked(useRouter).mockReturnValue({ push, refresh } as never);
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === "callbackUrl" ? "/transactions" : null),
    } as never);
  });

  it("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(
      screen.getByRole("button", { name: "تسجيل الدخول إلى الحساب" }),
    );
    await waitFor(() => {
      expect(
        screen.getAllByText(/البريد الإلكتروني غير صالح|كلمة المرور/).length,
      ).toBeGreaterThan(0);
    });
  });

  it("signs in and navigates on success", async () => {
    const user = userEvent.setup();
    vi.mocked(signIn).mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: "/transactions",
    } as never);

    renderLogin();
    await user.type(
      screen.getByPlaceholderText("name@company.com"),
      "user@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "Passw0rd!");
    await user.click(
      screen.getByRole("button", { name: "تسجيل الدخول إلى الحساب" }),
    );

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({
          email: "user@example.com",
          password: "Passw0rd!",
          redirect: false,
        }),
      );
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
      expect(push).toHaveBeenCalledWith("/transactions");
    });
  });

  it("alerts on query error param", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === "error" ? "CredentialsSignin" : null),
    } as never);
    renderLogin();
    expect(showAlert).toHaveBeenCalledWith({
      message: "بيانات الدخول غير صحيحة",
      success: false,
    });
  });
});
