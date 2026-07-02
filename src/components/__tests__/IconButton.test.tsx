import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IconButton from "../ui/IconButton";

describe("IconButton", () => {
  it("renders an accessible square button with the icon", () => {
    render(
      <IconButton aria-label="Add item">
        <svg data-testid="icon" />
      </IconButton>
    );

    const button = screen.getByRole("button", { name: "Add item" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("h-10", "w-10", "rounded-sm");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("defaults to the ghost variant", () => {
    render(<IconButton aria-label="Menu">x</IconButton>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-elevated");
  });

  it("applies the solid variant classes", () => {
    render(
      <IconButton aria-label="Save" variant="solid">
        x
      </IconButton>
    );
    expect(screen.getByRole("button")).toHaveClass("bg-primary", "text-on-primary");
  });

  it("applies the danger variant classes", () => {
    render(
      <IconButton aria-label="Delete" variant="danger">
        x
      </IconButton>
    );
    expect(screen.getByRole("button")).toHaveClass("bg-danger", "text-on-primary");
  });

  it("calls onClick when pressed", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <IconButton aria-label="Add" onClick={onClick}>
        x
      </IconButton>
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <IconButton aria-label="Add" onClick={onClick} disabled>
        x
      </IconButton>
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
