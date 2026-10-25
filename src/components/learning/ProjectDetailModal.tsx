import React, { useState } from "react";
import {
  X,
  Play,
  CheckCircle2,
  FolderKanban,
  Code2,
  Terminal,
  ExternalLink,
  Shield,
  Sparkles,
  GitBranch,
  Layers,
  Award,
} from "lucide-react";
import { marvelAudio } from "../marvel/MarvelAudioEngine";
import { triggerShieldSuccess, triggerComicWord } from "../marvel/MarvelCelebrations";

export interface ProjectDetail {
  title: string;
  desc: string;
  skills: string[];
  difficulty: string;
  impact: string;
  duration: string;
  color?: string;
  steps?: {
    num: string;
    title: string;
    desc: string;
    completed: boolean;
  }[];
}

interface ProjectDetailModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

const DEFAULT_STEPS = [
  {
    num: "01",
    title: "Environment Setup & Virtual Workspace",
    desc: "Configure Python 3.12+ virtualenv, install PyTorch/Transformers, and establish reproducible benchmark seeds.",
    completed: true,
  },
  {
    num: "02",
    title: "Data Pipeline & Preprocessing",
    desc: "Construct high-efficiency tokenization pipelines with batching and dynamic padding.",
    completed: true,
  },
  {
    num: "03",
    title: "Core Model Integration & Optimization",
    desc: "Train / fine-tune models with FP16 mixed-precision and evaluate test-set F1 metrics.",
    completed: false,
  },
  {
    num: "04",
    title: "Containerization & Multi-Stage Dockerfile",
    desc: "Package the inference service into a minimal Docker container with non-root security.",
    completed: false,
  },
  {
    num: "05",
    title: "FastAPI REST API & Benchmarking",
    desc: "Deploy low-latency prediction endpoints with Swagger validation and 99th-percentile telemetry.",
    completed: false,
  },
];

const SAMPLE_CODE = `from fastapi import FastAPI, HTTPException
import torch

app = FastAPI(title="Stark Autonomous Lab Inference API")

@app.get("/health")
def health():
    return {"status": "ok", "cuda_available": torch.cuda.is_available()}

@app.post("/predict")
async def predict(payload: dict):
    # Verified edge latency < 35ms
    return {"prediction": "positive", "confidence": 0.984}
`;

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<"steps" | "code">("steps");
  const [steps, setSteps] = useState(project.steps || DEFAULT_STEPS);
  const [completedCount, setCompletedCount] = useState(
    steps.filter((s) => s.completed).length
  );

  function toggleStep(index: number) {
    marvelAudio.playRepulsorClick();
    setSteps((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: !updated[index].completed };
      const newCount = updated.filter((s) => s.completed).length;
      setCompletedCount(newCount);
      return updated;
    });
  }

  function handleCompleteProject(e: React.MouseEvent) {
    marvelAudio.playRepulsorClick();
    marvelAudio.playVibraniumChime();
    triggerComicWord(e.clientX, e.clientY, "BOOM!");
    triggerShieldSuccess("Project Credential Added to Skill Passport!");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0E1017] border border-[#EC1D24]/40 rounded-2xl shadow-[0_0_60px_rgba(236,29,36,0.3)] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#1E1114] to-[#0E1017]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-red-300 font-bold uppercase tracking-widest">
                Hands-on Lab
              </span>
              <span className="text-[10px] font-mono text-amber-300">
                {project.impact} Impact · {project.duration}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-wide">
              {project.title}
            </h2>
          </div>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 px-6 bg-black/40 gap-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab("steps")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "steps"
                ? "border-[#EC1D24] text-white font-bold"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#EC1D24]" />
            Milestones ({completedCount}/{steps.length})
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "code"
                ? "border-[#00F0FF] text-white font-bold"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#00F0FF]" />
            Starter Code Template
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 font-mono text-xs">
          <p className="text-zinc-300 leading-relaxed font-sans">{project.desc}</p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest mr-1">Skills Verified:</span>
            {project.skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-[10px] font-bold"
              >
                {s}
              </span>
            ))}
          </div>

          {activeTab === "steps" ? (
            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div
                  key={st.num}
                  onClick={() => toggleStep(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    st.completed
                      ? "bg-red-950/20 border-red-500/40"
                      : "bg-black/50 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-bold text-[#EC1D24] mt-0.5">{st.num}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-xs font-bold font-sans ${st.completed ? "line-through text-zinc-500" : "text-white"}`}>
                          {st.title}
                        </h4>
                        <span className="text-[10px] uppercase font-mono text-zinc-400">
                          {st.completed ? "✓ Done" : "Click to Complete"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black/80 border border-white/10 rounded-xl p-4 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-zinc-400">
                <span className="flex items-center gap-1.5 text-[10px]">
                  <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" /> main.py
                </span>
                <span className="text-[10px]">FastAPI + PyTorch Pipeline</span>
              </div>
              <pre className="text-zinc-300 font-mono text-[11px] leading-relaxed">
                {SAMPLE_CODE}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-zinc-400">
            Publishing this project adds a verified <span className="text-yellow-400 font-bold">Reality Stone</span> to your Passport.
          </span>
          <button
            onClick={handleCompleteProject}
            className="px-5 py-2.5 rounded-xl bg-[#EC1D24] hover:bg-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(236,29,36,0.4)] flex items-center gap-2 shrink-0"
          >
            <Award className="w-4 h-4 text-yellow-300" />
            Add to Skill Passport
          </button>
        </div>
      </div>
    </div>
  );
}
