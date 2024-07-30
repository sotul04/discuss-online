import { Skeleton } from "@nextui-org/react";

export default function PostShowLoading() {
    return <div className="m-4">
        <div className="my-2">
            <Skeleton className="h-9 max-w-[600px] rounded-xl"/>
        </div>
        <div className="p-4 border rounded space-y-2">
            <Skeleton className="h-7 max-w-[350px] rounded-xl"/>
        </div>
    </div>
}