/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Interactive completion badges and milestone tracking must compute directly from progress state without inline implementation commentary.

import { useState } from "react";
import { Trophy, CheckCircle2, Award, Sparkles, X, Lock } from "lucide-react";
import { useHydrated, useProgress } from "@/lib/progress";
import { modules, totalLessons } from "@/data/course";

export interface BadgeDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly requiredCount?: number;
  readonly requiredModuleNumber?: number;
}

export const courseBadges: readonly BadgeDefinition[] = [
  {
    id: "first_step",
    title: "Visionary Pioneer",
    description: "Completed your very first lesson in Webcam Boxing.",
    icon: "🥊",
    requiredCount: 1,
  },
  {
    id: "python_setup",
    title: "Python & CV Ready",
    description: "Completed Module 6: Using OpenCV to open camera streams.",
    icon: "🐍",
    requiredModuleNumber: 6,
  },
  {
    id: "mediapipe_master",
    title: "MediaPipe Master",
    description: "Completed Module 8: MediaPipe Hand Tracking & Landmarks.",
    icon: "🖐️",
    requiredModuleNumber: 8,
  },
  {
    id: "punch_architect",
    title: "Punch Detector Architect",
    description: "Completed Module 12: Building a velocity-driven punch detector.",
    icon: "⚡",
    requiredModuleNumber: 12,
  },
  {
    id: "fsm_tactician",
    title: "FSM Tactician",
    description: "Completed Module 17: Enemy state machine & AI behavior.",
    icon: "🤖",
    requiredModuleNumber: 17,
  },
  {
    id: "arena_champion",
    title: "Arena Champion",
    description: "Completed Module 21: The full real-time game loop.",
    icon: "🏆",
    requiredModuleNumber: 21,
  },
  {
    id: "grandmaster",
    title: "Webcam Boxing Grandmaster",
    description: "Completed all 25 modules and unlocked the full game!",
    icon: "👑",
    requiredCount: totalLessons,
  },
];

export function CompletionBadgesDialog() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const { completed } = useProgress();

  const completedKeys = hydrated ? Object.keys(completed).filter((k) => completed[k]) : [];
  const completedCount = completedKeys.length;

  const earnedBadges = courseBadges.filter((b) => {
    if (b.requiredCount !== undefined && completedCount >= b.requiredCount) {
      return true;
    }
    if (b.requiredModuleNumber !== undefined) {
      const targetMod = modules.find((m) => m.number === b.requiredModuleNumber);
      if (!targetMod) return false;
      return targetMod.lessons.every((l) => completed[`${targetMod.id}:${l.id}`]);
    }
    return false;
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        aria-label="View achievements and completion badges"
      >
        <Trophy
          className={`h-3.5 w-3.5 ${earnedBadges.length > 0 ? "text-amber-500" : "text-muted-foreground"}`}
        />
        <span className="hidden md:inline">Badges</span>
        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
          {earnedBadges.length}/{courseBadges.length}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="font-display text-xl leading-none">Trophy Room & Badges</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Earn interactive badges by completing modules and hitting milestones across the
              25-module roadmap.
            </p>

            <div className="mt-5 max-h-80 space-y-3 overflow-y-auto pr-1">
              {courseBadges.map((b) => {
                const isEarned = earnedBadges.some((e) => e.id === b.id);
                return (
                  <div
                    key={b.id}
                    className={`flex items-start gap-4 rounded-lg border p-3.5 transition-all ${
                      isEarned
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-border/60 bg-muted/20 opacity-60"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-2xl shadow-sm">
                      {isEarned ? b.icon : <Lock className="h-4 w-4 text-muted-foreground" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
                        {isEarned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            <Sparkles className="h-2.5 w-2.5" /> Unlocked
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow transition-transform hover:-translate-y-0.5"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
