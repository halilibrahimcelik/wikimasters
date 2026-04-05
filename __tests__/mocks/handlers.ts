import { HttpResponse, http } from "msw";

// Mock Stack Auth handlers
export const stackAuthHandlers = [
  http.post("*/auth/sign-in", () => {
    return HttpResponse.json({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        displayName: "Test User",
      },
      session: { id: "test-session-id" },
    });
  }),

  http.post("*/auth/sign-up", () => {
    return HttpResponse.json({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        displayName: "Test User",
      },
      session: { id: "test-session-id" },
    });
  }),

  http.post("*/auth/sign-out", () => {
    return HttpResponse.json({ success: true });
  }),

  http.get("*/user", () => {
    return HttpResponse.json({
      id: "test-user-id",
      email: "test@example.com",
      displayName: "Test User",
    });
  }),
];

// Mock Articles API handlers
export const articlesHandlers = [
  http.get("/api/articles", () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Test Article 1",
        content: "This is a test article",
        authorName: "Test User",
        createdAt: new Date().toISOString(),
        imageUrl: null,
      },
      {
        id: 2,
        title: "Test Article 2",
        content: "This is another test article",
        authorName: "Test User",
        createdAt: new Date().toISOString(),
        imageUrl: null,
      },
    ]);
  }),

  http.get("/api/articles/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: `Article ${params.id}`,
      content: "This is test content",
      authorName: "Test User",
      createdAt: new Date().toISOString(),
      imageUrl: null,
    });
  }),

  http.post("/api/articles", () => {
    return HttpResponse.json({
      id: 3,
      title: "New Article",
      content: "New content",
      authorName: "Test User",
      createdAt: new Date().toISOString(),
      imageUrl: null,
    });
  }),
];

// Mock AI API handlers
export const aiHandlers = [
  http.post("/api/ai", () => {
    return HttpResponse.json({
      created: Date.now(),
      content: "This is a test AI suggestion for your article content.",
    });
  }),
];

// Combine all handlers
export const allHandlers = [
  ...stackAuthHandlers,
  ...articlesHandlers,
  ...aiHandlers,
];
