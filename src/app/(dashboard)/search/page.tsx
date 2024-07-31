import { redirect } from "next/navigation";
import PostList from "@/components/posts/post-list";
import { fetchPostsBySearchTerm } from "@/db/queries/post";

interface SearchPageProps {
    searchParams: {
        term: string;
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {

    const { term } = searchParams;
    if (!term) {
        redirect('/');
    }

    return <div className="space-y-3 container h-screen">
        <h3 className="text-xl pl-2 my-8">Search: <code className="font-bold">{term}</code></h3>
        <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
    </div>
}