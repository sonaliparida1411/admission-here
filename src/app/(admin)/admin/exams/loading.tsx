export default function ExamsLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-40 bg-muted rounded-lg" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-14 w-full bg-muted rounded-xl" />
      ))}
    </div>
  );
}

