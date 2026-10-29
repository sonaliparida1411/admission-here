import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Save, Building2, BookOpen, Award, Briefcase, Eye } from "lucide-react";

interface EditCollegePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollegePage({ params }: EditCollegePageProps) {
  const { id } = await params;

  const college = await db.college.findUnique({
    where: { id },
    include: {
      courses: {
        include: { course: true },
      },
      placements: true,
      rankings: true,
    },
  });

  if (!college) notFound();

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/colleges"
            className="p-2 rounded-lg border hover:bg-accent text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Manage Institutional Profile: {college.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure 9 public profile tabs: Courses & Fees, Cutoffs, Placements, Rankings, FAQs.
            </p>
          </div>
        </div>

        <Link
          href={`/college/${college.slug}`}
          target="_blank"
          className="px-4 py-2 rounded-lg border bg-background hover:bg-accent text-xs font-bold flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Public Profile</span>
        </Link>
      </div>

      {/* Tabs Manager Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tab 1: Basic Info & NIRF */}
        <div className="p-5 rounded-2xl border bg-card space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Tab 1: Overview & Location</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {college.city}, {college.state} • NIRF #{college.nirfRank || "Unranked"}
          </p>
          <div className="text-[11px] text-muted-foreground">
            Rating: ★ {college.ratingOverall} ({college.reviewCount} reviews)
          </div>
        </div>

        {/* Tab 2: Courses & Fees */}
        <div className="p-5 rounded-2xl border bg-card space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Tab 2: Courses & Fees</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {college.courses.length} active academic programs mapped with fee structures and seat intakes.
          </p>
          <span className="text-[11px] font-bold text-emerald-600 block">
            Verified Fee Schemas Active
          </span>
        </div>

        {/* Tab 3: Placements & Rankings */}
        <div className="p-5 rounded-2xl border bg-card space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-600" />
            <span>Tab 5: Placements & CTC</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {college.placements.length > 0
              ? `${college.placements.length} audited placement batch records`
              : "No historical placement batches logged"}
          </p>
          <span className="text-[11px] font-bold text-primary block">
            Highest CTC & Top Recruiters Active
          </span>
        </div>
      </div>

      {/* Course Offerings Table */}
      <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-foreground">
          Mapped Academic Courses & Tuition Fees
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b font-bold text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-3">Program & Branch</th>
                <th className="p-3">Tuition Fee</th>
                <th className="p-3">First Year Fee</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Accepted Exams</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {college.courses.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-semibold">
                    {c.course.degree} in {c.specialization}
                  </td>
                  <td className="p-3 font-bold text-primary">₹{(c.totalFeesInr / 100000).toFixed(2)} Lakh</td>
                  <td className="p-3">{c.firstYearFeesInr ? `₹${(c.firstYearFeesInr / 100000).toFixed(2)} Lakh` : "—"}</td>
                  <td className="p-3">{c.intakeSeats || "N/A"}</td>
                  <td className="p-3 uppercase font-mono text-[10px]">
                    {c.acceptedExamSlugs.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

