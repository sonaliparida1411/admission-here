import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Image, Building2 } from "lucide-react";

export default async function CollegeGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
  });

  if (!college) notFound();

  // Fallback high-res campus images if galleryUrls is empty
  const defaultImages = [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&fit=crop&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1000&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&fit=crop&q=80",
  ];

  const photos = college.galleryUrls.length > 0 ? college.galleryUrls : defaultImages;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {college.name} Campus Infrastructure & Photo Gallery
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          High-resolution photos of lecture halls, innovation centers, student hostels, and athletic arenas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((url, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl overflow-hidden border bg-muted aspect-4/3 shadow-xs"
          >
            <img
              src={url}
              alt={`${college.name} Campus Facility ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
              <span className="text-white text-xs font-semibold">
                Facility View #{idx + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

