import React, { useState } from "react";
import {
  X,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Zap,
  ExternalLink,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { marvelAudio } from "../marvel/MarvelAudioEngine";
import { triggerShieldSuccess } from "../marvel/MarvelCelebrations";

export interface CourseDetail {
  title: string;
  provider: string;
  category: string;
  skill: string;
  difficulty: string;
  duration: string;
  progress: number;
  relevance?: string;
  description?: string;
  modules?: {
    id: number;
    title: string;
    duration: string;
    completed: boolean;
  }[];
}

interface CourseDetailModalProps {
  course: CourseDetail | null;
  onClose: () => void;
}

const DEFAULT_MODULES = [
  { id: 1, title: "1. Core Foundations & Paradigm Setup", duration: "45 mins", completed: true },
  { id: 2, title: "2. Deep Dive: Memory Allocation & Optimization", duration: "1 hr 15 mins", completed: true },
  { id: 3, title: "3. Real-World Architectures & Hands-On Lab", duration: "1 hr 30 mins", completed: false },
  { id: 4, title: "4. Deployment, Benchmarks & Edge Packaging", duration: "50 mins", completed: false },
  { id: 5, title: "5. Capstone Assessment & Passport Credential", duration: "1 hr", completed: false },
];

export function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  if (!course) return null;

  const [modules, setModules] = useState(course.modules || DEFAULT_MODULES);
  const [completedCount, setCompletedCount] = useState(
    modules.filter((m) => m.completed).length
  );
  const [activeModule, setActiveModule] = useState(modules[0]);

  const progressPercent = Math.round((completedCount / modules.length) * 100);

  function toggleModule(id: number) {
    marvelAudio.playRepulsorClick();
    setModules((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      );
      const newCount = updated.filter((m) => m.completed).length;
      setCompletedCount(newCount);
      if (newCount === updated.length) {
        marvelAudio.playVibraniumChime();
        triggerShieldSuccess("Course Completed! Verified on Passport.");
      }
      return updated;
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0E1017] border border-[#EC1D24]/40 rounded-2xl shadow-[0_0_60px_rgba(236,29,36,0.25)] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#171321] to-[#0E1017]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-red-300 font-bold uppercase tracking-widest">
                {course.provider}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {course.category} · {course.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-wide">
              {course.title}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          {/* Progress Banner */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                Course Progress: {completedCount} of {modules.length} modules completed
              </span>
              <span className="text-sm font-bold text-[#EC1D24]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-[#FFD700] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Highlights & Skills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-[10px] text-zinc-500">Duration</p>
              <p className="font-bold text-white text-xs">{course.duration}</p>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
              <Zap className="w-4 h-4 text-[#00F0FF] mx-auto mb-1" />
              <p className="text-[10px] text-zinc-500">Primary Skill</p>
              <p className="font-bold text-white text-xs">{course.skill}</p>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
              <Shield className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-[10px] text-zinc-500">Assessment</p>
              <p className="font-bold text-white text-xs">Verified Lab</p>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
              <Award className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-[10px] text-zinc-500">Passport Stone</p>
              <p className="font-bold text-white text-xs">Mind Stone</p>
            </div>
          </div>

          {/* Module Syllabus */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#EC1D24]" />
              Curriculum Syllabus
            </h3>
            <div className="space-y-2">
              {modules.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleModule(m.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    m.completed
                      ? "bg-red-950/20 border-red-500/40 text-white"
                      : "bg-black/40 border-white/5 text-zinc-300 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        m.completed
                          ? "bg-[#EC1D24] border-[#EC1D24] text-white"
                          : "border-white/20 bg-black/50"
                      }`}
                    >
                      {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <p className={`text-xs font-sans font-bold ${m.completed ? "line-through text-zinc-500" : "text-white"}`}>
                        {m.title}
                      </p>
                      <span className="text-[10px] text-zinc-500 font-mono">{m.duration}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {m.completed ? "Completed" : "Start"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <p className="text-[11px] font-mono text-zinc-400">
            Completing this track lifts your role match score by up to <span className="text-red-400 font-bold">+12%</span>.
          </p>
          <button
            onClick={() => {
              marvelAudio.playVibraniumChime();
              triggerShieldSuccess("Course workspace launched!");
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#EC1D24] hover:bg-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.4)] flex items-center gap-2 shrink-0"
          >
            <Play className="w-3.5 h-3.5 text-amber-300" />
            Resume Training
          </button>
        </div>
      </div>
    </div>
  );
}
