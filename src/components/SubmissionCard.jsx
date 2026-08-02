import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SubmissionCard({ submission }) {
  const statusMap = {
    generating: { icon: Loader2, cls: "text-primary", spin: true, label: "Generating" },
    complete: { icon: CheckCircle2, cls: "text-emerald-400", spin: false, label: "Ready" },
    error: { icon: AlertCircle, cls: "text-destructive", spin: false, label: "Error" },
    pending: { icon: Loader2, cls: "text-primary", spin: true, label: "Queued" },
  };
  const s = statusMap[submission.status] || statusMap.generating;
  const Icon = s.icon;

  return (
    <Link
      to={`/submission/${submission.id}`}
      className="group glass rounded-2xl p-5 hover:border-primary/40 hover:glow-ring transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Icon className={`w-3.5 h-3.5 ${s.cls} ${s.spin ? "animate-spin" : ""}`} />
          <span className={s.cls}>{s.label}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div>
        {submission.mvp_title ? (
          <h3 className="font-semibold text-lg leading-snug group-hover:aurora-text transition-all">
            {submission.mvp_title}
          </h3>
        ) : (
          <h3 className="font-semibold text-lg text-muted-foreground">Untitled MVP</h3>
        )}
        {submission.mvp_tagline && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{submission.mvp_tagline}</p>
        )}
      </div>

      <p className="text-sm text-muted-foreground/80 line-clamp-2">{submission.idea_text}</p>

      <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-muted-foreground/70">
        <span>by {submission.builder_name || "Anonymous"}</span>
        {submission.mvp_type && (
          <span className="px-2 py-0.5 rounded-full border border-border/70">{submission.mvp_type}</span>
        )}
      </div>
    </Link>
  );
}