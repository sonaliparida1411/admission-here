export default function CollegeDetailLoading() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Hero */}
      <div className="h-48 md:h-64 w-full bg-muted rounded-2xl" />
      {/* Header */}
      <div className="flex gap-4 items-start">
        <div className="h-20 w-20 bg-muted rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-3/4 bg-muted rounded-lg" />
          <div className="h-4 w-1/2 bg-muted rounded" />
          <div className="h-4 w-1/3 bg-muted rounded" />
        </div>
      </div>
      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-muted rounded-lg" />
        ))}
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-32 bg-muted rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

