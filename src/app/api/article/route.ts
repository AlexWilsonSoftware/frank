import {neon} from "@neondatabase/serverless";
import {NextResponse} from "next/server";

const sql = neon(process.env.POSTGRES_URL!);

export async function GET(req: Request) {
    const articles = await sql`SELECT * FROM article`

    return NextResponse.json(articles)
}