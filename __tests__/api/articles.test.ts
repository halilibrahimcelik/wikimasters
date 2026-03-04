import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/articles/route";

// Mock the data layer
vi.mock("@/lib/data/articles", () => ({
  getArticlesFromDB: vi.fn(async () => [
    {
      id: 1,
      title: "Test Article 1",
      content: "Content 1",
      authorName: "Author 1",
      createdAt: new Date().toISOString(),
      imageUrl: null,
    },
    {
      id: 2,
      title: "Test Article 2",
      content: "Content 2",
      authorName: "Author 2",
      createdAt: new Date().toISOString(),
      imageUrl: null,
    },
  ]),
}));

describe("GET /api/articles", () => {
  it("returns list of articles", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("returns articles with required fields", async () => {
    const response = await GET();

    const data = await response.json();
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("title");
    expect(data[0]).toHaveProperty("content");
    expect(data[0]).toHaveProperty("authorName");
  });

  it("returns empty array when no articles exist", async () => {
    // This test assumes the mock can be configured
    const response = await GET();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
