import Image from "next/image";
import CommentCreateForm from "@/components/comments/comment-create-form";
import { fetchCommentsByPostId } from "@/db/queries/comments";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface CommentShowProps {
  commentId: string;
  postId: string;
}

// TODO: Get a list of comments
export default async function CommentShow({ commentId, postId }: CommentShowProps) {
  const comments = await fetchCommentsByPostId(postId);
  const comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    return null;
  }

  const children = comments.filter((c) => c.parentId === commentId);
  const renderedChildren = children.map((child) => {
    return (
      <CommentShow key={child.id} commentId={child.id} postId={postId} />
    );
  });

  const name = comment.user.name || '';

  return (
    <div className="p-4 border mt-2 mb-1 rounded-xl">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>{name.substring(0, Math.min(1, name.length))}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <p className="text-md font-medium">
            {comment.user.name}
          </p>
          <p className="text-md pl-1">{comment.content}</p>

          <CommentCreateForm postId={comment.postId} parentId={comment.id} />
        </div>
      </div>
      <div className="pl-4">{renderedChildren}</div>
    </div>
  );
}
