export default function StaffBlogsLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-48 bg-muted rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl" />
        ))}
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 w-full bg-muted rounded-xl" />
      ))}
    </div>
  );
}

