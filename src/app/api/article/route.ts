import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";

const sql = neon(process.env.POSTGRES_URL!);

export async function GET() {
    const articles = await sql`SELECT * FROM article ORDER BY timestamp DESC`

    return NextResponse.json(articles)
}

export async function POST(req: Request) {
    try {
        const { title, description, url, timestamp } = await req.json();

        if (!title || !url || !timestamp) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const result = await sql`
      INSERT INTO article (title, description, url, timestamp)
      VALUES (${title}, ${description}, ${url}, ${timestamp})
      RETURNING *
    `;

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error("Error inserting article:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}