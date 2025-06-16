import { Skeleton } from "@/components/ui/skeleton";

const EditProfileLoading = () => {
  return (
    <div>
      {/* Page Title */}
      <Skeleton className="mb-6 h-10 w-48 rounded-md" />

      {/* Profile form fields */}
      <div className="mt-6 space-y-6">
        {/* Profile Picture */}
        <Skeleton className="size-24 rounded-full" />

        {/* Name Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        {/* Portfolio Website */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Submit Button */}
        <Skeleton className="mt-4 h-12 w-40 rounded-md" />
      </div>
    </div>
  );
};

export default EditProfileLoading;
