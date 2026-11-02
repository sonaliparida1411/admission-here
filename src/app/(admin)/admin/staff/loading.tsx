export default function StaffLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-40 bg-muted rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl" />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 w-full bg-muted rounded-xl" />
      ))}
    </div>
  );
}

