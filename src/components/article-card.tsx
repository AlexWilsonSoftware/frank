import {Card, CardContent, CardDate, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {article} from "@/type/article";

type ArticleCardProps = {
    article: article
}

export function ArticleCard({article}: ArticleCardProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>
                    {article.description}
                </CardDescription>
                <CardDate>
                    {new Date(article.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    })}
                </CardDate>
            </CardHeader>

            <CardContent>

            </CardContent>
            <CardFooter className="flex-col gap-2 underline">
                Go to article
            </CardFooter>
        </Card>
    )
}