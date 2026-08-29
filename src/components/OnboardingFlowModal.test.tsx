import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OnboardingFlowModal from "./OnboardingFlowModal";

describe("OnboardingFlowModal", () => {
  it("returns null when closed", () => {
    const { container } = render(
      <OnboardingFlowModal
        open={false}
        step={1}
        onAddIncome={vi.fn()}
        onNextStep={vi.fn()}
        onGoToTransactions={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows step 1 CTA and dismisses on Escape / backdrop", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onAddIncome = vi.fn();
    const onNextStep = vi.fn();

    render(
      <OnboardingFlowModal
        open
        step={1}
        onAddIncome={onAddIncome}
        onNextStep={onNextStep}
        onGoToTransactions={vi.fn()}
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByText("ابدأ أولًا بدخل الشهر")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "فهمت" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "أضف دخل الشهر" }));
    expect(onAddIncome).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "التالي" }));
    expect(onNextStep).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "إغلاق" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    onDismiss.mockClear();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("shows step 2 content and handles actions", async () => {
    const user = userEvent.setup();
    const onGoToBudget = vi.fn();
    const onNextStep = vi.fn();
    const onPrevStep = vi.fn();

    render(
      <OnboardingFlowModal
        open
        step={2}
        onAddIncome={vi.fn()}
        onNextStep={onNextStep}
        onPrevStep={onPrevStep}
        onGoToBudget={onGoToBudget}
        onGoToTransactions={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    expect(
      screen.getByText("حدّد ميزانية الشهر (اختياري)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/الميزانيات القديمة/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "الذهاب إلى الميزانية" }));
    expect(onGoToBudget).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "السابق" }));
    expect(onPrevStep).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "التالي" }));
    expect(onNextStep).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole("button", { name: "فهمت" })).not.toBeInTheDocument();
  });

  it("shows step 3 content and handles actions", async () => {
    const user = userEvent.setup();
    const onGoToTransactions = vi.fn();
    const onPrevStep = vi.fn();
    const onDismiss = vi.fn();

    render(
      <OnboardingFlowModal
        open
        step={3}
        onAddIncome={vi.fn()}
        onNextStep={vi.fn()}
        onPrevStep={onPrevStep}
        onGoToTransactions={onGoToTransactions}
        onDismiss={onDismiss}
      />,
    );

    expect(
      screen.getByText("بعدين سجّل معاملاتك ومصروفاتك"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "الذهاب إلى المعاملات" }),
    );
    expect(onGoToTransactions).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "السابق" }));
    expect(onPrevStep).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "فهمت" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
