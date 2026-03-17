"use client";

import {
  Calendar,
  ChevronRight,
  CopyIcon,
  Edit,
  Eye,
  Facebook,
  Home,
  Link2,
  Linkedin,
  Share2,
  Trash,
  Twitter,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useActionState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { deleteArticleForm } from "@/app/actions/articles";
import { incrementPageViews } from "@/app/actions/pageViews";
import { AISuccessResponse } from "@/app/api/ai/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ShinyText from "@/components/ui/shiny-text";
import TextType from "@/components/ui/text-type";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { Routes } from "@/types";
import { ArticleWikiData } from "@/types/api";

interface WikiArticleViewerProps {
  article: ArticleWikiData;
  canEdit?: boolean;
  pageviews?: number | null;
}

const WikiArticleViewer: React.FC<WikiArticleViewerProps> = ({
  article,
  canEdit = false,
  pageviews,
}) => {
  const [deleteState, deleteAction] = useActionState(deleteArticleForm, null);
  const [localPageViews, setLocalPageViews] = React.useState<number>(
    pageviews ?? 0,
  );

  useEffect(() => {
    if (deleteState?.error) {
      toast.error(deleteState.error);
    }
  }, [deleteState]);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const articleRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleCopyText = async () => {
    if (summary) {
      if (!navigator?.clipboard?.writeText) {
        toast.error("Copy to clipboard is not supported in this browser.", {
          position: "bottom-left",
          duration: 2500,
        });
        return;
      }
      try {
        await navigator.clipboard.writeText(summary);
        toast.success("Summary copied to clipboard!", {
          position: "bottom-left",
          duration: 2500,
        });
      } catch {
        toast.error("Failed to copy summary to clipboard.", {
          position: "bottom-left",
          duration: 2500,
        });
      }
    }
  };
  useEffect(() => {
    const sessionKey = `pageview_counted_${article.id}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    let isMounted = true;

    const fetchPageView = async () => {
      const newCount = await incrementPageViews(article.id);
      if (isMounted) {
        setLocalPageViews(newCount);
        sessionStorage.setItem(sessionKey, "1");
      }
    };

    fetchPageView();

    return () => {
      isMounted = false;
    };
  }, [article.id]);
  useEffect(() => {
    if (summary && articleRef.current) {
      articleRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [summary]);
  const handleSummarizeArticle = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsSummarizing(true);
      const response = await fetch("/api/ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: "Summarize the following article content in 2-3 sentences:Focus on the main idea and the most important details a reader should remember. Do not add opinions or unrelated information. The point is that readers can see the summary a glance and decide if they want to read more\n\n",
            content: article.content,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      const data: AISuccessResponse = await response.json();
      if (data.created) {
        setIsSummarizing(false);
        setSummary(data.content);
      }
    } catch (error) {
      console.log(
        "Error summarizing article:",
        error instanceof Error ? error.message : error,
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleShareSocial = (platform: "twitter" | "facebook" | "linkedin") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
    };
    window.open(
      shareUrls[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=450",
    );
  };

  const handleCopyLink = async () => {
    if (!navigator.clipboard) {
      toast.error("Copy to clipboard is not supported in this browser.", {
        position: "bottom-left",
        duration: 2500,
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        position: "bottom-left",
        duration: 2500,
      });
    } catch {
      toast.error("Failed to copy link.", {
        position: "bottom-left",
        duration: 2500,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {article.title}
          </h1>

          {/* Article Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>By {article.authorName ?? "Unknown"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(article.createdAt ?? "")}</span>
            </div>
            <div className="flex items-center">
              <Badge variant="secondary">Article</Badge>
            </div>
            <div className="flex items-center ">
              <Badge color="" className="">
                <Eye className="h-4 w-4 mr-1" /> {localPageViews ?? ""} views
              </Badge>
            </div>
          </div>
        </div>

        {/* Edit Button - Only shown if user has edit permissions */}
        {canEdit && (
          <div className="ml-4 flex items-center gap-2">
            <Link href={`/wiki/edit/${article.id}`} className="cursor-pointer">
              <Button variant="outline" className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit Article
              </Button>
            </Link>

            {/* Delete form calls the server action wrapper */}
            <form action={deleteAction}>
              <input type="hidden" name="id" value={String(article.id)} />
              <Button
                type="submit"
                variant="destructive"
                className="ml-2 cursor-pointer"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Article Content */}
      <Card>
        <CardContent className="pt-20 relative max-h-[600px] overflow-auto">
          {/* Article Image - Display if exists */}
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <Button
                  {...props}
                  disabled={isSummarizing}
                  onClick={handleSummarizeArticle}
                  variant={"secondary"}
                  className={
                    "cursor-pointer absolute top-0 right-4 hover:scale-102 transition-transform duration-200"
                  }
                >
                  <ShinyText
                    text={isSummarizing ? "Summarizing..." : "✨ Summerize "}
                    speed={1.3}
                    delay={0}
                    color="#0b0101"
                    shineColor="#fdc700"
                    spread={60}
                    direction="left"
                    yoyo={true}
                    pauseOnHover={false}
                    disabled={false}
                  />
                </Button>
              )}
            ></TooltipTrigger>
            <TooltipContent>
              <p>You can summarize the article by clicking the button above.</p>
            </TooltipContent>
          </Tooltip>

          {article.imageUrl && (
            <div className="mb-8">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={`Image for ${article.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Rendered Markdown Content */}
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Customize heading styles
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                // Customize paragraph styles
                p: ({ children }) => (
                  <p className="mb-4 text-foreground leading-7">{children}</p>
                ),
                // Customize list styles
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc text-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal text-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-foreground">{children}</li>
                ),
                // Customize code styles
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                    {children}
                  </pre>
                ),
                // Customize blockquote styles
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                // Customize link styles
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // Customize table styles
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
      {summary && !isSummarizing && (
        <Card
          ref={articleRef}
          id="article-summary"
          className="mt-6 bg-muted relative pt-12"
        >
          <Button
            onClick={handleCopyText}
            title="Copy Your Text"
            variant={"destructive"}
            className={"absolute right-4 top-4"}
            size={"icon-lg"}
          >
            <CopyIcon />
          </Button>
          <CardContent>
            <CardTitle className="text-2xl font-bold text-foreground mb-4">
              Article Summary
            </CardTitle>
            <TextType
              text={[summary]}
              loop={false}
              typingSpeed={10}
              showCursor={false}
              pauseDuration={1500}
              hideCursorWhileTyping={true}
              cursorCharacter="_"
              deletingSpeed={50}
              cursorBlinkDuration={0.5}
              variableSpeed={undefined}
              onSentenceComplete={undefined}
            />
          </CardContent>
        </Card>
      )}

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col gap-6">
        {/* Social Share Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Share2 className="h-4 w-4" />
            <span>Share this article:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2 hover:bg-[#1da1f2] hover:text-white hover:border-[#1da1f2] transition-colors"
              onClick={() => handleShareSocial("twitter")}
            >
              <Twitter className="h-4 w-4" />
              Twitter / X
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-colors"
              onClick={() => handleShareSocial("facebook")}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2 hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2] transition-colors"
              onClick={() => handleShareSocial("linkedin")}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2 hover:bg-muted transition-colors"
              onClick={handleCopyLink}
            >
              <Link2 className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant={"secondary"}
            nativeButton={false}
            render={(props) => <Link {...props} href={Routes.HOME} />}
          >
            Back to Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WikiArticleViewer;
