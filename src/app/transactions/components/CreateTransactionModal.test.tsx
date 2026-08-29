import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/app/(auth)/alerts", () => ({
  useAlert: vi.fn(),
}));

vi.mock("@/services/api/transaction", () => ({
  createTransaction: vi.fn(),
  getTransactionsCount: vi.fn(),
}));

vi.mock("@/components/date/DayPickerField", () => ({
  default: () => <div data-testid="day-picker" />,
}));

import { useAlert } from "@/app/(auth)/alerts";
import {
  createTransaction,
  getTransactionsCount,
} from "@/services/api/transaction";
import CreateTransactionModal from "./CreateTransactionModal";

function renderModal(open = true) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  const onClose = vi.fn();
  const onCreated = vi.fn();
  render(
    <QueryClientProvider client={client}>
      <CreateTransactionModal
        open={open}
        onClose={onClose}
        onCreated={onCreated}
      />
    </QueryClientProvider>,
  );
  return { onClose, onCreated };
}

describe("CreateTransactionModal", () => {
  const showAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAlert).mockReturnValue({ showAlert } as never);
    vi.mocked(getTransactionsCount).mockResolvedValue(1);
  });

  it("returns null when closed", () => {
    const { container } = render(
      <QueryClientProvider client={new QueryClient()}>
        <CreateTransactionModal open={false} onClose={vi.fn()} />
      </QueryClientProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows dialog and validates empty submit", async () => {
    const user = userEvent.setup();
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "حفظ المعاملة" }));
    await waitFor(() => {
      expect(screen.getAllByText(/مطلوب|اختر تصنيف/).length).toBeGreaterThan(0);
    });
    expect(createTransaction).not.toHaveBeenCalled();
  });
});
