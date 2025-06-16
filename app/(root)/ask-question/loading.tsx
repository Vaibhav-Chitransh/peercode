import { Skeleton } from "@/components/ui/skeleton";

const AskQuestionLoading = () => {
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <Skeleton className="h-10 w-60 rounded-md" />

      {/* Title Input */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Description / Content Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-36 w-full rounded-md" />
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Submit Button */}
      <Skeleton className="mt-4 h-12 w-40 rounded-md" />
    </div>
  );
};

export default AskQuestionLoading;
