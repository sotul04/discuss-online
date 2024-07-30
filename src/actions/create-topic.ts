'use server';

import { revalidatePath } from "next/cache";
import paths from '@/paths';
import type { Topic } from '@prisma/client';
import { redirect } from 'next/navigation';

import {z} from 'zod';
import  db  from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const createTopicSchema = z.object({
    name: z.string().min(3).regex(/^[a-z-]+$/, { message: "Must be lowercase or dashes without spaces"}),
    description: z.string().min(10),
});

interface CreateTopicFromState {
    errors: {
        name? : string[];
        description?: string[];
        _form?: string[];
    }
}

export async function createTopic(_: CreateTopicFromState, formData: FormData): Promise<CreateTopicFromState> {

    const result = createTopicSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description')
    });

    if (!result.success) {
        console.log('Erorrrr')
        console.log(result.error.flatten().fieldErrors);
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return {
            errors: {
                _form: ['You must be signed in to do this.'],
            }
        }
    }

    let topic: Topic;
    try {
        topic = await db.topic.create({
            data: {
                slug: result.data.name,
                description: result.data.description,
            }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                errors: {
                    _form: [error.message]
                }
            }
        }
        return {
            errors: {
                _form: ['Something went wrong.']
            }
        }
    }

    revalidatePath(paths.home());
    redirect(paths.topicShow(topic.slug));
}