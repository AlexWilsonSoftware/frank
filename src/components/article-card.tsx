import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/8bit/card";
import {article} from "@/type/article";
import {Button} from "@/components/ui/8bit/button";
import {Badge} from "@/components/ui/8bit/badge";

type ArticleCardProps = {
    article: article
}

export function ArticleCard({article}: ArticleCardProps) {

    return (
        <Card className="w-[100%] md:w-[48%] gap-0 pb-2">
            {article.timestamp && <div className="absolute right-4 top-1">
                <Badge>
                    {new Date(article.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                    })}
                </Badge>
            </div>}

            <CardHeader>
                <CardTitle className="line-clamp-1 leading-loose">{article.title}</CardTitle>
            </CardHeader>

            <CardContent>
                <CardDescription className="line-clamp-4 pb-5 text-sm">
                    {article.description}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end pb-2 pt-4">
                <Button className="cursor-pointer" variant="outline">
                    <a href={article.url} target="_blank">Open</a>
                </Button>
            </CardFooter>
        </Card>
    )
}