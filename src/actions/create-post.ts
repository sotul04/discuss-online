'use server';

import { revalidatePath } from "next/cache";
import paths from '@/paths';
import  db  from "@/db";
import { Post } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from 'zod';
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { title } from "process";

const createPostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10)
});

interface CreatePostFormState {
    errors: {
        title?: string[],
        content?: string[],
        _form?: string[]
    }
}

export async function createPost(slug: string ,_: CreatePostFormState, formData: FormData): Promise<CreatePostFormState> {

    const result = createPostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content')
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return {
            errors: {
                _form: ['You must be signed in first.']
            }
        }
    }

    const topic = await db.topic.findFirst({
        where: { slug }
    })

    if (!topic) {
        return {
            errors: {
                _form: ['Topic is not available.'],
            }
        }
    }

    if (!session.user.email) {
        return{
            errors: {
                _form: ['There is error with your session.'],
            }
        }
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (!user) {
        return{
            errors: {
                _form: ['Something went wrong.'],
            }
        }
    }

    let post: Post;
    try {
        post = await db.post.create({
            data: {
                title: result.data.title,
                content: result.data.content,
                userId: user.id,
                topicId: topic.id
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            return {
                errors: {
                    _form: [error.message]
                }
            }
        }
        return {
            errors: {
                _form: ['Failed to create post.']
            }
        }
    }

    revalidatePath(paths.topicShow(slug));
    revalidatePath(paths.home());
    redirect(paths.postShow(slug, post.id));
}