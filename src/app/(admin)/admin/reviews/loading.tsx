export default function ReviewsLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-40 bg-muted rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-36 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

