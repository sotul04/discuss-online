import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topics/topics-list";
import { Divider } from "@nextui-org/react";
import PostList from "@/components/posts/post-list";
import { fetchTopPosts } from "@/db/queries/post";

export default async function Home() {

  return <div className="container grid grid-cols-3 gap-4 p-4 h-screen">
    <div className="col-span-2">
      <h1 className="text-xl m-2">Top Post</h1>
      <PostList fetchData={fetchTopPosts}/>
    </div>
    <aside>
      <div className="shadow border py-3 px-2 rounded-xl">
      <TopicCreateForm/>
      <Divider className="my-4"/>
      <h3 className="text-lg mb-2">Topics</h3>
      <TopicList/>
      </div>
    </aside>
  </div>;
}
