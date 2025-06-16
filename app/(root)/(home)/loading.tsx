"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-12 w-full rounded-md sm:w-2/3" />
        <Skeleton className="h-12 w-full rounded-md sm:w-1/3" />
      </div>

      {/* Tags Filter */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Question Cards */}
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-md" />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
