import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="w-64 border-r border-border/50 p-4 space-y-4 hidden md:block">
        <Skeleton className="h-10 w-36 rounded-xl" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-6">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    </div>
  );
}
