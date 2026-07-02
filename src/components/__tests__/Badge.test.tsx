import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "../ui/Badge";

describe("Badge", () => {
  it("renders its children in a pill", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge).toHaveClass("rounded-full", "px-md", "py-xs", "text-xs", "font-medium");
  });

  it("defaults to the primary variant", () => {
    render(<Badge>Primary</Badge>);
    expect(screen.getByText("Primary")).toHaveClass("bg-primary", "text-on-primary");
  });

  it("pairs the mint secondary variant with fixed dark ink", () => {
    render(<Badge variant="secondary">Vegan</Badge>);
    expect(screen.getByText("Vegan")).toHaveClass("bg-secondary", "text-[#131313]");
  });

  it("applies the neutral variant classes", () => {
    render(<Badge variant="neutral">Neutral</Badge>);
    expect(screen.getByText("Neutral")).toHaveClass("bg-elevated", "text-fg");
  });

  it("applies the danger variant classes", () => {
    render(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText("Danger")).toHaveClass("bg-danger", "text-on-primary");
  });
});
