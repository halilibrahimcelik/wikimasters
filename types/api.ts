export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FileUploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
}
export interface ArticleWikiData {
  title: string;
  id: number;
  createdAt: string | null;
  content: string;
  authorName: string | null;
  imageUrl: string | null;
}
