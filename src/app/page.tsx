"use client"

import { ArticleCard } from "@/components/article-card"
import {article} from "@/type/article";
import {useEffect, useState} from "react";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/8bit/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import {TodaysArticleCard} from "@/components/todays-article-card";
import Image from "next/image"

export default function Home() {
    const [todaysArticle, setTodaysArticle] = useState<article>();
    const [recentArticles, setRecentArticles] = useState<article[]>([]);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const res = await fetch(`/api/article`);
                const data = await res.json();
                setTodaysArticle(data.at(0));
                setRecentArticles(data.slice(1, 7));
            } catch (err) {
                console.log(err);
            }
        };

        loadArticles();
    }, []);

    return (
        <div className="flex flex-col items-center w-full min-h-screen">
            <p className="text-2xl md:text-5xl font-bold p-8 text-center retro">
                FRANK
            </p>

            <SignedIn>
                <div className="w-[90%] md:w-[90%] lg:w-[80%] gap-8 pb-8 flex flex-col items-center">
                    <div className="flex flex-col xl:flex-row gap-8 w-full">

                        <div className="flex flex-col xl:w-1/3">
                            <p className="text-xl md:text-2xl font-semibold py-4 retro">
                                Today&#39;s Article
                            </p>
                            {todaysArticle ? (
                                <TodaysArticleCard key={todaysArticle.id} article={todaysArticle} />
                            ) : (
                                <div>You have no articles</div>
                            )}
                        </div>

                        <div className="hidden xl:block mt-18 w-px relative border-x-3 border-foreground dark:border-ring -mx-1.5" />

                        <div className="flex flex-col xl:w-2/3">
                            <p className="text-xl md:text-2xl font-semibold py-4 retro">
                                Past Articles
                            </p>
                            <div className="flex flex-wrap gap-2 gap-x-5">
                                {recentArticles.map((article: article) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </SignedIn>

            <div className="fixed top-4 right-4 flex gap-2">
                <DarkModeToggle />
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            <div className="fixed bottom-0 right-0 [&>span]:block [&>span]:leading-none">
                <Image
                    src="/frog moving.gif"
                    alt="Frog sprite"
                    width={332}
                    height={228}
                    unoptimized
                    className="block [image-rendering:pixelated]"
                    priority
                />
            </div>

            <SignedOut>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl mb-4 retro">You must be signed in to use Frank.</p>
                    <SignInButton mode="modal">
                        <Button className="cursor-pointer">Sign In</Button>
                    </SignInButton>
                </div>
            </SignedOut>
        </div>


    );
}
