import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PROMPTS = [
  "An app that connects local home cooks with hungry neighbors",
  "A tool that turns voice notes into polished blog posts",
  "A marketplace for renting camping gear from people nearby",
  "A site that matches retirees with volunteer opportunities",
];

export default function IdeaInput() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!idea.trim() || loading) return;
    setLoading(true);
    try {
      const record = await base44.entities.IdeaSubmission.create({
        idea_text: idea.trim(),
        builder_name: name.trim() || "Anonymous Builder",
        status: "generating",
      });
      navigate(`/submission/${record.id}`);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-2 glow-ring">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="Describe your idea in your own words... the more detail, the better the MVP."
          rows={4}
          className="w-full bg-transparent resize-none px-4 py-4 text-base placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3 px-3 pb-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="bg-white/5 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 w-40 sm:w-52"
          />
          <button
            onClick={submit}
            disabled={!idea.trim() || loading}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.45)] transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Starting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Build My MVP
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground/70">Try:</span>
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setIdea(p)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}