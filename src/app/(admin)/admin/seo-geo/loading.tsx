export default function SeoGeoLoading() {
  return (
    <div className="space-y-4 animate-pulse p-6">
      <div className="h-8 w-48 bg-muted rounded-lg" />
      <div className="grid grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

