export default function ExamsPublicLoading() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="h-8 w-52 bg-muted rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

