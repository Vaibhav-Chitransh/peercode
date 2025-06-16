import { Skeleton } from "@/components/ui/skeleton";

const LoadingProfile = () => {
  return (
    <div className="space-y-8">
      {/* Top section: Profile info + edit button */}
      <div className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row">
        {/* Profile image and details */}
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <Skeleton className="size-[140px] rounded-full" />

          <div className="mt-3 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />

            {/* Location / Website / Joined Info */}
            <div className="mt-5 flex flex-wrap gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-40" />
            </div>

            {/* Bio */}
            <Skeleton className="h-20 w-[300px]" />
          </div>
        </div>

        {/* Edit Profile Button */}
        <Skeleton className="min-h-[46px] min-w-[175px] rounded-md" />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>

      {/* Tabs Section */}
      <div className="mt-10 space-y-6">
        {/* Tabs */}
        <div className="flex gap-4">
          <Skeleton className="h-[42px] w-28 rounded-md" />
          <Skeleton className="h-[42px] w-28 rounded-md" />
        </div>

        {/* List of posts or answers */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingProfile;
