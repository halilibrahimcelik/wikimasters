"use server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

const RequestBodySchema = z.object({
  prompt: z.object({
    text: z.string(),
    content: z
      .string()
      .min(5, "Content is too short")
      .max(7000, "Content too large"),
  }),
  max_tokens: z.number().int().min(10).max(4000).optional(),
});

/** @deprecated Route now streams plain text. Kept for backward-compat imports. */
export type AISuccessResponse = {
  created: number;
  content: string;
};

export type AIErrorResponse = {
  error: string;
};

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    const {
      prompt: { text, content },
      max_tokens = 40,
    } = RequestBodySchema.parse(await request.json());

    const upstream = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL ?? "",
          "X-Title": process.env.SITE_NAME ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          stream: true,
          max_tokens,
          messages: [
            {
              role: "system",
              content: text,
            },
            {
              role: "user",
              content,
            },
          ],
        }),
      },
    );

    if (!upstream.ok || !upstream.body) {
      const status =
        upstream.status >= 400 && upstream.status <= 599
          ? upstream.status
          : 502;
      return NextResponse.json<AIErrorResponse>(
        { error: `Upstream error: ${upstream.status} ${upstream.statusText}` },
        { status },
      );
    }

    // Parse SSE from OpenRouter and stream plain text tokens to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = upstream.body.getReader();

    const stream = new ReadableStream({
      async pull(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // skip malformed SSE chunks
            }
          }
        }
      },
      cancel() {
        reader.cancel();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<AIErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
    console.error("API Error:", error);
    return NextResponse.json<AIErrorResponse>(
      { error: "Failed to process the prompt" },
      { status: 500 },
    );
  }
};
