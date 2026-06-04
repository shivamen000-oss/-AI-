import { useState } from "react";
import { Github, GitBranch, ExternalLink, Upload, Download, Server, Cloud, KeyRound, Check } from "lucide-react";

export type Phase = "Prototype" | "Local Dev" | "Production Debug";
export type Mode = "Free" | "Pro";

export interface Project {
  id: string;
  name: string;
  description: string;
  repo: string;
  branch: string;
  model: string;
  phase: Phase;
  mode: Mode;
  ollamaUrl: string;
  apiProvider: "Anthropic" | "OpenAI";
  apiKey: string;
  updatedAt: string;
}

const phaseTone: Record<Phase, string> = {
  Prototype: "bg-accent/10 text-accent border-accent/20",
  "Local Dev": "bg-success/10 text-success border-success/20",
  "Production Debug": "bg-warning/10 text-warning border-warning/20",
};

interface Props {
  project: Project;
  onChange: (p: Project) => void;
}

export function ProjectCard({ project, onChange }: Props) {
  const [pushed, setPushed] = useState(false);
  const isPro = project.mode === "Pro";

  const handleGit = (action: "push" | "pull") => {
    setPushed(true);
    setTimeout(() => setPushed(false), 1500);
    console.log(`[${project.name}] git ${action} -> ${project.repo}`);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold tracking-tight truncate">{project.name}</h3>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${phaseTone[project.phase]}`}>
                {project.phase}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{project.description}</p>
          </div>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Open repo"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground truncate">
            <Github className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.repo.replace("https://github.com/", "")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GitBranch className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.branch}</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Model: <span className="text-foreground font-mono">{project.model}</span>
        </div>
      </div>

      {/* Mode switcher */}
      <div className="p-5 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Runtime Mode
          </span>
          <div className="inline-flex rounded-md border border-border bg-secondary p-0.5">
            {(["Free", "Pro"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => onChange({ ...project, mode: m })}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  project.mode === m
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "Free" ? "Free · Local" : "Pro · Cloud"}
              </button>
            ))}
          </div>
        </div>

        {!isPro ? (
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Server className="h-3.5 w-3.5" /> Ollama Endpoint
            </label>
            <input
              value={project.ollamaUrl}
              onChange={(e) => onChange({ ...project, ollamaUrl: e.target.value })}
              className="w-full text-xs font-mono px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="http://host.docker.internal:11434"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              {(["Anthropic", "OpenAI"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => onChange({ ...project, apiProvider: p })}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border ${
                    project.apiProvider === p
                      ? "border-foreground/30 bg-secondary text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Cloud className="h-3 w-3" /> {p}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <KeyRound className="h-3.5 w-3.5" /> API Key
            </label>
            <input
              type="password"
              value={project.apiKey}
              onChange={(e) => onChange({ ...project, apiKey: e.target.value })}
              className="w-full text-xs font-mono px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={project.apiProvider === "Anthropic" ? "sk-ant-..." : "sk-..."}
            />
          </div>
        )}
      </div>

      {/* GitHub actions */}
      <div className="p-4 flex items-center justify-between gap-2 bg-secondary/40">
        <span className="text-xs text-muted-foreground">Updated {project.updatedAt}</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleGit("pull")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-card hover:bg-secondary transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Pull
          </button>
          <button
            onClick={() => handleGit("push")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {pushed ? <Check className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
            {pushed ? "Pushed" : "Push"}
          </button>
        </div>
      </div>
    </div>
  );
}