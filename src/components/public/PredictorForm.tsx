"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Flame, 
  IndianRupee, 
  ChevronRight,
  ExternalLink,
  Building2,
  GraduationCap,
  MapPin
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
  const [targetCourse, setTargetCourse] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"high" | "moderate" | "low">("high");
  const [results, setResults] = useState<{
    highChance: any[];
    moderateChance: any[];
    lowChance: any[];
  } | null>(null);
  const [insufficientData, setInsufficientData] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank) return;

    setLoading(true);
    setInsufficientData(false);
    setMessage(null);

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
          targetCourse: targetCourse === "ALL" ? null : targetCourse,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.insufficientData) {
          setInsufficientData(true);
          setMessage(json.message);
          setResults(null);
        } else {
          setResults(json.predictions);
          // Set active tab to first non-empty category
          if (json.predictions.highChance.length > 0) {
            setActiveTab("high");
          } else if (json.predictions.moderateChance.length > 0) {
            setActiveTab("moderate");
          } else {
            setActiveTab("low");
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to run college prediction engine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Predictor Input Box */}
      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-5 border-b pb-3">
          <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>AI Rank Predictor &amp; College Chance Calculator</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Compare your score against official JoSAA, CSAB, and institutional cutoff closing ranks.
          </p>
        </div>

        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Exam Select */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                1. Entrance Exam *
              </label>
              <select
                value={examSlug}
                onChange={(e) => setExamSlug(e.target.value)}
                className="w-full py-2.5 px-3 text-xs border rounded-xl bg-background font-medium outline-hidden focus:border-primary"
              >
                <option value="jee-main">JEE Main (B.Tech / NITs / IIITs)</option>
                <option value="cat">CAT (MBA / IIMs / Top B-Schools)</option>
                <option value="neet-ug">NEET UG (MBBS / Medical)</option>
              </select>
            </div>

            {/* 2. Score / Rank */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                2. All India Rank (AIR) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 14200"
                className="w-full py-2.5 px-3 text-xs border rounded-xl bg-background font-medium outline-hidden focus:border-primary"
              />
            </div>

            {/* 3. Category */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                3. Reservation Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 px-3 text-xs border rounded-xl bg-background font-medium outline-hidden focus:border-primary"
              >
                <option value="GEN">General / OPEN</option>
                <option value="OBC">OBC-NCL</option>
                <option value="EWS">GEN-EWS</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
              </select>
            </div>

            {/* 4. Quota / Domicile */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                4. Quota / Domicile *
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full py-2.5 px-3 text-xs border rounded-xl bg-background font-medium outline-hidden focus:border-primary"
              >
                <option value="HS">Home State (HS Quota)</option>
                <option value="AI">All India (AI Quota)</option>
                <option value="OS">Other State (OS Quota)</option>
                <option value="ALL">All Quotas</option>
              </select>
            </div>

            {/* 5. Target Course */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                5. Target Course / Branch
              </label>
              <select
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                className="w-full py-2.5 px-3 text-xs border rounded-xl bg-background font-medium outline-hidden focus:border-primary"
              >
                <option value="ALL">All Available Courses</option>
                <option value="Computer Science">Computer Science &amp; Engineering</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Management">Management (MBA / PGP)</option>
                <option value="Medical">Medicine (MBBS)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Predictions derived from official closing ranks without fake data extrapolation.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-60"
              style={{ background: "#c41e1e" }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calculating Admission Probabilities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Predict My College and Chances</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Insufficient Data State */}
      {insufficientData && (
        <div className="p-6 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Reliable Prediction Unavailable</span>
          </div>
          <p className="text-xs leading-relaxed">
            {message || "Sufficient verified historical cutoff records are not currently available for this category and score combination. Predictions cannot be reliably determined. Do not rely on fabricated estimates."}
          </p>
          <div className="pt-2">
            <Link
              href="/colleges"
              className="text-xs font-bold underline hover:opacity-80"
            >
              Explore all verified colleges in the general directory &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Prediction Results Display */}
      {results && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Chance Categories Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("high")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "high"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>High Chance ({results.highChance.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("moderate")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "moderate"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Moderate Chance ({results.moderateChance.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("low")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "low"
                  ? "bg-slate-700 text-white shadow-xs"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Low Chance / Reach ({results.lowChance.length})</span>
            </button>
          </div>

          {/* Cards for Active Category */}
          {(() => {
            const list =
              activeTab === "high"
                ? results.highChance
                : activeTab === "moderate"
                ? results.moderateChance
                : results.lowChance;

            if (list.length === 0) {
              return (
                <div className="p-8 text-center rounded-2xl border bg-muted/20 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    No colleges match this admission chance tier for rank #{rank}.
                  </p>
                  <p className="mt-1">
                    Try checking the other chance tabs or adjust your quota and category filters.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border bg-card shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                            activeTab === "high"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : activeTab === "moderate"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              : "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/20"
                          }`}
                        >
                          {item.chanceCategory}
                        </span>

                        {item.nirfRank && (
                          <span className="text-[10px] font-bold text-muted-foreground">
                            NIRF #{item.nirfRank}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {item.collegeName}
                      </h3>

                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{item.city}, {item.state}</span>
                      </p>

                      <div className="p-3 rounded-xl bg-muted/30 border space-y-1 text-xs">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-primary" />
                          <span>{item.degree} in {item.specialization}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span>Closing Rank: <strong className="text-foreground font-mono">#{item.closingRank}</strong></span>
                          <span>•</span>
                          <span>Quota: <strong className="text-foreground">{item.quota}</strong></span>
                          <span>•</span>
                          <span>Category: <strong className="text-foreground">{item.category}</strong></span>
                        </div>
                        {item.fees && (
                          <div className="text-[11px] text-muted-foreground pt-0.5">
                            Tuition: <strong className="text-foreground">{formatInr(item.fees)}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Verified {item.academicYear} Round {item.round}
                      </span>
                      <Link
                        href={`/college/${item.collegeSlug}`}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>View College Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
