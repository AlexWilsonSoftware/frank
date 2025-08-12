"use client"

import { ArticleCard } from "@/components/article-card"
import {article} from "@/type/article";
import {useEffect, useState} from "react";

export default function Home() {
    const [articles, setArticles] = useState<article[]>([]);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const res = await fetch(`/api/article`);
                const data = await res.json();
                setArticles(data);
                console.log(data);
            } catch (err) {
                console.log(err)
            }
        }

        loadArticles();
    }, [])

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
