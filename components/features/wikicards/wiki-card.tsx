import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArticleWikiData } from "@/types/api";

interface WikiCardProps extends ArticleWikiData {}

const WikiCard: React.FC<WikiCardProps> = ({
  title,
  authorName,
  createdAt: date,
  content: summary,
  id,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{authorName ?? "Unknown "} </span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <CardDescription>{summary}</CardDescription>
      </CardContent>
      <CardFooter className="pt-2">
        <Link
          href={`/wiki/${id}`}
          className="text-blue-600 hover:underline text-sm font-medium w-fit"
        >
          Read article &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
};
export default WikiCard;
("");
