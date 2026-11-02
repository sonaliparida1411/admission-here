export default function LeadsLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-44 bg-muted rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-2xl" />
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-1 min-h-[400px] bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

