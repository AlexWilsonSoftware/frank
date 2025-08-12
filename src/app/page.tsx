import { ArticleCard } from "@/components/article-card"
import {article} from "@/type/article";

export default function Home() {
    const articles: article[] = [
        {
            id: 1,
            title: "The History of Chess",
            description: "An overview of chess from its origins to the modern era.",
            timestamp: new Date()
        },
        {
            id: 2,
            title: "Space Exploration",
            description: "The milestones in humanity’s journey to space.",
            timestamp: new Date()
        }
    ];

  return (
      <div className="flex items-center flex-col w-full">
          <p className="text-3xl md:text-5xl font-bold p-8">
              Welcome to Frank
          </p>

          <div className="w-[90%] md:w-[50%] gap-8 flex flex-col">
              {articles.map((article: article) => (
                  <ArticleCard key={article.id} article={article} />
              ))}
          </div>
      </div>

  );
}
