export default function CollegesLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-48 bg-muted rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl" />
        ))}
      </div>
      <div className="h-10 w-full bg-muted rounded-lg" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-14 w-full bg-muted rounded-xl" />
      ))}
    </div>
  );
}

