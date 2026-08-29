import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import RequireAuth from "./RequireAuth";
import GuestOnly from "./GuestOnly";
import RedirectIfAuthenticated from "./RedirectIfAuthenticated";

describe("RequireAuth", () => {
  const replace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ replace } as never);
    vi.mocked(usePathname).mockReturnValue("/dashboard");
  });

  it("shows loading while auth is loading or unauthenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    } as never);
    render(
      <RequireAuth>
        <div>secret</div>
      </RequireAuth>,
    );
    expect(screen.getByText("جاري التحميل...")).toBeInTheDocument();
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    } as never);
    render(
      <RequireAuth>
        <div>secret</div>
      </RequireAuth>,
    );
    expect(replace).toHaveBeenCalledWith(
      "/login?callbackUrl=%2Fdashboard",
    );
  });

  it("renders children when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    } as never);
    render(
      <RequireAuth>
        <div>secret</div>
      </RequireAuth>,
    );
    expect(screen.getByText("secret")).toBeInTheDocument();
  });
});

describe("GuestOnly", () => {
  const replace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ replace } as never);
  });

  it("shows loading while auth is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    } as never);
    render(
      <GuestOnly>
        <div>guest</div>
      </GuestOnly>,
    );
    expect(screen.getByText("جاري التحميل...")).toBeInTheDocument();
  });

  it("redirects authenticated users and renders null", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    } as never);
    const { container } = render(
      <GuestOnly>
        <div>guest</div>
      </GuestOnly>,
    );
    expect(replace).toHaveBeenCalledWith("/dashboard");
    expect(container).toBeEmptyDOMElement();
  });

  it("renders children for guests", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    } as never);
    render(
      <GuestOnly>
        <div>guest</div>
      </GuestOnly>,
    );
    expect(screen.getByText("guest")).toBeInTheDocument();
  });
});

describe("RedirectIfAuthenticated", () => {
  const replace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ replace } as never);
  });

  it("redirects authenticated users away from marketing", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    } as never);
    const { container } = render(
      <RedirectIfAuthenticated>
        <div>landing</div>
      </RedirectIfAuthenticated>,
    );
    expect(replace).toHaveBeenCalledWith("/dashboard");
    expect(container).toBeEmptyDOMElement();
  });

  it("renders marketing children for guests", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    } as never);
    render(
      <RedirectIfAuthenticated>
        <div>landing</div>
      </RedirectIfAuthenticated>,
    );
    expect(screen.getByText("landing")).toBeInTheDocument();
  });
});
