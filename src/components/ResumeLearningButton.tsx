import { Link } from "@tanstack/react-router";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { modules } from "@/data/course";
import { useProgress, useHydrated, lessonKey } from "@/lib/progress";

export function ResumeLearningButton({ variant = "default" }: { variant?: "default" | "header" }) {
  const hydrated = useHydrated();
  const { completed } = useProgress();

  if (!hydrated) {
    if (variant === "header") return null;
    return (
      <button
        disabled
        className="neo-btn rounded-xl bg-primary/50 px-8 py-3.5 font-bold text-primary-foreground opacity-50 cursor-not-allowed"
      >
        Loading Progress...
      </button>
    );
  }

  let nextLesson = null;
  let allCompleted = true;

  for (const m of modules) {
    for (const l of m.lessons) {
      if (!completed[lessonKey(m.id, l.id)]) {
        nextLesson = { module: m, lesson: l };
        allCompleted = false;
        break;
      }
    }
    if (nextLesson) break;
  }

  if (allCompleted) {
    if (variant === "header") return null;
    return (
      <Link
        to="/curriculum"
        className="neo-btn inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-3.5 font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-green-500/25"
      >
        <CheckCircle2 className="h-5 w-5" />
        Course Completed!
      </Link>
    );
  }

  const dest = nextLesson
    ? { moduleId: nextLesson.module.id, lessonId: nextLesson.lesson.id }
    : { moduleId: modules[0].id, lessonId: modules[0].lessons[0].id };

  const isStarted = Object.keys(completed).length > 0;

  if (variant === "header") {
    return (
      <Link
        to="/lessons/$moduleId/$lessonId"
        params={dest}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary backdrop-blur transition-all hover:bg-primary/20 hover:border-primary/60 shadow-sm"
        title="Resume Learning"
      >
        <PlayCircle className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Resume</span>
      </Link>
    );
  }

  return (
    <Link
      to="/lessons/$moduleId/$lessonId"
      params={dest}
      className="neo-btn inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/30"
    >
      <PlayCircle className="h-5 w-5" />
      {isStarted ? `Resume: ${nextLesson?.lesson.title}` : "Start Learning"}
    </Link>
  );
}
