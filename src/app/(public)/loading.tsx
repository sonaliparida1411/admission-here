export default function PublicLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="space-y-3 border-b pb-6">
        <div className="h-4 w-32 bg-muted/50 rounded-full" />
        <div className="h-8 w-72 sm:w-96 bg-muted/70 rounded-xl" />
        <div className="h-4 w-full max-w-xl bg-muted/40 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-muted/60 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-muted/60 rounded" />
                <div className="h-3 w-1/2 bg-muted/40 rounded" />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <div className="h-3 w-full bg-muted/40 rounded" />
              <div className="h-3 w-4/5 bg-muted/30 rounded" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-20 bg-muted/40 rounded" />
              <div className="h-8 w-24 bg-muted/60 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

