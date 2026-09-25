import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-32" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-[400px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-80 rounded-lg col-span-4" />
          <Skeleton className="h-80 rounded-lg col-span-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-80 rounded-lg col-span-4" />
          <Skeleton className="h-80 rounded-lg col-span-3" />
        </div>
      </div>
    </div>
  )
}

