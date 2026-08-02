import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { base44 } from "@/api/base44Client";
import {
  Loader2, ArrowLeft, CheckCircle2, AlertCircle, Sparkles,
  Layers, Users, Code2, DollarSign, Rocket, FileCode2, Copy,
} from "lucide-react";

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  const load = async () => {
    const r = await base44.entities.IdeaSubmission.get(id);
    setRecord(r);
    return r;
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await load();
        if (r.status === "generating" || r.status === "pending") {
          await generate(r);
        }
      } catch (e) {
        setError(e.message || "Failed to load");
      }
    })();
  }, [id]);

  const generate = async (r) => {
    if (started.current) return;
    started.current = true;
    try {
      const prompt = `You are Market Connect's AI product builder. A person submitted the following idea:

"""${r.idea_text}"""

Generate a complete, production-ready MVP blueprint. Be specific, concrete, and ambitious.
Return JSON with:
- mvp_title: a catchy product name
- mvp_tagline: one-line value proposition
- mvp_type: one of "Web App", "Website", "Tool", "Mobile App", "Service"
- mvp_summary: 2-3 sentence overview of what the product does
- mvp_features: array of {name, description} (4-6 key features)
- mvp_audience: target audience description
- mvp_tech_stack: array of technologies/frameworks (5-7 items)
- mvp_monetization: how it makes money
- mvp_pages: array of {name, purpose} for the main pages/screens (3-5)
- mvp_next_steps: array of actionable next steps to launch (4-6)
- mvp_html: a COMPLETE standalone HTML document (with inline CSS) for a beautiful, modern landing page for this product. Use a dark theme with blue-to-violet gradients, bold typography, the product name, tagline, feature highlights, and a CTA. Must be a full valid <html> document.`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            mvp_title: { type: "string" },
            mvp_tagline: { type: "string" },
            mvp_type: { type: "string" },
            mvp_summary: { type: "string" },
            mvp_features: {
              type: "array",
              items: {
                type: "object",
                properties: { name: { type: "string" }, description: { type: "string" } },
              },
            },
            mvp_audience: { type: "string" },
            mvp_tech_stack: { type: "array", items: { type: "string" } },
            mvp_monetization: { type: "string" },
            mvp_pages: {
              type: "array",
              items: {
                type: "object",
                properties: { name: { type: "string" }, purpose: { type: "string" } },
              },
            },
            mvp_next_steps: { type: "array", items: { type: "string" } },
            mvp_html: { type: "string" },
          },
        },
      });

      await base44.entities.IdeaSubmission.update(id, { ...res, status: "complete" });
      await load();
    } catch (e) {
      await base44.entities.IdeaSubmission.update(id, { status: "error" });
      setError(e.message || "Generation failed");
      await load();
    }
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(record?.mvp_html || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (error && !record) {
    return (
      <div className="min-h-screen aurora-bg">
        <Navbar />
        <div className="pt-32 px-5 max-w-3xl mx-auto text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <button onClick={() => navigate("/")} className="mt-6 text-primary hover:underline">Back home</button>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen aurora-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Loading your build...</p>
        </div>
      </div>
    );
  }

  const isGenerating = record.status === "generating" || record.status === "pending";

  return (
    <div className="min-h-screen aurora-bg">
      <Navbar />
      <div className="pt-24 pb-20 px-5 sm:px-8 max-w-6xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> All builds
        </Link>

        {isGenerating ? (
          <GeneratingState idea={record.idea_text} />
        ) : record.status === "error" ? (
          <ErrorState idea={record.idea_text} onRetry={() => { started.current = false; generate(record); }} />
        ) : (
          <ResultView record={record} copied={copied} copyHtml={copyHtml} />
        )}
      </div>
    </div>
  );
}

function GeneratingState({ idea }) {
  const steps = ["Analyzing your idea", "Designing the product", "Writing the blueprint", "Generating landing page"];
  return (
    <div className="max-w-2xl mx-auto text-center py-10">
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-30 animate-pulse-ring" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-9 h-9 text-white animate-pulse" />
        </div>
      </div>
      <h1 className="text-3xl font-bold">Building your MVP...</h1>
      <p className="text-muted-foreground mt-3 italic">"{idea}"</p>
      <div className="mt-10 space-y-3 text-left max-w-sm mx-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 text-sm">
            <Loader2 className="w-4 h-4 text-primary animate-spin" style={{ animationDelay: `${i * 0.2}s` }} />
            <span className="text-muted-foreground">{s}...</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ idea, onRetry }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
      <h1 className="text-2xl font-semibold">Generation hit a snag</h1>
      <p className="text-muted-foreground mt-2">We couldn't finish building this one. Give it another try.</p>
      <button onClick={onRetry} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold">
        <Sparkles className="w-4 h-4" /> Retry
      </button>
    </div>
  );
}

function ResultView({ record, copied, copyHtml }) {
  const iframeRef = useRef(null);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="glass rounded-2xl p-7">
        <div className="flex items-center gap-2 text-xs text-emerald-400 mb-3">
          <CheckCircle2 className="w-4 h-4" /> MVP generated
          <span className="px-2 py-0.5 rounded-full border border-border/70 text-muted-foreground ml-2">{record.mvp_type}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight aurora-text">{record.mvp_title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{record.mvp_tagline}</p>
        <p className="text-muted-foreground/80 mt-4 leading-relaxed max-w-3xl">{record.mvp_summary}</p>
        <div className="mt-5 text-sm text-muted-foreground/70">
          Built from: <span className="italic">"{record.idea_text}"</span>
        </div>
      </div>

      {/* Landing page preview */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileCode2 className="w-4 h-4 text-primary" /> Generated Landing Page
          </div>
          <button onClick={copyHtml} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/70 hover:border-primary/50 hover:bg-primary/5 transition-colors">
            <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>
        <iframe
          ref={iframeRef}
          title="Landing Page Preview"
          srcDoc={record.mvp_html}
          className="w-full bg-white"
          style={{ height: "560px", border: "none" }}
          sandbox="allow-same-origin"
        />
      </div>

      {/* Features */}
      {record.mvp_features?.length > 0 && (
        <Section icon={Layers} title="Key Features">
          <div className="grid sm:grid-cols-2 gap-4">
            {record.mvp_features.map((f) => (
              <div key={f.name} className="glass rounded-xl p-5">
                <h3 className="font-semibold">{f.name}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Audience */}
        <Section icon={Users} title="Target Audience">
          <p className="text-sm text-muted-foreground leading-relaxed">{record.mvp_audience}</p>
        </Section>
        {/* Monetization */}
        <Section icon={DollarSign} title="Monetization">
          <p className="text-sm text-muted-foreground leading-relaxed">{record.mvp_monetization}</p>
        </Section>
      </div>

      {/* Tech stack */}
      {record.mvp_tech_stack?.length > 0 && (
        <Section icon={Code2} title="Tech Stack">
          <div className="flex flex-wrap gap-2">
            {record.mvp_tech_stack.map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-lg glass text-sm">{t}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Pages */}
      {record.mvp_pages?.length > 0 && (
        <Section icon={Layers} title="Pages & Screens">
          <div className="space-y-2">
            {record.mvp_pages.map((p) => (
              <div key={p.name} className="glass rounded-xl p-4 flex items-start gap-4">
                <div className="font-semibold min-w-[140px]">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.purpose}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Next steps */}
      {record.mvp_next_steps?.length > 0 && (
        <Section icon={Rocket} title="Launch Plan">
          <ol className="space-y-3">
            {record.mvp_next_steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-muted-foreground pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}