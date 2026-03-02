"use server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

const RequestBodySchema = z.object({
  prompt: z.object({
    text: z.string(),
    content: z
      .string()
      .min(10, "Content is too short")
      .max(7000, "Content too large"), // ✅ validation rules
  }),
});
// ✅ define response types
export type AISuccessResponse = {
  created: number;
  content: string;
};

export type AIErrorResponse = {
  error: string;
};

type AIResponse = AISuccessResponse | AIErrorResponse;

type OpenRouterMessage = {
  role: string;
  content: string;
};

type OpenRouterChoice = {
  index: number;
  finish_reason: string;
  message: OpenRouterMessage;
  logprobs: null | object;
};
type OpenRouterResponse = {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: OpenRouterChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost: number;
  };
};
export const POST = async (
  request: NextRequest,
): Promise<NextResponse<AIResponse>> => {
  try {
    const {
      prompt: { text, content },
    } = RequestBodySchema.parse(await request.json()); // ✅ validated + typed
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL ?? "", // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": process.env.SITE_NAME ?? "", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5-nano",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text,
                },
                {
                  type: "text",
                  text: content,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch {
        // ignore body parsing errors for non-OK responses
      }
      const status =
        response.status >= 400 && response.status <= 599
          ? response.status
          : 502;
      return NextResponse.json<AIErrorResponse>(
        {
          error:
            errorText ||
            `Upstream OpenRouter error: ${response.status} ${response.statusText}`,
        },
        { status },
      );
    }

    let rawData: unknown;
    try {
      rawData = await response.json();
    } catch {
      return NextResponse.json<AIErrorResponse>(
        { error: "Failed to parse response from AI provider" },
        { status: 502 },
      );
    }

    const data = rawData as Partial<OpenRouterResponse>;
    const choice = data.choices?.[0];
    const messageContent =
      choice?.message && typeof choice.message.content === "string"
        ? choice.message.content
        : undefined;

    if (typeof data.created !== "number" || !messageContent) {
      return NextResponse.json<AIErrorResponse>(
        { error: "Invalid response from AI provider" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        created: data.created,
        content: messageContent,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<AIErrorResponse>(
        {
          error: error.message,
        },
        { status: 400 },
      );
    }
    console.error("API Error:", error);
    return NextResponse.json<AIErrorResponse>(
      {
        error: "Failed to process the prompt",
      },
      { status: 500 },
    );
  }
};
