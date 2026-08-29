import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertProvider } from "@/app/(auth)/alerts";
import DashboardPage from "./page";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "user-new", email: "newuser@example.com", name: "مستخدم جديد" } },
    status: "authenticated",
  }),
  signOut: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const mockAuthUser = {
  id: "user-new",
  email: "newuser@example.com",
  fullname: "مستخدم جديد",
};

let mockAuthStatus = "authenticated";
let mockAuthData: { id: string; email: string; fullname: string } | null = mockAuthUser;

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: mockAuthData,
    status: mockAuthStatus,
    accessToken: "test-token",
    isAuthenticated: mockAuthStatus === "authenticated",
    isLoading: mockAuthStatus === "loading",
    logout: vi.fn(),
  }),
}));

const mockSummaryFn = vi.fn();
vi.mock("@/services/api/transaction", () => ({
  getTransactionSummary: (month: string) => mockSummaryFn(month),
  getRecentTransactions: vi.fn().mockResolvedValue({ data: [] }),
  getTransactionExpensesByCategory: vi.fn().mockResolvedValue({ data: [] }),
  createTransaction: vi.fn().mockResolvedValue({ success: true, message: "ok" }),
  getTransactionsCount: vi.fn().mockResolvedValue({ data: { count: 0 } }),
  getTransactions: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("@/services/api/monthlyBudget", () => ({
  getMonthlyBudgetByMonth: vi.fn().mockResolvedValue({ data: null }),
}));

describe("DashboardPage Onboarding Modal", () => {
  beforeEach(() => {
    localStorage.clear();
    mockAuthStatus = "authenticated";
    mockAuthData = mockAuthUser;
    mockSummaryFn.mockReset();
  });

  it("shows the onboarding modal when a new user has 0 financial activity", async () => {
    mockSummaryFn.mockResolvedValue({
      data: {
        income: [],
        expense: [],
        savings: [],
      },
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <DashboardPage />
        </AlertProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("طريقة الاستخدام — خطوة بخطوة")).toBeInTheDocument();
    });

    expect(screen.getByText("ابدأ أولًا بدخل الشهر")).toBeInTheDocument();
  });

  it("does not show onboarding modal if user already has transactions in this month", async () => {
    mockSummaryFn.mockResolvedValue({
      data: {
        income: [{ category: "income", count: 1, total: 5000 }],
        expense: [],
        savings: [],
      },
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <DashboardPage />
        </AlertProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(mockSummaryFn).toHaveBeenCalled();
    });

    expect(screen.queryByText("طريقة الاستخدام — خطوة بخطوة")).not.toBeInTheDocument();
  });
});
