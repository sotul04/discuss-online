'use client';

import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import * as actions from '@/actions';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect, useRef, useState } from "react";
import { PostWithData } from "@/db/queries/post";
import paths from "@/paths";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function SearchInput() {
    const searchParams = useSearchParams();
    const [term, setTerm] = useState('');
    const searchBounce = useRef<any>(null);
    const [searchItem, setSearchItem] = useState<React.ReactNode>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (searchBounce.current) clearTimeout(searchBounce.current);
        searchBounce.current = setTimeout(async () => {
            if (term !== '') {
                const response = await fetch(`/api/search?term=${encodeURIComponent(term)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data: { data: PostWithData[] } = await response.json();
                    const renderedPosts = data.data.map((post) => {
                        const topicSlug = post.topic.slug;

                        if (!topicSlug) {
                            throw new Error('Need a slug to link to a post');
                        }

                        return (
                            <div key={post.id} className="border rounded-xl p-2">
                                <Link
                                    href={paths.postShow(topicSlug, post.id)}
                                    onClick={() => setIsOpen(false)}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <h3 className="text-lg font-bold">{post.title}</h3>
                                    <div className="flex flex-row gap-8">
                                        <p className="text-xs text-gray-400">By {post.user.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {post._count.comments} comments
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        );
                    });

                    const newItem = renderedPosts.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg my-2">Posts</h3>
                            {renderedPosts}
                        </div>
                    ) : null;
                    setSearchItem(newItem);
                    setIsOpen(true);
                } else {
                    setSearchItem(null);
                    setIsOpen(false);
                }
            } else {
                setSearchItem(null);
                setIsOpen(false);
            }
        }, 200);
    }, [term]);

    return <div className="relative">
        <form action={actions.search}>
            <Input
                className="rounded-xl"
                name='term'
                defaultValue={searchParams.get('term') || ''}
                placeholder="search"
                onChange={e => {
                    setTerm(e.target.value);
                }}
                onBlur={() => setIsOpen(false)}
            />
        </form>
        {isOpen && <div className="mt-3 absolute rounded-xl border z-20">
            <Card className="min-w-[300px]">
                <CardContent className="gap-3">
                    {searchItem ? searchItem : <h3 className="text-lg mt-4">No Post</h3>}
                </CardContent>
            </Card>
        </div>
        }
    </div>
}

/**
 * <div className="mt-3 absolute rounded-xl border z-20">
                <Card className="min-w-[300px]">
                    <CardContent className="gap-3">
                        <h3 className="text-lg my-2">No Post</h3>
                    </CardContent>
                </Card>
            </div>
 */