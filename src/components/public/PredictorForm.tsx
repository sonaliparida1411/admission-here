"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  IndianRupee, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { formatInr } from "@/lib/utils";

interface PredictorFormProps {
  initialExamSlug?: string;
}

export function PredictorForm({ initialExamSlug = "jee-main" }: PredictorFormProps) {
  const [examSlug, setExamSlug] = useState(initialExamSlug);
  const [rank, setRank] = useState("14200");
  const [category, setCategory] = useState("GEN");
  const [quota, setQuota] = useState("HS");
  const [homeState, setHomeState] = useState("Odisha");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank) return;

    setLoading(true);
    try {
      const res = await fetch("/api/v1/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug,
          rank: Number(rank),
          category,
          quota,
          homeState,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setResults(json.predictions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Predictor Input Box */}
      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Exam Select */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Entrance Exam
              </label>
              <select
                value={examSlug}
                onChange={(e) => setExamSlug(e.target.value)}
                className="w-full py-2.5 px-3 text-xs border rounded-lg bg-background font-medium outline-hidden focus:border-primary"
              >
                <option value="jee-main">JEE Main (B.Tech / NITs)</option>
                <option value="cat">CAT (MBA / IIMs)</option>
                <option value="neet-ug">NEET UG (Medical / MBBS)</option>
              </select>
            </div>

            {/* Score / Rank */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                All India Rank (AIR) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 14200"
                className="w-full py-2.5 px-3 text-xs border rounded-lg bg-background font-medium outline-hidden focus:border-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Reservation Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 px-3 text-xs border rounded-lg bg-background font-medium outline-hidden focus:border-primary"
              >
                <option value="GEN">General (Open)</option>
                <option value="OBC">OBC-NCL</option>
                <option value="EWS">GEN-EWS</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
              </select>
            </div>

            {/* Quota */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Quota Preference
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full py-2.5 px-3 text-xs border rounded-lg bg-background font-medium outline-hidden focus:border-primary"
              >
                <option value="HS">Home State (HS Quota)</option>
                <option value="OS">Other State (OS Quota)</option>
                <option value="AI">All India (AI)</option>
              </select>
            </div>

            {/* Home State */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Home State Domicile
              </label>
              <input
                type="text"
                value={homeState}
                onChange={(e) => setHomeState(e.target.value)}
                placeholder="e.g. Odisha"
                className="w-full py-2.5 px-3 text-xs border rounded-lg bg-background font-medium outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Predict My Colleges & Chances</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* High Chance Box */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  High Probability Colleges ({results.highChance?.length || 0})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your rank is comfortably within previous years closing cutoff thresholds.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.highChance?.length > 0 ? (
                results.highChance.map((item: any, idx: number) => (
                  <PredictorResultCard key={idx} item={item} badgeColor="emerald" />
                ))
              ) : (
                <div className="col-span-2 p-6 border rounded-xl text-center text-xs text-muted-foreground">
                  No high probability matches found for this specific rank and quota. Check Medium Chance or state counseling options below.
                </div>
              )}
            </div>
          </div>

          {/* Medium / Competitive Chance Box */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Medium / Competitive Chances ({results.mediumChance?.length || 0})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Borderline cutoffs; chances depend on round progression (R2, R3, and Spot Round).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.mediumChance?.map((item: any, idx: number) => (
                <PredictorResultCard key={idx} item={item} badgeColor="amber" />
              ))}
            </div>
          </div>

          {/* Dream Colleges */}
          {results.dreamChance?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Aspirational / Dream Targets ({results.dreamChance.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Aggressive options requiring higher scores; good for top JoSAA choice preference filling.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.dreamChance.slice(0, 4).map((item: any, idx: number) => (
                  <PredictorResultCard key={idx} item={item} badgeColor="purple" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PredictorResultCard({ item, badgeColor }: { item: any; badgeColor: string }) {
  const getBadgeStyle = () => {
    if (badgeColor === "emerald") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    if (badgeColor === "amber") return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    return "bg-purple-500/10 text-purple-700 border-purple-500/20";
  };

  return (
    <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <Link
              href={`/college/${item.collegeSlug}`}
              className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <span>{item.collegeName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.city}, {item.state} • NIRF #{item.nirfRank || "Unranked"}
            </p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
            Closing Rank: #{item.closingRank.toLocaleString()}
          </span>
        </div>

        <div className="text-xs font-semibold text-foreground pt-1">
          {item.degree} in {item.specialization}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 pt-2 border-t">
          <span>Quota: <strong>{item.quota}</strong></span>
          <span>Category: <strong>{item.category}</strong></span>
          <span>Fees: <strong>{formatInr(item.fees)}</strong></span>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t flex justify-end">
        <Link
          href={`/college/${item.collegeSlug}/cutoff`}
          className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5"
        >
          <span>View Complete Round Cutoffs</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

