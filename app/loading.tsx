import { LoaderIcon } from "lucide-react";
export default function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="animate-spin h-8 w-8 text-muted-foreground" />
    </div>
  );
}
