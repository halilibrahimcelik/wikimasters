"use client";

import { useUser } from "@stackframe/stack";
import MDEditor from "@uiw/react-md-editor";
import { Upload, X } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  CreateArticleInput,
  createArticle,
  UpdateArticleInput,
  updateArticle,
} from "@/app/actions/articles";
import { uploadFile } from "@/app/actions/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ShinyText from "@/components/ui/shiny-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { debounce } from "@/lib/utils";
import { Routes } from "@/types";

interface WikiEditorProps {
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
  articleId?: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

const WikiEditor: React.FC<WikiEditorProps> = ({
  initialTitle = "",
  initialContent = "",
  isEditing = false,
  articleId,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchedSentenceRef = useRef<string>("");
  const aiSuggestionRef = useRef<string>("");
  const contentRef = useRef<string>(content);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  // AI completion fetch - streams tokens as they arrive
  const fetchAICompletion = useCallback(async (value: string) => {
    const raw = value.trim();
    if (raw.length < 10) return;

    const sentences = raw.split(/(?<=[.!?\n])\s+/);
    const lastSentence = sentences[sentences.length - 1]?.trim() ?? "";
    if (lastSentence.length < 5) return;

    if (lastSentence === lastFetchedSentenceRef.current) return;
    lastFetchedSentenceRef.current = lastSentence;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    aiSuggestionRef.current = "";
    setAiSuggestion("");

    const aiPayload = {
      prompt: {
        text: `You are an inline writing assistant embedded in a wiki editor.
You will receive the user's last sentence only. Your job is to suggest what comes next inline.

Rules:
- Focus ONLY on the last sentence provided, ignore any broader topic
- Detect if the sentence is incomplete by looking for missing verbs or cut-off phrases
- If the sentence is incomplete, finish it naturally
- If the sentence is complete, suggest only the very start of the next sentence (max 10 words)
- Output ONLY the raw continuation text — no punctuation at the start, no explanations
- Never repeat words already in the last sentence
- Keep it under 12 words`,
        content: lastSentence,
      },
    };

    try {
      const response = await fetch("/api/ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiPayload),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const token = decoder.decode(value, { stream: true });
        aiSuggestionRef.current += token;
        setAiSuggestion((prev) => prev + token);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        lastFetchedSentenceRef.current = "";
        return;
      }
      console.error("AI fetch error:", error);
    }
  }, []);

  const handlePolishArticle = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsPolishing(true);

    try {
      const response = await fetch("/api/ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: `You are an expert article editor embedded in a wiki editor.
You will receive the full article content. Your job is to polish it into a clean, professional final draft.

Rules:
- Preserve the original meaning, facts, and structure — do not invent or remove information
- Fix grammar, punctuation, and spelling errors always enhance readability and flow
- Improve sentence clarity: break up run-ons, vary sentence length, eliminate redundancy
- Upgrade weak or vague word choices to more precise, engaging alternatives
- Ensure smooth transitions between paragraphs and ideas
- Keep the author's voice — do not make it sound generic or AI-generated
- Preserve all Markdown formatting (headings, bold, lists, code blocks, links)
- Output ONLY the polished article content — no preamble, no explanations, no commentary`,
            content,
          },
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const err = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      setIsPolishing(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setContent(accumulated);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.log(
        "Error polishing article:",
        error instanceof Error ? error.message : error,
      );
    } finally {
      setIsPolishing(false);
    }
  };

  // Debounced wrapper - waits 1200ms after user stops typing
  const debouncedFetch = useRef(
    debounce(async (value: unknown) => {
      await fetchAICompletion(value as string);
    }, 800),
  ).current;

  // Cancel pending debounce and abort in-flight request on unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
      abortControllerRef.current?.abort();
    };
  }, [debouncedFetch]);

  // Capture Tab before MDEditor intercepts it (MDEditor calls stopPropagation on Tab for indentation)
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;
    const textarea = container.querySelector("textarea");
    if (!textarea) return;

    const handleNativeTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const suggestion = aiSuggestionRef.current;
      if (!suggestion) return;
      e.preventDefault();
      e.stopPropagation();
      const current = contentRef.current;
      const joined = current.endsWith(" ")
        ? current + suggestion
        : `${current} ${suggestion}`;
      contentRef.current = joined;
      aiSuggestionRef.current = "";
      setContent(joined);
      setAiSuggestion("");
      lastFetchedSentenceRef.current = "";
    };

    textarea.addEventListener("keydown", handleNativeTab, true); // capture phase
    return () => textarea.removeEventListener("keydown", handleNativeTab, true);
  }, []);

  const handleContentChange = useCallback(
    (val: string | undefined) => {
      const newValue = val || "";
      contentRef.current = newValue;
      setContent(newValue);
      aiSuggestionRef.current = "";
      setAiSuggestion("");
      debouncedFetch(newValue);
    },
    [debouncedFetch],
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //console.log("joined version", content);
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;
      console.log("Files to upload:", files);

      if (files.length > 0) {
        const fd = new FormData();
        fd.append("files", files[0]); // For simplicity, only handle the first file
        console.log("FormData prepared for upload:", fd.get("files"));
        const uploaded = await uploadFile(fd);
        imageUrl = uploaded.url;
      }
      const payload: UpdateArticleInput = {
        title: title.trim(),
        content: content.trim(),
        imageUrl,
      };
      console.log("Payload for article:", payload);
      if (isEditing && articleId) {
        await updateArticle(articleId, payload);
        toast.success("Article updated successfully");
      } else {
        const newArticle: CreateArticleInput = {
          title: payload.title ?? "",
          content: payload.content ?? "",
          imageUrl: payload.imageUrl,
          authorId: user?.id || "", // This should be set on the server side based on the logged-in user
        };
        await createArticle(newArticle);
        toast.success("Article created successfully");
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      toast.error(
        "An error occurred while saving the article. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    toast("Changes discarded", {
      description: "Any unsaved changes have been lost.",
    });
  };

  const pageTitle = isEditing ? "Edit Article" : "Create New Article";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8  flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          {isEditing && articleId && (
            <p className="text-muted-foreground mt-2">
              Editing article ID: {articleId}
            </p>
          )}
        </div>

        <Button
          nativeButton={false}
          variant={"default"}
          render={(props) => (
            <Link
              href={
                !isEditing || !articleId ? Routes.HOME : `/wiki/${articleId}`
              }
              {...props}
            />
          )}
        >
          Go Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Section */}
        <Card>
          <CardHeader>
            <CardTitle>Article Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
          </CardHeader>
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <Button
                  {...props}
                  disabled={isPolishing}
                  onClick={handlePolishArticle}
                  variant={"secondary"}
                  className={
                    "cursor-pointer absolute top-4 right-4 hover:scale-102 transition-transform duration-200"
                  }
                >
                  <ShinyText
                    text={isPolishing ? "Polishing..." : "✨ Polish with AI"}
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
              <p>You can polish the article by clicking the button above.</p>
            </TooltipContent>
          </Tooltip>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown) *</Label>
              <div
                ref={editorContainerRef}
                className={`border rounded-md overflow-hidden ${
                  errors.content ? "border-destructive" : ""
                }`}
              >
                <MDEditor
                  value={content}
                  onChange={handleContentChange}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: "Write your article content in Markdown...",
                    style: { fontSize: 14, lineHeight: 1.5 },
                  }}
                />
                {aiSuggestion && (
                  <div className="flex items-center justify-between gap-2 border-t bg-muted/40 px-3 py-1.5 text-sm italic text-muted-foreground">
                    <span className="truncate">{aiSuggestion}</span>
                    <kbd className="shrink-0 rounded border bg-background px-1.5 py-0.5 font-mono text-xs not-italic">
                      Tab ↵
                    </kbd>
                  </div>
                )}
              </div>

              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <div className="space-y-2">
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Click to upload files
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Upload images, documents, or other files to attach to your
                    article
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </div>

              {/* Display uploaded files */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Files:</Label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: the order won't change
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-4">
              <Button
                nativeButton
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                nativeButton
                type="submit"
                disabled={isSubmitting}
                className="min-w-25"
              >
                {isSubmitting ? "Saving..." : "Save Article"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default WikiEditor;
