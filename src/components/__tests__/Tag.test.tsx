import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tag from "../ui/Tag";

describe("Tag", () => {
  it("renders its label with elevated token styling", () => {
    render(<Tag>Tomato</Tag>);
    const tag = screen.getByText("Tomato");
    expect(tag).toHaveClass("bg-elevated", "border", "border-border", "rounded-sm");
  });

  it("has no remove button by default", () => {
    render(<Tag>Basil</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a remove button and calls onRemove when clicked", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove Basil">
        Basil
      </Tag>
    );

    const removeButton = screen.getByRole("button", { name: "Remove Basil" });
    await user.click(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
