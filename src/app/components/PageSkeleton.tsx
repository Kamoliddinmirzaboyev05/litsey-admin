import { Skeleton } from "./ui/skeleton";

export function PageSkeleton({ type = "grid" }: { type?: "grid" | "list" | "table" | "form" | "dashboard" }) {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-x-hidden w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1f2937] p-5 md:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="space-y-3 w-full sm:w-auto">
          <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-700" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      {type !== "form" && type !== "dashboard" && (
        <Skeleton className="h-12 w-full max-w-md rounded-lg bg-gray-200 dark:bg-gray-700" />
      )}

      {type === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "list" && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex gap-4">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0 bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-3 w-full">
                <Skeleton className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "table" && (
        <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full bg-gray-100 dark:bg-gray-800" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-gray-50 dark:bg-gray-800/50" />
            ))}
          </div>
        </div>
      )}

      {type === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-lg bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700" />
            <Skeleton className="h-64 w-full rounded-lg bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700" />
            <Skeleton className="h-48 w-full rounded-lg bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700" />
          </div>
        </div>
      )}

      {type === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
          
          <Skeleton className="h-24 w-full rounded-lg bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg bg-gray-100 dark:bg-gray-800/50" />
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg bg-gray-100 dark:bg-gray-800/50" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <Skeleton className="h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <Skeleton className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}