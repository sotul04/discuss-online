import Link from "next/link";
import PostShow from "@/components/posts/post-show";
import CommentList from "@/components/comments/comment-list";
import CommentCreateForm from "@/components/comments/comment-create-form";
import paths from "@/paths";
import { Suspense } from "react";
import PostShowLoading from "@/components/posts/post-show-loading";
import CommentShowLoading from "@/components/comments/comment-show-loading";
import { ArrowLeftIcon } from "lucide-react";

interface PostShowPageProps {
    params: {
        slug: string;
        postId: string;
    };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
    const { slug, postId } = params;

    return (
        <div className="space-y-3 container h-screen">
            <Link className="inline-flex gap-2 hover:underline mt-4" href={paths.topicShow(slug)}>
                <ArrowLeftIcon/>
                Back to <strong>{slug}</strong>
            </Link>
            <Suspense fallback={<PostShowLoading />}>
                <PostShow postId={postId} />
            </Suspense>
            <CommentCreateForm postId={postId} startOpen />
            <Suspense fallback={<CommentShowLoading/>}>
                <CommentList postId={postId} />
            </Suspense>
        </div>
    );
}
