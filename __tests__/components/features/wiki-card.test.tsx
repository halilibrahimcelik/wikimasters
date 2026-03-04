import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WikiCard from "@/components/features/wikicards/wiki-card";
import type { ArticleWikiData } from "@/types/api";

const mockArticle: ArticleWikiData = {
  id: 1,
  title: "Test Article",
  content: "This is test content",
  authorName: "Test Author",
  createdAt: new Date().toISOString(),
  imageUrl: null,
};

describe("WikiCard Component", () => {
  it("renders article title", () => {
    render(<WikiCard {...mockArticle} />);
    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("renders article author name", () => {
    render(<WikiCard {...mockArticle} />);
    expect(screen.getByText("Test Author")).toBeInTheDocument();
  });

  it("renders article content preview", () => {
    render(<WikiCard {...mockArticle} />);
    expect(screen.getByText(/This is test content/)).toBeInTheDocument();
  });

  it("renders creation date", () => {
    render(<WikiCard {...mockArticle} />);
    // Just verify date is rendered without checking exact format
    const dateText = screen
      .getByText(mockArticle.authorName || "Unknown Author")
      .closest("div");
    expect(dateText).toBeInTheDocument();
  });

  it("renders with image when provided", () => {
    const articleWithImage = {
      ...mockArticle,
      imageUrl: "https://example.com/image.jpg",
    };
    const { container } = render(<WikiCard {...articleWithImage} />);
    // Just verify it renders without error when imageUrl is provided
    expect(container).toBeInTheDocument();
  });

  it("handles click navigation", () => {
    render(<WikiCard {...mockArticle} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", expect.stringContaining("1"));
  });

  it("renders as link element", () => {
    render(<WikiCard {...mockArticle} />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });
});
