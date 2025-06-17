import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div>
        <div className="my-5 flex">
            <Skeleton className="mx-4 h-10 w-28"/>
            <Skeleton className="mx-4 h-10 w-28"/>
            <Skeleton className="mx-4 h-10 w-28"/>
        </div>

        <div className="mx-auto">
            <Skeleton className="mt-5 h-40 w-11/12"/>

        <Skeleton className="ml-4 mt-5 h-16 w-10/12"/>

         <Skeleton className="ml-4 mt-5 h-80 w-10/12"/>

        </div>




    </div>
    
  );
}

export default Loading