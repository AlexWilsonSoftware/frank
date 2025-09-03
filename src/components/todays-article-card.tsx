import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/8bit/card";
import {article} from "@/type/article";
import {Button} from "@/components/ui/8bit/button";
import {Badge} from "@/components/ui/8bit/badge";

type ArticleCardProps = {
    article: article
}

export function TodaysArticleCard({article}: ArticleCardProps) {

    return (
        <Card className="mr-10 h-full w-full xl:w-auto">
            <div className="absolute right-4 top-2">
                <Badge>
                    {new Date(article.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                    })}
                </Badge>
            </div>

            <CardHeader>
                <CardTitle className="text-xl">{article.title}</CardTitle>
            </CardHeader>

            <CardContent>
                <CardDescription className="text-base line-clamp-20">
                    {article.description}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-2 items-end h-full justify-end">
                <Button className="cursor-pointer text-base">
                    <a href={article.url} target="_blank">
                        Go to article
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )
}