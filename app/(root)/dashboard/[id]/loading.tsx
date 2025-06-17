import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div>
        <div className="my-5 flex">
            <Skeleton className="mx-4 h-10 w-28"/>
            <Skeleton className="mx-4 h-10 w-28"/>
            <Skeleton className="mx-4 h-10 w-28"/>
        </div>

        <div className="my-5 flex">
            <Skeleton className="mx-4 h-24 w-3/12"/>
            <Skeleton className="mx-4 h-24 w-3/12"/>
            <Skeleton className="mx-4 h-24 w-3/12"/>
        </div>

        <div className="flex gap-4 p-4">
            {/* Left skeleton */}
            <Skeleton className="h-72 w-1/2" />

            {/* Right stacked skeletons */}
            <div  className="flex w-1/2 flex-col justify-between gap-4">
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-56 w-full" />
            </div>
            </div>


    </div>
    
  );
}

export default Loading