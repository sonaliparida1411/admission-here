export default function ApprovalsLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-60 bg-muted rounded-lg" />
      <div className="h-20 w-full bg-muted rounded-2xl" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 w-full bg-muted rounded-xl" />
      ))}
    </div>
  );
}

