import {Card, CardContent, CardDate, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {article} from "@/type/article";
import {Button} from "@/components/ui/button";

type ArticleCardProps = {
    article: article
}

export function TodaysArticleCard({article}: ArticleCardProps) {

    return (
        <Card className="w-full h-[95%]">
            <CardHeader>
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <CardDate>
                    {new Date(article.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                    })}
                </CardDate>
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