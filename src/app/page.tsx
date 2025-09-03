"use client"

import { ArticleCard } from "@/components/article-card"
import {article} from "@/type/article";
import {useEffect, useRef, useState} from "react";
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
        <div className="flex flex-col min-h-screen w-full items-center">
            <div className="relative w-[320px] h-[96px]" aria-label="Frank logo">
                {/* Light-mode logo */}
                <Image
                    src="/Frank Logo.gif"
                    alt=""
                    width={320}
                    height={96}
                    unoptimized
                    className="hidden [image-rendering:pixelated] dark:block"
                    priority
                    aria-hidden
                />
                {/* Dark-mode logo */}
                <Image
                    src="/Frank Logo Light Mode.gif"
                    alt=""
                    width={320}
                    height={96}
                    unoptimized
                    className="block [image-rendering:pixelated] dark:hidden"
                    priority
                    aria-hidden
                />
            </div>

            <br/>

            <SignedIn>
                <div className="w-[90%] md:w-[90%] gap-8 flex flex-col items-center">

                    <div className="flex flex-col xl:flex-row gap-8 w-full">
                        <div className="flex flex-col xl:w-1/3">
                            <p className="text-xl md:text-2xl font-semibold py-4 retro">
                                Today&#39;s Article
                            </p>
                            <div className="relative h-full xl:border-r-6 border-foreground dark:border-ring -mx-1.5 w-full">
                                {todaysArticle ? (
                                    <TodaysArticleCard key={todaysArticle.id} article={todaysArticle} />
                                ) : (
                                    <div>You have no articles</div>
                                )}
                            </div>

                        </div>

                        {/*<div className="hidden xl:block mt-18 w-px relative border-x-3 border-foreground dark:border-ring -mx-1.5" />*/}

                        <div className="flex flex-col xl:w-2/3">
                            <p className="text-xl md:text-2xl font-semibold py-4 retro">
                                Past Articles
                            </p>
                            <div className="flex flex-wrap gap-2 gap-x-5 h-full">
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

            <footer className="mt-auto w-full flex justify-center md:justify-end">
                <div className="w-[80vw] max-w-[320px] h-auto">
                    <Image
                        src="/frog moving.gif"
                        alt=""
                        width={332}
                        height={228}
                        unoptimized
                        className="block [image-rendering:pixelated]"
                        priority
                    />
                </div>
            </footer>

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
