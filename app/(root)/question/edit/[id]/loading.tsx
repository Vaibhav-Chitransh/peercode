import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditQuestionLoading() {
  return (
    <div className="animate-pulse px-4 py-8">
      <Skeleton className="mb-8 h-10 w-64" />

      <div className="space-y-6">
        <Skeleton className="h-10 w-full" /> {/* Title Input */}
        <Skeleton className="h-40 w-full" /> {/* Content Editor */}
        <Skeleton className="h-10 w-full" /> {/* Tags input */}
        <Skeleton className="h-10 w-32" /> {/* Submit button */}
      </div>
    </div>
  );
}
