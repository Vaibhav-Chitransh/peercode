import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Skeleton className="h-8 w-2/3 sm:w-1/3" />
        <Skeleton className="h-6 w-40" />
      </div>

      <Skeleton className="mb-8 h-5 w-full" />

      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-light-700 bg-light-900 p-6 shadow-md dark:border-dark-400 dark:bg-dark-300"
          >
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="mb-4 h-4 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
