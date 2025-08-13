import { NextRequest, NextResponse } from 'next/server';
import { MUSIC_CATEGORIES } from '@/music-categories';
import { article } from '@/type/article';
import {neon} from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL!);

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

// Helper function to get random music article from Wikipedia
async function getRandomMusicArticle(): Promise<WikipediaPage | null> {
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
}

// Helper function to get article summary from Wikipedia
async function getArticleSummary(title: string): Promise<WikipediaSummary | null> {
    try {
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const summaryResponse = await fetch(summaryUrl);
        const summaryData = await summaryResponse.json();

        return summaryData;
    } catch (error) {
        console.error('Error fetching article summary:', error);
        return null;
    }
}

// Helper function to save article to database
async function saveArticleToDatabase(articleData: Omit<article, 'id'>): Promise<article> {
    try {
        const { title, description, url, timestamp } = articleData;

        const result = await sql`
            INSERT INTO article (title, description, url, timestamp)
            VALUES (${title}, ${description}, ${url}, ${timestamp})
            RETURNING *
        `;

        return result[0] as article;
    } catch (error) {
        console.error('Error saving article:', error);
        throw error;
    }
}

// Helper function to check if article meets quality thresholds
function isQualityArticle(summary: WikipediaSummary): boolean {
    return <boolean>(
        summary.extract &&
        summary.extract.length >= 300 && // At least 300 chars
        !summary.title.toLowerCase().includes('stub') &&
        !summary.title.toLowerCase().includes('disambiguation') &&
        !summary.extract.toLowerCase().includes('may refer to') &&
        summary.extract.split(' ').length >= 50 // At least 50 words
    );
}

export async function POST(request: NextRequest) {
    try {

        let attempts = 0;
        const maxAttempts = 10;
        let goodArticle: WikipediaSummary | null = null;

        // Try to find a quality article
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
            if (isQualityArticle(summary)) {
                goodArticle = summary;
                console.log(`Found good article on attempt ${attempts}:`, summary.title);
            }
        }

        if (!goodArticle) {
            return NextResponse.json({
                error: 'Could not find a quality article after multiple attempts',
                attempts: maxAttempts
            }, { status: 404 });
        }

        // Prepare article data (no user_id needed)
        const articleData: Omit<article, 'id'> = {
            title: goodArticle.title,
            description: goodArticle.extract || 'No description available',
            url: goodArticle.content_urls.desktop.page,
            timestamp: new Date(),
        };

        // Save to database
        const savedArticle = await saveArticleToDatabase(articleData);

        console.log('Article saved successfully:', savedArticle);

        return NextResponse.json({
            success: true,
            article: savedArticle,
            attempts: attempts
        }, { status: 201 });

    } catch (error) {
        console.error('Error generating article:', error);

        return NextResponse.json({
            error: 'Failed to generate and save article',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}