import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingQuestionPage() {
  return (
    <div className="animate-pulse space-y-6 px-4 py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <Skeleton className="h-8 w-full max-w-2xl" />

      <div className="flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  );
}
