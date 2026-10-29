"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewCollegePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Odisha");
  const [ownershipType, setOwnershipType] = useState("PUBLIC_GOVERNMENT");
  const [nirfRank, setNirfRank] = useState("");
  const [naacGrade, setNaacGrade] = useState("A++");
  const [campusAreaAcres, setCampusAreaAcres] = useState("");
  const [overviewHtml, setOverviewHtml] = useState(
    "<p>Enter comprehensive institutional overview and history here...</p>"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/cms/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortName,
          slug,
          city,
          state,
          ownershipType,
          nirfRank: nirfRank ? parseInt(nirfRank, 10) : null,
          naacGrade,
          campusAreaAcres: campusAreaAcres ? parseFloat(campusAreaAcres) : null,
          overviewHtml,
        }),
      });

      if (res.ok) {
        router.push("/admin/colleges");
      } else {
        const json = await res.json();
        setError(json.error || "Failed to create college profile");
      }
    } catch (err) {
      setError("Network error while creating college profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/colleges"
          className="p-2 rounded-lg border hover:bg-accent text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Onboard New Institutional Profile
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter verified details for NIRF indexing, schema generation, and SEO directory discovery.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
              Full Official Institution Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. National Institute of Technology Rourkela"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Short Name / Abbreviation
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="e.g. NIT Rourkela"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Canonical URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. nit-rourkela"
              className="w-full text-xs font-mono border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Rourkela"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              State *
            </label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Odisha"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Ownership Type
            </label>
            <select
              value={ownershipType}
              onChange={(e) => setOwnershipType(e.target.value)}
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background"
            >
              <option value="PUBLIC_GOVERNMENT">Public / Government</option>
              <option value="PRIVATE">Private</option>
              <option value="DEEMED">Deemed to be University</option>
              <option value="AUTONOMOUS">Autonomous</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              NIRF Rank (2025)
            </label>
            <input
              type="number"
              value={nirfRank}
              onChange={(e) => setNirfRank(e.target.value)}
              placeholder="e.g. 16"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Overview & Campus Life HTML
          </label>
          <textarea
            rows={5}
            value={overviewHtml}
            onChange={(e) => setOverviewHtml(e.target.value)}
            className="w-full text-xs font-mono border rounded-lg p-3 bg-background outline-hidden focus:border-primary"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link
            href="/admin/colleges"
            className="px-4 py-2 rounded-lg border text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Create Institutional Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}

