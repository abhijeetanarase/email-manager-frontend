
import { Skeleton } from "./Skeleton";

const EmailListItemSkeleton = () => {
  return (
    <div className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="px-4 py-3 sm:px-6 flex items-center">
        {/* Star Icon Placeholder */}
        <div className="flex-shrink-0 mr-3">
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>

        {/* Main Content Area */}
        <div className="min-w-0 flex-1 px-4">
          {/* Sender & Date Row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" /> {/* Sender name */}
            <Skeleton className="h-3 w-16" />  {/* Timestamp */}
          </div>

          {/* Subject & Snippet */}
          <div className="mt-2 space-y-1">
            <Skeleton className="h-4 w-48" />  {/* Subject */}
            <Skeleton className="h-3 w-full" /> {/* Snippet */}
          </div>

          {/* Tags Row (mimics your label styles) */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailListItemSkeleton;