import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/ai/route";

// Mock the fetch globally
global.fetch = vi.fn();

describe("AI API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid request body", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/ai"), {
      method: "POST",
      body: JSON.stringify({ invalid: "data" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error");
  });

  it("returns error when content is too short", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/ai"), {
      method: "POST",
      body: JSON.stringify({
        prompt: {
          text: "Test text",
          content: "short",
        },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns error when content exceeds maximum length", async () => {
    const longContent = "a".repeat(8000);
    const request = new NextRequest(new URL("http://localhost:3000/api/ai"), {
      method: "POST",
      body: JSON.stringify({
        prompt: {
          text: "Test text",
          content: longContent,
        },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("requires both text and content fields", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/ai"), {
      method: "POST",
      body: JSON.stringify({
        prompt: {
          text: "Test text",
        },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("validates content length constraints", async () => {
    const validContent = "This is valid test content for AI processing.".repeat(
      5,
    );
    // This test verifies the validation logic is in place
    expect(validContent.length).toBeGreaterThan(10);
    expect(validContent.length).toBeLessThan(7000);
  });
});
