import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/app/(auth)/alerts", () => ({
  useAlert: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/api/user", () => ({
  updateUserName: vi.fn(),
}));

import { useAlert } from "@/app/(auth)/alerts";
import { useAuth } from "@/hooks/useAuth";
import { updateUserName } from "@/services/api/user";
import PersonalInfoSection from "./PersonalInfoSection";

function renderSection() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PersonalInfoSection fullname="أحمد محمد" email="a@b.com" />
    </QueryClientProvider>,
  );
}

describe("PersonalInfoSection", () => {
  const showAlert = vi.fn();
  const update = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAlert).mockReturnValue({ showAlert } as never);
    vi.mocked(useAuth).mockReturnValue({ update } as never);
  });

  it("enters edit mode and validates invalid names", async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByRole("button", { name: "تعديل الاسم" }));
    const input = screen.getByDisplayValue("أحمد محمد");
    await user.clear(input);
    await user.type(input, "أحمد");
    await user.click(screen.getByRole("button", { name: "حفظ الاسم" }));

    await waitFor(() => {
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ success: false }),
      );
    });
    expect(updateUserName).not.toHaveBeenCalled();
  });

  it("skips API when name is unchanged", async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole("button", { name: "تعديل الاسم" }));
    await user.click(screen.getByRole("button", { name: "حفظ الاسم" }));

    await waitFor(() => {
      expect(updateUserName).not.toHaveBeenCalled();
    });
  });
});
