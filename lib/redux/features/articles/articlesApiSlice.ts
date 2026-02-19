import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Article } from "@/db/schema";
import { ArticleWikiData } from "@/types/api";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Article"],
  endpoints: (builder) => ({
    getArticles: builder.query<ArticleWikiData[], void>({
      query: () => "/articles",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Article" as const, id })),
              { type: "Article", id: "LIST" },
            ]
          : [{ type: "Article", id: "LIST" }],
    }),
    getArticleById: builder.query<Article, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Article", id }],
    }),
    createArticle: builder.mutation<Article, Partial<Article>>({
      query: (article) => ({
        url: "/articles",
        method: "POST",
        body: article,
      }),
      invalidatesTags: [{ type: "Article", id: "LIST" }],
    }),
    updateArticle: builder.mutation<
      Article,
      { id: string; data: Partial<Article> }
    >({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Article", id }],
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Article", id }],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;
