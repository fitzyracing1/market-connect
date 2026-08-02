import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SubmissionCard from "@/components/SubmissionCard";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.IdeaSubmission.list("-created_date", 50);
        setItems(list);
      } catch (e) {
        setItems([]);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen aurora-bg">
      <Navbar />
      <div className="pt-28 pb-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              The <span className="aurora-text">Build Gallery</span>
            </h1>
            <p className="text-muted-foreground mt-2">Every MVP generated on Market Connect.</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.4)] transition-all"
          >
            <Sparkles className="w-4 h-4" /> New Build
          </Link>
        </div>

        {items === null ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-muted-foreground">No builds yet. Be the first.</p>
            <Link to="/" className="inline-flex mt-5 items-center gap-2 text-primary hover:underline text-sm">
              <Sparkles className="w-4 h-4" /> Start building →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((s) => (
              <SubmissionCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}