import { LayoutDashboard, FolderKanban, Settings, Github, Cpu, Activity } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: FolderKanban, label: "Projects" },
  { icon: Cpu, label: "Models" },
  { icon: Github, label: "GitHub" },
  { icon: Activity, label: "Logs" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-card h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight">Hybrid AI</div>
            <div className="text-xs text-muted-foreground">Control Center</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => (
          <button
            key={it.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              it.active
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-md bg-secondary p-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success" />
            Ollama online
          </div>
          <div className="mt-1 text-muted-foreground/80 truncate">
            host.docker.internal:11434
          </div>
        </div>
      </div>
    </aside>
  );
}