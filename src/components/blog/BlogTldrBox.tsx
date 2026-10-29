import { Sparkles, CheckCircle } from "lucide-react";

interface BlogTldrBoxProps {
  bullets?: string[];
}

export function BlogTldrBox({ bullets }: BlogTldrBoxProps) {
  if (!bullets || bullets.length === 0) return null;

  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/10 via-purple-950/10 to-blue-950/10 border border-primary/20 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">
          TL;DR / Quick Facts (AI & Search Engine Summary)
        </h3>
      </div>

      <ul className="space-y-2.5">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

