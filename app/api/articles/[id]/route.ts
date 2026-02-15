import { NextRequest, NextResponse } from "next/server";
import { getArticleByIdFromDB } from "@/lib/data/articles";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const article = await getArticleByIdFromDB(id);
    return NextResponse.json(article);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}
