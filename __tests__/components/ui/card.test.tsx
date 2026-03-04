import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

describe("Card Component", () => {
  it("renders card with content", () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>,
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders card with title", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>,
    );
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("applies proper styling classes", () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>,
    );
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass("bg-card");
    expect(cardElement).toHaveClass("text-card-foreground");
  });

  it("renders multiple children", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </CardContent>
      </Card>,
    );
    expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
    expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
  });
});
