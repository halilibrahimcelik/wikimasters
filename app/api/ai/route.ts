"use server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { prompt } = await request.json();
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer <OPENROUTER_API_KEY>",
          "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
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
                  text: "What is in this image?",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: "https://live.staticflickr.com/3851/14825276609_098cac593d_b.jpg",
                  },
                },
              ],
            },
          ],
        }),
      },
    );
    console.log(response.json());
    return NextResponse.json(
      {
        message: `You sent: ${prompt}`,
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
