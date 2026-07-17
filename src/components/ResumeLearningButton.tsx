import { Link } from "@tanstack/react-router";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { modules, type LessonListItem } from "@/data/course";
import { useProgress, useHydrated, lessonKey } from "@/lib/progress";

interface ResumeLearningButtonProps {
  readonly variant?: "default" | "header";
}

export function ResumeLearningButton({
  variant = "default",
}: ResumeLearningButtonProps): ReactElement | null {
  const hydrated = useHydrated();
  const { completed } = useProgress();

  if (!hydrated) {
    if (variant === "header") return null;
    return (
      <Button disabled className="neo-btn rounded-xl px-8 py-3.5 font-bold opacity-50">
        Loading Progress...
      </Button>
    );
  }

  let nextLesson: LessonListItem | null = null;
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
      <Button asChild className="neo-btn gap-2 rounded-xl bg-green-500 px-8 py-3.5 font-bold">
        <Link to="/curriculum">
          <CheckCircle2 className="h-5 w-5" />
          Course Completed!
        </Link>
      </Button>
    );
  }

  const dest = nextLesson
    ? { moduleId: nextLesson.module.id, lessonId: nextLesson.lesson.id }
    : { moduleId: modules[0].id, lessonId: modules[0].lessons[0].id };

  const isStarted = Object.keys(completed).length > 0;

  if (variant === "header") {
    return (
      <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs">
        <Link to="/lessons/$moduleId/$lessonId" params={dest} title="Resume Learning">
          <PlayCircle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Resume</span>
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild className="neo-btn gap-2 rounded-xl px-8 py-3.5 font-bold">
      <Link to="/lessons/$moduleId/$lessonId" params={dest}>
        <PlayCircle className="h-5 w-5" />
        {isStarted ? `Resume: ${nextLesson?.lesson.title}` : "Start Learning"}
      </Link>
    </Button>
  );
}
