import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("renders input field", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text") as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it("handles input changes", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input") as HTMLInputElement;
    if (input) fireEvent.change(input, { target: { value: "test value" } });
    expect(input?.value).toBe("test value");
  });

  it("supports type attribute", () => {
    render(<Input type="email" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.type).toBe("email");
  });

  it("supports disabled state", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renders with value prop", () => {
    const { container } = render(<Input value="initial value" readOnly />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("initial value");
  });

  it("calls onChange handler", () => {
    const handleChange = vi.fn();
    const { container } = render(<Input onChange={handleChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    if (input) fireEvent.change(input, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
