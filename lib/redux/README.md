# Redux Toolkit RTK Query Setup

## 📁 Folder Structure

```
lib/
  redux/
    store.ts                 # Redux store configuration
    provider.tsx             # Client-side Redux Provider
    serverCache.ts           # Server-side cache utilities
    features/
      articles/
        articlesApiSlice.ts  # RTK Query API for articles

  data/
    articles.ts              # Server-side DB queries

app/
  api/
    articles/
      route.ts               # GET /api/articles
      [id]/
        route.ts             # GET /api/articles/:id
```

## 🚀 Usage

### Client Components (with RTK Query hooks)

```tsx
"use client";

import { useGetArticlesQuery } from "@/lib/redux/features/articles/articlesApiSlice";

export function ArticlesList() {
  const { data, isLoading, error } = useGetArticlesQuery();

  // Component logic...
}
```

### Server Components (with SSR prefetching)

```tsx
import { getArticlesFromDB } from "@/lib/data/articles";
import { StoreProvider } from "@/lib/redux/provider";
import { articlesApi } from "@/lib/redux/features/articles/articlesApiSlice";

export default async function Page() {
  // Fetch on server
  const articles = await getArticlesFromDB();

  // Hydrate Redux cache
  const preloadedState = {
    [articlesApi.reducerPath]: {
      queries: {
        "getArticles(undefined)": {
          status: "fulfilled",
          data: articles,
          // ... other required fields
        },
      },
    },
  };

  return (
    <StoreProvider preloadedState={preloadedState}>
      <YourClientComponent />
    </StoreProvider>
  );
}
```

## 🎣 Available Hooks

```tsx
// Queries
useGetArticlesQuery(); // Get all articles
useGetArticleByIdQuery(id); // Get single article

// Mutations
useCreateArticleMutation(); // Create new article
useUpdateArticleMutation(); // Update article
useDeleteArticleMutation(); // Delete article
```

## ⚡ Benefits

1. **Server-Side Rendering**: Articles fetched on server, instant page loads
2. **Automatic Caching**: RTK Query caches all API responses
3. **Optimistic Updates**: UI updates instantly before server confirms
4. **Tag-based Invalidation**: Automatic refetch when data changes
5. **TypeScript Support**: Full type safety with Drizzle schema

## 🔧 Configuration

- **Cache Duration**: 60 seconds (configurable in `articlesApiSlice.ts`)
- **Refetch on Focus**: Disabled by default
- **Automatic Retry**: Enabled for failed requests
