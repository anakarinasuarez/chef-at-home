import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServingSelector from "../ui/ServingSelector";

describe("ServingSelector", () => {
  it("renders the default none / 2 / 4 / 6 options", () => {
    render(<ServingSelector value="none" onChange={() => {}} />);

    expect(screen.getByRole("group", { name: "Serving amount" })).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("marks the active option as pressed", () => {
    render(<ServingSelector value={4} onChange={() => {}} />);
    expect(screen.getByTestId("serving-option-4")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("serving-option-2")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the chosen value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ServingSelector value="none" onChange={onChange} />);

    await user.click(screen.getByTestId("serving-option-6"));
    expect(onChange).toHaveBeenCalledWith(6);
  });
});
