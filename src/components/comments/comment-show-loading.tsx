import { Skeleton } from "@nextui-org/react";

export default function CommentShowLoading() {
    return <div className="p-4 border mt-2 mb-1 rounded-xl">
        <div className="flex gap-3">
            <Skeleton className="w-10 h-10 rounded-full"/>
            <div className="flex-1 space-y-3">
                <Skeleton className="w-max-[400px] h-5 rounded-xl"/>
                <Skeleton className="w-max-[350px] h-6 rounded-xl"/>
            </div>
        </div>
    </div>
}