import { NextResponse } from "next/server";
import db from "@/db";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const term = url.searchParams.get('term') || '';

        const data = await db.post.findMany({
            include: {
                topic: { select: { slug: true } },
                user: { select: { name: true, image: true } },
                _count: { select: { comments: true } },
            },
            where: {
                OR: [
                    { title: { contains: term } },
                    { content: { contains: term } },
                    { topic: { slug: { contains: term } } },
                ],
            },
        });

        return NextResponse.json({
            data: data
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            message: 'Something went wrong.'
        }, { status: 409 });
    }
}
