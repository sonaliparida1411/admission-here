export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-7xl animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-muted/60 rounded-lg" />
          <div className="h-4 w-96 bg-muted/40 rounded-md" />
        </div>
        <div className="h-9 w-36 bg-muted/50 rounded-xl" />
      </div>

      {/* KPI Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border bg-card shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-muted/50 rounded" />
              <div className="h-8 w-8 bg-muted/50 rounded-lg" />
            </div>
            <div className="h-8 w-16 bg-muted/70 rounded-md" />
            <div className="h-3 w-32 bg-muted/40 rounded" />
          </div>
        ))}
      </div>

      {/* Content Table / Card Skeleton */}
      <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="h-5 w-48 bg-muted/60 rounded" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted/30 rounded-xl border flex items-center px-4 justify-between">
              <div className="h-4 w-1/3 bg-muted/50 rounded" />
              <div className="h-4 w-24 bg-muted/40 rounded" />
              <div className="h-6 w-16 bg-muted/50 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

