import Navbar from "@/components/Navbar";
import IdeaInput from "@/components/IdeaInput";
import { Link } from "react-router-dom";
import { Sparkles, Zap, Rocket, Code2, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen aurora-bg">
      <Navbar />
      <div className="absolute inset-0 grid-fade pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-8">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
              <span className="relative rounded-full w-2 h-2 bg-primary" />
            </span>
            AI-powered MVP generation — live
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05]">
            Turn your idea into a
            <br />
            <span className="aurora-text">working MVP</span>, instantly.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Describe it in plain words. Market Connect's AI builds the product — an app, a site, or a tool — straight from your description. No code, no briefs, no waiting.
          </p>

          <div className="mt-12">
            <IdeaInput />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20 px-5 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Sparkles, title: "Describe", text: "Write your idea the way you'd explain it to a friend." },
              { icon: Zap, title: "Generate", text: "AI shapes it into a real product blueprint in seconds." },
              { icon: Rocket, title: "Launch", text: "Get a working MVP output, a landing page, and a plan." },
            ].map((step, i) => (
              <div key={step.title} className="glass rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-5 text-5xl font-bold text-white/5">0{i + 1}</div>
                <step.icon className="w-7 h-7 text-primary mb-4" />
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-primary" /> Apps</span>
            <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-accent" /> Websites</span>
            <span className="flex items-center gap-2"><Rocket className="w-4 h-4 text-emerald-400" /> Tools</span>
            <span>·</span>
            <Link to="/dashboard" className="text-primary hover:underline">See what's been built →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-10 text-center text-sm text-muted-foreground/60">
        Market Connect — ideas in, MVPs out.
      </footer>
    </div>
  );
}