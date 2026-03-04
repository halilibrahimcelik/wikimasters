import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it } from "vitest";
import { ArticlesList } from "@/components/features/wikicards/articles-list";
import { makeStore } from "@/lib/redux/store";
import type { ArticleWikiData } from "@/types/api";

const mockArticles: ArticleWikiData[] = [
  {
    id: 1,
    title: "Article 1",
    content: "Content 1",
    authorName: "Author 1",
    createdAt: new Date().toISOString(),
    imageUrl: null,
  },
  {
    id: 2,
    title: "Article 2",
    content: "Content 2",
    authorName: "Author 2",
    createdAt: new Date().toISOString(),
    imageUrl: null,
  },
];

describe("ArticlesList Component", () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    store = makeStore();
  });

  it("renders with server data", () => {
    render(
      <Provider store={store}>
        <ArticlesList serverData={mockArticles} />
      </Provider>,
    );
    expect(screen.getByText("All Articles")).toBeInTheDocument();
    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();
  });

  it("displays empty state when no articles", () => {
    render(
      <Provider store={store}>
        <ArticlesList serverData={[]} />
      </Provider>,
    );
    expect(screen.getByText("No articles found")).toBeInTheDocument();
  });

  it("renders articles in grid layout", () => {
    const { container } = render(
      <Provider store={store}>
        <ArticlesList serverData={mockArticles} />
      </Provider>,
    );
    // Verify the container is rendered
    expect(container).toBeInTheDocument();
  });

  it("displays all articles passed as props", () => {
    render(
      <Provider store={store}>
        <ArticlesList serverData={mockArticles} />
      </Provider>,
    );
    const cards = screen.getAllByRole("link");
    expect(cards.length).toBeGreaterThanOrEqual(mockArticles.length);
  });

  it("renders heading", () => {
    render(
      <Provider store={store}>
        <ArticlesList serverData={mockArticles} />
      </Provider>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("All Articles");
  });
});
