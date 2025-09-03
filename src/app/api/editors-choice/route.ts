import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";

const sql = neon(process.env.POSTGRES_URL!);

export async function GET() {
    const articles = await sql`SELECT * FROM article WHERE editors_choice = 1 ORDER BY id DESC`

    return NextResponse.json(articles)
}