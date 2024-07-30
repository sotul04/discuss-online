import PostCreateForm from "@/components/posts/post-create-from";
import PostList from "@/components/posts/post-list";
import { fetchPostsByTopicSlug } from "@/db/queries/post";

interface TopicShowPageProps {
    params: {
        slug: string
    }
}

export default function TopicShowPage({ params }: TopicShowPageProps) {

    const {slug} = params;

    return <div className="container grid grid-cols-4 gap-4 p-4 h-screen">
        <div className="col-span-3">
            <h1 className="text-2xl font-bold mb-2">
                Topic: <strong>{slug}</strong>
            </h1>
            <PostList fetchData={() => fetchPostsByTopicSlug(slug)}/>
        </div>
        <aside>
            <PostCreateForm slug={slug}/>
        </aside>
    </div>
}