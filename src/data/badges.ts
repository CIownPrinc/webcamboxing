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
    title: "First Lesson",
    description: "Completed your very first lesson in Webcam Boxing.",
    icon: "1",
    requiredCount: 1,
  },
  {
    id: "python_setup",
    title: "Python & CV Ready",
    description: "Completed Module 6: Using OpenCV to open camera streams.",
    icon: "PY",
    requiredModuleNumber: 6,
  },
  {
    id: "mediapipe_master",
    title: "MediaPipe Ready",
    description: "Completed Module 8: MediaPipe Hand Tracking & Landmarks.",
    icon: "MP",
    requiredModuleNumber: 8,
  },
  {
    id: "punch_architect",
    title: "Punch Detector Builder",
    description: "Completed Module 12: Building a velocity-driven punch detector.",
    icon: "V",
    requiredModuleNumber: 12,
  },
  {
    id: "fsm_tactician",
    title: "FSM Builder",
    description: "Completed Module 17: Enemy state machine & AI behavior.",
    icon: "FSM",
    requiredModuleNumber: 17,
  },
  {
    id: "arena_champion",
    title: "Game Loop Ready",
    description: "Completed Module 21: The full real-time game loop.",
    icon: "WIN",
    requiredModuleNumber: 21,
  },
  {
    id: "grandmaster",
    title: "Course Complete",
    description: "Completed all 25 modules and unlocked the full game.",
    icon: "ALL",
    requiredCount: totalLessons,
  },
  {
    id: "easter_egg",
    title: "The Ippo Dempsey",
    description: "You uncovered a hidden secret by rapidly clicking the logo.",
    icon: "5x",
  },
];

export function isModuleBadgeEarned(
  badge: BadgeDefinition,
  completed: Record<string, boolean>,
): boolean {
  if (badge.requiredModuleNumber === undefined) return false;
  const targetModule = modules.find(
    (moduleItem) => moduleItem.number === badge.requiredModuleNumber,
  );
  if (!targetModule) return false;
  return targetModule.lessons.every((lesson) => completed[`${targetModule.id}/${lesson.id}`]);
}
