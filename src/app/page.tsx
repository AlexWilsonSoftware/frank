"use client"

import { ArticleCard } from "@/components/article-card"
import {article} from "@/type/article";
import {useEffect, useState} from "react";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import {NewArticleButton} from "@/components/new-article";

export default function Home() {
    const [articles, setArticles] = useState<article[]>([]);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const res = await fetch(`/api/article`);
                const data = await res.json();
                setArticles(data.reverse());
                console.log(data);
            } catch (err) {
                console.log(err)
            }
        }

        loadArticles();
    }, [])

    return (
      <div className="flex items-center flex-col w-full h-full">
          <p className="text-3xl md:text-5xl font-bold p-8">
              Welcome to Frank
          </p>

          <SignedIn>
              <div className="w-[90%] md:w-[50%] gap-8 pb-8 flex flex-col items-center">
                  <NewArticleButton />
                  {articles.map((article: article) => (
                      <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
          </SignedIn>

          <div className="fixed bottom-4 right-4 flex gap-2">
              <DarkModeToggle />
              <SignedIn>
                  <UserButton />
              </SignedIn>
          </div>

          <SignedOut>
              <div className="flex flex-col items-center justify-center">
                  <p className="text-xl mb-4">You must be signed in to use Frank.</p>
                  <SignInButton mode="modal">
                      <Button className="cursor-pointer">Sign In</Button>
                  </SignInButton>
              </div>
          </SignedOut>

      </div>

    );
}
