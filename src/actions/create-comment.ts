"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import  db  from "@/db";
import paths from "@/paths";
import { authOptions } from "@/auth";

const createCommentSchema = z.object({
    content: z.string().min(3),
});

interface CreateCommentFormState {
    errors: {
        content?: string[];
        _form?: string[];
    };
    success?: boolean;
}

export async function createComment(
    { postId, parentId }: { postId: string; parentId?: string },
    _: CreateCommentFormState,
    formData: FormData
): Promise<CreateCommentFormState> {
    const result = createCommentSchema.safeParse({
        content: formData.get("content"),
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return {
            errors: {
                _form: ["You must sign in to do this."],
            },
        };
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

    try {
        await db.comment.create({
            data: {
                content: result.data.content,
                postId: postId,
                parentId: parentId,
                userId: user.id,
            },
        });
    } catch (err) {
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message],
                },
            };
        } else {
            return {
                errors: {
                    _form: ["Something went wrong..."],
                },
            };
        }
    }

    const topic = await db.topic.findFirst({
        where: { posts: { some: { id: postId } } },
    });

    if (!topic) {
        return {
            errors: {
                _form: ["Failed to revalidate topic"],
            },
        };
    }

    revalidatePath(paths.postShow(topic.slug, postId));
    revalidatePath(paths.home());
    return {
        errors: {},
        success: true,
    };
}
