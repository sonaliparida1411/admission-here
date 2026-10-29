import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

interface StaffAccessDeniedProps {
  featureName: string;
  allowedFeatures?: string[];
}

export function StaffAccessDenied({
  featureName,
  allowedFeatures = [],
}: StaffAccessDeniedProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
        style={{ background: "rgba(196, 30, 30, 0.12)", color: "#c41e1e" }}>
        <ShieldAlert className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: "rgba(196, 30, 30, 0.1)", color: "#c41e1e" }}>
          <Lock className="w-3.5 h-3.5" />
          Restricted Staff Permission
        </span>
        <h2 className="text-2xl font-extrabold text-foreground">
          Access Denied: {featureName}
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Your staff account does not have permission to manage this section.
          The Super Administrator has not granted you access to this module.
        </p>
      </div>

      {allowedFeatures.length > 0 && (
        <div className="p-4 rounded-xl border bg-card text-left max-w-md mx-auto space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Your Permitted Modules:
          </p>
          <div className="flex flex-wrap gap-2">
            {allowedFeatures.map((feat) => (
              <Link
                key={feat}
                href={`/admin/${feat === "dashboard" ? "" : feat}`}
                className="px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors"
                style={{ background: "rgba(26, 48, 104, 0.1)", color: "#1a3068" }}
              >
                Go to {feat} &rarr;
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-opacity shadow-sm"
          style={{ background: "#1a3068" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

