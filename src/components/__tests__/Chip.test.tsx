import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Chip from "../ui/Chip";

describe("Chip", () => {
  it("renders an unselected chip with the outlined look", () => {
    render(<Chip>4</Chip>);
    const chip = screen.getByRole("button", { name: "4" });
    expect(chip).toHaveClass("border-primary", "text-primary");
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("renders the selected chip with the mint fill", () => {
    render(<Chip selected>4</Chip>);
    const chip = screen.getByRole("button", { name: "4" });
    expect(chip).toHaveClass("bg-secondary", "border-secondary", "text-[#131313]");
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onClick when pressed", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Chip onClick={onClick}>2</Chip>);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
