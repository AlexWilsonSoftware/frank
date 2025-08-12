'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MUSIC_CATEGORIES } from "@/music-categories";

// Curated list of music categories that contain actual articles

type Article = {
    id: number;
    user_id: string;
    title: string;
    description: string;
    url: string;
    timestamp: Date;
};

type WikipediaPage = {
    pageid: number;
    title: string;
};

type WikipediaSummary = {
    title: string;
    extract: string;
    content_urls: {
        desktop: {
            page: string;
        };
    };
};

export function NewArticleButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();

    const getRandomMusicArticle = async (): Promise<WikipediaPage | null> => {
        // Randomly select a category
        const randomCategory = MUSIC_CATEGORIES[Math.floor(Math.random() * MUSIC_CATEGORIES.length)];

        try {
            // Get articles from the selected category
            const categoryUrl = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${randomCategory}&cmtype=page&format=json&cmlimit=500&origin=*`;

            const categoryResponse = await fetch(categoryUrl);
            const categoryData = await categoryResponse.json();

            if (!categoryData.query?.categorymembers?.length) {
                return null;
            }

            // Filter out disambiguation pages and list pages
            const validPages = categoryData.query.categorymembers.filter((page: WikipediaPage) =>
                !page.title.includes('(disambiguation)') &&
                !page.title.startsWith('List of') &&
                !page.title.includes('discography')
            );

            if (validPages.length === 0) {
                return null;
            }

            // Randomly select an article
            const randomPage = validPages[Math.floor(Math.random() * validPages.length)];
            return randomPage;

        } catch (error) {
            console.error('Error fetching from category:', error);
            return null;
        }
    };

    const getArticleSummary = async (title: string): Promise<WikipediaSummary | null> => {
        try {
            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
            const summaryResponse = await fetch(summaryUrl);
            const summaryData = await summaryResponse.json();

            return summaryData;
        } catch (error) {
            console.error('Error fetching article summary:', error);
            return null;
        }
    };

    const saveArticleToDatabase = async (articleData: Omit<Article, 'id'>) => {
        try {
            const response = await fetch('/api/article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(articleData),
            });

            if (!response.ok) {
                throw new Error('Failed to save article');
            }

            const savedArticle = await response.json();
            return savedArticle;
        } catch (error) {
            console.error('Error saving article:', error);
            throw error;
        }
    };

    const handleNewArticle = async () => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        setIsLoading(true);

        try {
            let attempts = 0;
            const maxAttempts = 10; // Try up to 20 articles to find a good one
            let goodArticle = null;

            while (!goodArticle && attempts < maxAttempts) {
                attempts++;

                // Get random music article
                const randomPage = await getRandomMusicArticle();

                if (!randomPage) {
                    continue;
                }

                // Get article summary
                const summary = await getArticleSummary(randomPage.title);

                if (!summary) {
                    continue;
                }

                // Check quality thresholds
                const isGoodQuality =
                    summary.extract &&
                    summary.extract.length >= 300 && // At least 300 chars
                    !summary.title.toLowerCase().includes('stub') &&
                    !summary.title.toLowerCase().includes('disambiguation') &&
                    !summary.extract.toLowerCase().includes('may refer to') &&
                    summary.extract.split(' ').length >= 50; // At least 50 words

                if (isGoodQuality) {
                    goodArticle = summary;
                    console.log(`Found good article on attempt ${attempts}:`, summary.title);
                }
            }

            if (!goodArticle) {
                throw new Error('Could not find a quality article after multiple attempts');
            }

            // Prepare article data
            const articleData = {
                user_id: user.id,
                title: goodArticle.title,
                description: goodArticle.extract || 'No description available',
                url: goodArticle.content_urls.desktop.page,
                timestamp: new Date(),
            };

            // Save to database
            await saveArticleToDatabase(articleData);

            // Optional: Show success message or redirect
            console.log('Article saved successfully:', articleData);

            // You might want to trigger a refresh of the articles list here
            // or show a toast notification

        } catch (error) {
            console.error('Error generating article:', error);
            // You might want to show an error toast here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button
                onClick={handleNewArticle}
                disabled={isLoading || !user}
            >
                <PlusIcon />
                {isLoading ? 'Generating...' : 'New Article'}
            </Button>
        </div>
    );
}