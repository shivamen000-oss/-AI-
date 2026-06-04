import { FolderGit2, Cpu, Cloud, Zap } from "lucide-react";

const stats = [
  { label: "Active Projects", value: "12", delta: "+2 this week", icon: FolderGit2, tone: "text-accent" },
  { label: "Local Models", value: "4", delta: "Ollama runtime", icon: Cpu, tone: "text-success" },
  { label: "Cloud Calls (24h)", value: "1,284", delta: "$3.42 spent", icon: Cloud, tone: "text-warning" },
  { label: "Avg. Latency", value: "212ms", delta: "-18ms vs yday", icon: Zap, tone: "text-accent" },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border bg-card p-5 hover:border-foreground/20 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
            <s.icon className={`h-4 w-4 ${s.tone}`} />
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
        </div>
      ))}
    </div>
  );
}