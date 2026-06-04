import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Bell } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProjectCard, type Project } from "@/components/dashboard/ProjectCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hybrid AI Control Center" },
      { name: "description", content: "Unified dashboard to orchestrate cloud and local AI development workflows." },
      { property: "og:title", content: "Hybrid AI Control Center" },
      { property: "og:description", content: "Unified dashboard to orchestrate cloud and local AI development workflows." },
    ],
  }),
  component: Index,
});

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Atlas RAG Pipeline",
    description: "Internal knowledge-base retrieval for consulting team",
    repo: "https://github.com/acme/atlas-rag",
    branch: "main",
    model: "claude-3.5-sonnet",
    phase: "Production Debug",
    mode: "Pro",
    ollamaUrl: "http://host.docker.internal:11434",
    apiProvider: "Anthropic",
    apiKey: "sk-ant-xxxxxxxxxxxx",
    updatedAt: "2h ago",
  },
  {
    id: "2",
    name: "Lovable Landing Gen",
    description: "Marketing site generator with brand presets",
    repo: "https://github.com/acme/landing-gen",
    branch: "feat/hero-v2",
    model: "gpt-4o-mini",
    phase: "Prototype",
    mode: "Pro",
    ollamaUrl: "http://host.docker.internal:11434",
    apiProvider: "OpenAI",
    apiKey: "",
    updatedAt: "12m ago",
  },
  {
    id: "3",
    name: "Local Code Reviewer",
    description: "PR reviewer running entirely on local hardware",
    repo: "https://github.com/acme/code-reviewer",
    branch: "dev",
    model: "qwen2.5-coder:14b",
    phase: "Local Dev",
    mode: "Free",
    ollamaUrl: "http://host.docker.internal:11434",
    apiProvider: "Anthropic",
    apiKey: "",
    updatedAt: "Yesterday",
  },
  {
    id: "4",
    name: "Spec → Test Generator",
    description: "Converts product specs into Playwright tests",
    repo: "https://github.com/acme/spec2test",
    branch: "main",
    model: "llama3.1:8b",
    phase: "Local Dev",
    mode: "Free",
    ollamaUrl: "http://host.docker.internal:11434",
    apiProvider: "Anthropic",
    apiKey: "",
    updatedAt: "3d ago",
  },
];

function Index() {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.model.toLowerCase().includes(query.toLowerCase()),
  );

  const update = (next: Project) =>
    setProjects((prev) => prev.map((p) => (p.id === next.id ? next : p)));

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-center gap-3 px-6 py-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
              <p className="text-xs text-muted-foreground">
                Hybrid orchestration · Cloud (Lovable / GPT / Gemini) + Local (Ollama / Claude Code)
              </p>
            </div>
            <div className="flex-1" />
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, models…"
                className="w-72 pl-8 pr-3 py-2 text-sm rounded-md border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="p-2 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> New Project
            </button>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-[1600px]">
          <StatsCards />

          <section>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Projects</h2>
                <p className="text-xs text-muted-foreground">
                  {filtered.length} active · switch runtime per project
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent" /> Prototype
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" /> Local Dev
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Production Debug
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} onChange={update} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
