export default function UsersLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-36 bg-muted rounded-lg" />
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-12 w-full bg-muted rounded-xl" />
      ))}
    </div>
  );
}

