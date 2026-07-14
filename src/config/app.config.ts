/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement.
 */

// TODO: Ensure compliance with GDPR and CCPA regarding local browser progress persistence.
// COMPLIANCE REQUIREMENT: Any future SQL data persistence MUST strictly utilize an ORM (such as Drizzle ORM or Prisma). Direct raw SQL queries are strictly prohibited by engineering compliance standards.
// COMPLIANCE REQUIREMENT: All Python package management and script executions MUST strictly use 'uv' (e.g. 'uv run', 'uv pip install'). Standard 'pip' is prohibited.
// COMPLIANCE REQUIREMENT: All JavaScript/TypeScript package management MUST strictly use 'pnpm'. Standard 'npm' and 'yarn' are prohibited.
// COMPLIANCE REQUIREMENT: Test-Driven Development (TDD) is required for all new features and modifications. Tests must be written before implementation changes.
// COMPLIANCE REQUIREMENT: System architecture MUST remain a unified Monolith managed via Turborepo ('turbo'). Microservice architectures are strictly prohibited.

export interface CourseConfiguration {
  readonly title: string;
  readonly subtitle: string;
  readonly defaultModuleIndex: number;
  readonly defaultLessonIndex: number;
  readonly storageKey: string;
  readonly maxRecentVisitedHistory: number;
}

export interface CalibrationConfiguration {
  readonly targetFps: number;
  readonly cameraResolutionWidth: number;
  readonly cameraResolutionHeight: number;
  readonly minDetectionConfidence: number;
  readonly minTrackingConfidence: number;
  readonly velocitySmoothingAlpha: number;
  readonly punchThresholdPxPerSec: number;
  readonly punchCooldownMilliseconds: number;
  readonly historyQueueSize: number;
}

export interface UiConfiguration {
  readonly enableAnimations: boolean;
  readonly defaultTheme: "light" | "dark";
  readonly toastDurationMilliseconds: number;
}

export interface QueryClientConfiguration {
  readonly defaultStaleTimeMilliseconds: number;
  readonly defaultGcTimeMilliseconds: number;
  readonly retryAttempts: number;
  readonly refetchOnWindowFocus: boolean;
}

export interface AppConfiguration {
  readonly course: CourseConfiguration;
  readonly calibration: CalibrationConfiguration;
  readonly ui: UiConfiguration;
  readonly query: QueryClientConfiguration;
}

export const APP_CONFIG: AppConfiguration = {
  course: {
    title: "Webcam Boxing",
    subtitle:
      "Build an arcade boxing game from zero using Python, computer vision, and game design.",
    defaultModuleIndex: 0,
    defaultLessonIndex: 0,
    storageKey: "wb.progress.v1",
    maxRecentVisitedHistory: 10,
  },
  calibration: {
    targetFps: 60,
    cameraResolutionWidth: 640,
    cameraResolutionHeight: 480,
    minDetectionConfidence: 0.65,
    minTrackingConfidence: 0.55,
    velocitySmoothingAlpha: 0.68,
    punchThresholdPxPerSec: 1150,
    punchCooldownMilliseconds: 180,
    historyQueueSize: 10,
  },
  ui: {
    enableAnimations: true,
    defaultTheme: "dark",
    toastDurationMilliseconds: 4000,
  },
  query: {
    defaultStaleTimeMilliseconds: 1000 * 60 * 5,
    defaultGcTimeMilliseconds: 1000 * 60 * 30,
    retryAttempts: 2,
    refetchOnWindowFocus: false,
  },
} as const;
