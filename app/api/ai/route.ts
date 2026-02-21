"use server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestBodySchema = z.object({
  prompt: z.object({
    text: z.string(),
    content: z.string(),
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
  const {
    prompt: { text, content },
  } = RequestBodySchema.parse(await request.json()); // ✅ validated + typed
  try {
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

    const data: OpenRouterResponse = await response.json();
    return NextResponse.json(
      {
        created: data.created,
        content: data.choices[0].message.content,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process the prompt",
      },
      {
        status: 500,
      },
    );
  }
};
