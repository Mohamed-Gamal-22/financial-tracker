import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/app/(auth)/alerts", () => ({
  useAlert: vi.fn(),
}));

vi.mock("@/services/api/transaction", () => ({
  deleteTransaction: vi.fn(),
}));

import { useAlert } from "@/app/(auth)/alerts";
import { deleteTransaction } from "@/services/api/transaction";
import DeleteTransactionDialog from "./DeleteTransactionDialog";

function renderDialog(
  props: Partial<React.ComponentProps<typeof DeleteTransactionDialog>> = {},
) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  const onClose = vi.fn();
  const onDeleted = vi.fn();
  render(
    <QueryClientProvider client={client}>
      <DeleteTransactionDialog
        open
        transactionId="tx1"
        transactionTitle="قهوة"
        onClose={onClose}
        onDeleted={onDeleted}
        {...props}
      />
    </QueryClientProvider>,
  );
  return { onClose, onDeleted };
}

describe("DeleteTransactionDialog", () => {
  const showAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAlert).mockReturnValue({ showAlert } as never);
  });

  it("returns null when closed", () => {
    const { container } = render(
      <QueryClientProvider client={new QueryClient()}>
        <DeleteTransactionDialog
          open={false}
          transactionId="tx1"
          transactionTitle="قهوة"
          onClose={vi.fn()}
        />
      </QueryClientProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("closes on Escape and cancel", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();

    onClose.mockClear();
    await user.click(screen.getByRole("button", { name: "إلغاء" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("deletes and notifies on confirm", async () => {
    const user = userEvent.setup();
    vi.mocked(deleteTransaction).mockResolvedValue({
      message: "تم الحذف",
      success: true,
      status: 200,
    });
    const { onClose, onDeleted } = renderDialog();

    await user.click(screen.getByRole("button", { name: "نعم، احذف" }));

    await waitFor(() => {
      expect(deleteTransaction).toHaveBeenCalledWith("tx1");
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
      expect(onDeleted).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
