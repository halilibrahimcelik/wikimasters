"use client";

import { useUser } from "@stackframe/stack";
import MDEditor from "@uiw/react-md-editor";
import { Upload, X } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
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
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();
  // Validate form

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
              href={!isEditing ? Routes.HOME : `/wiki/${articleId}`}
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
        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown) *</Label>
              <div
                className={`border rounded-md ${
                  errors.content ? "border-destructive" : ""
                }`}
              >
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: "Write your article content in Markdown...",
                    style: { fontSize: 14, lineHeight: 1.5 },
                  }}
                />
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
