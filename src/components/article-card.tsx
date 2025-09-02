import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/8bit/card";
import {Badge} from "@/components/ui/8bit/badge"
import {article} from "@/type/article";
import {Button} from "@/components/ui/8bit/button";

type ArticleCardProps = {
    article: article
}

export function ArticleCard({article}: ArticleCardProps) {

    return (
        <Card className="w-[100%] md:w-[49%] gap-0 pb-2">
            <CardHeader>
                <CardTitle className="line-clamp-1 leading-loose">{article.title}</CardTitle>
            </CardHeader>

            <CardContent>
                <CardDescription className="line-clamp-4 pb-5">
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