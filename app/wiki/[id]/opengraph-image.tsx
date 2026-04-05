import { ImageResponse } from "next/og";
import { getArticleByIdFromDB } from "@/lib/data/articles";
import { stripMarkdown } from "@/lib/utils";

export const runtime = "edge";
export const alt = "WikiMasters Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OgImageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleOgImage({ params }: OgImageProps) {
  const { id } = await params;
  const article = await getArticleByIdFromDB(id);

  const title = article?.title ?? "WikiMasters";
  const author = article?.authorName ?? "WikiMasters";

  const description = article
    ? stripMarkdown(article.content, 120)
    : "A knowledge sharing platform.";

  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background:
            "linear-gradient(90deg, #0ea5e9 0%, #6366f1 50%, #0ea5a4 100%)",
        }}
      />

      {/* Logo / Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          W
        </div>
        <span
          style={{
            color: "#94a3b8",
            fontSize: "22px",
            fontWeight: "600",
            letterSpacing: "0.05em",
          }}
        >
          WikiMasters
        </span>
      </div>

      {/* Article Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#f8fafc",
            fontSize: title.length > 50 ? "44px" : "56px",
            fontWeight: "800",
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              color: "#94a3b8",
              fontSize: "22px",
              lineHeight: "1.5",
              maxWidth: "820px",
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            {author.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: "#64748b", fontSize: "18px" }}>
            By {author}
          </span>
        </div>
        <div
          style={{
            background: "rgba(14,165,164,0.15)",
            border: "1px solid rgba(14,165,164,0.3)",
            borderRadius: "6px",
            padding: "6px 16px",
            color: "#0ea5a4",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Read Article
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
