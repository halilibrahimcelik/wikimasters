import WikiEditor from "@/components/features/wikicards/wiki-editor";
import { stackServerApp } from "@/stack/server";

export default async function NewArticlePage() {
  await stackServerApp.getUser({ or: "redirect" });

  return (
    <div>
      <WikiEditor isEditing={false} />
    </div>
  );
}
