export default function CollegesListLoading() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search bar */}
      <div className="h-12 w-full bg-muted rounded-xl" />
      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded-lg" />
          ))}
        </div>
        {/* Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

