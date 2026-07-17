/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: Project architecture explorer must clearly document module boundaries and individual file responsibilities without inline implementation commentary.

import { useState } from "react";
import {
  FileCode,
  Folder,
  ChevronRight,
  CheckCircle2,
  Layers,
  Cpu,
  Eye,
  Shield,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

interface FileResponsibility {
  readonly filename: string;
  readonly role: string;
  readonly responsibility: string;
  readonly keyFunctions: readonly string[];
  readonly imports: readonly string[];
  readonly codeSkeleton: string;
}

const projectFiles: readonly FileResponsibility[] = [
  {
    filename: "main.py",
    role: "Application Entry & Orchestrator",
    responsibility:
      "Initializes Pygame, opens the OpenCV camera stream, constructs the game objects, and runs the 60 FPS master game loop.",
    keyFunctions: ["main()", "run_game_loop()", "cleanup()"],
    imports: ["pygame", "cv2", "camera", "tracker", "player", "enemy", "combat", "renderer"],
    codeSkeleton: `import pygame
import cv2
from camera import CameraStream
from tracker import VisionTracker
from player import PlayerState
from enemy import EnemyBoss
from renderer import GameRenderer

def main():
    pygame.init()
    clock = pygame.time.Clock()
    cam = CameraStream(device_id=0)
    tracker = VisionTracker()
    player = PlayerState()
    enemy = EnemyBoss()
    renderer = GameRenderer(width=1280, height=720)

    running = True
    while running:
        dt = clock.tick(60) / 1000.0
        frame = cam.read_frame()
        landmarks = tracker.process(frame)
        
        player.update(landmarks, dt)
        enemy.update(dt)
        combat_events = combat_check(player, enemy)
        
        renderer.render(frame, player, enemy, combat_events)

    cam.release()
    pygame.quit()

if __name__ == "__main__":
    main()`,
  },
  {
    filename: "camera.py",
    role: "Hardware Abstraction Layer",
    responsibility:
      "Manages the physical webcam device using OpenCV (`cv2.VideoCapture`), handles horizontal mirroring, and provides clean RGB frames.",
    keyFunctions: ["__init__()", "read_frame()", "release()"],
    imports: ["cv2"],
    codeSkeleton: `import cv2

class CameraStream:
    def __init__(self, device_id=0, width=1280, height=720):
        self.cap = cv2.VideoCapture(device_id)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

    def read_frame(self):
        ok, frame = self.cap.read()
        if not ok:
            return None
        return cv2.flip(frame, 1)  # Mirror horizontally

    def release(self):
        self.cap.release()`,
  },
  {
    filename: "tracker.py",
    role: "Computer Vision & Feature Engine",
    responsibility:
      "Wraps MediaPipe Hands & Holistic to extract 3D joint landmarks, calculate exponential moving averages (`alpha`), and run the 7-feature ML punch classifier.",
    keyFunctions: ["process()", "extract_features()", "classify_strike()"],
    imports: ["cv2", "mediapipe", "numpy", "velocity"],
    codeSkeleton: `import mediapipe as mp
import numpy as np

class VisionTracker:
    def __init__(self):
        self.mp_hands = mp.solutions.hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.6,
        )

    def process(self, bgr_frame):
        if bgr_frame is None:
            return None
        rgb = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)
        results = self.mp_hands.process(rgb)
        return results.multi_hand_landmarks`,
  },
  {
    filename: "player.py",
    role: "Player FSM & Kinematic State",
    responsibility:
      "Tracks the player's health, stamina, punch cooldowns, and maintains the punch state machine (`IDLE` -> `LAUNCH` -> `EXTEND` -> `COOLDOWN`).",
    keyFunctions: ["update()", "trigger_punch()", "take_damage()"],
    imports: ["time"],
    codeSkeleton: `class PlayerState:
    def __init__(self):
        self.health = 100
        self.state = "IDLE"
        self.last_punch_t = 0
        self.cooldown_sec = 0.35

    def update(self, landmarks, dt):
        # State transitions and cooldown checks
        pass`,
  },
  {
    filename: "enemy.py",
    role: "Opponent FSM & AI Behaviors",
    responsibility:
      "Controls the opponent's animations and decision logic using an arcade state machine (`IDLE` -> `WINDUP` -> `ATTACK` -> `RECOVER`).",
    keyFunctions: ["update()", "start_windup()", "take_damage()"],
    imports: ["random", "time"],
    codeSkeleton: `class EnemyBoss:
    def __init__(self):
        self.health = 100
        self.state = "IDLE"
        self.hitbox_rect = (540, 150, 200, 260) # x, y, w, h

    def update(self, dt):
        # AI decision tree and telegraph timing
        pass`,
  },
  {
    filename: "combat.py",
    role: "Collision & Rules Engine",
    responsibility:
      "Performs exact circle-circle and circle-rectangle intersection tests between player fist coordinates and enemy hitboxes.",
    keyFunctions: ["check_collisions()", "apply_damage()"],
    imports: ["math"],
    codeSkeleton: `def check_collisions(player, enemy):
    # Circle intersection math: (dx*dx + dy*dy) <= (r1 + r2)**2
    events = []
    if player.state == "LAUNCH" and circles_hit(player.wrist_pos, 40, enemy.center, 100):
        enemy.health -= 15
        events.append("ENEMY_HIT")
    return events`,
  },
  {
    filename: "renderer.py",
    role: "Pygame Graphics & HUD Renderer",
    responsibility:
      "Draws the camera stream background, opponent health bar, player gloves, screen shake juice (`add_shake`), and menus.",
    keyFunctions: ["render()", "draw_hud()", "apply_shake()"],
    imports: ["pygame", "cv2"],
    codeSkeleton: `import pygame

class GameRenderer:
    def __init__(self, width, height):
        self.screen = pygame.display.set_mode((width, height))
        self.font = pygame.font.SysFont("Inter", 24)

    def render(self, frame, player, enemy, events):
        # Convert OpenCV BGR surface to Pygame RGB surface and draw HUD
        pygame.display.flip()`,
  },
  {
    filename: "settings.py",
    role: "Centralized Configuration",
    responsibility:
      "Stores all game tuning constants, calibration thresholds (`PUNCH_SPEED_MIN`), frame resolutions, and UI color tokens in 1 clean place.",
    keyFunctions: [],
    imports: [],
    codeSkeleton: `# settings.py | Single source of truth for game constants
WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 720
TARGET_FPS = 60

# Computer Vision Tuning
ALPHA_SMOOTHING = 0.35
PUNCH_VELOCITY_THRESHOLD = 950.0
BLOCK_SYMMETRY_THRESHOLD = 0.75
COOLDOWN_SECONDS = 0.35`,
  },
];

export function ProjectArchitectureViewer() {
  const [selectedFile, setSelectedFile] = useState<FileResponsibility>(projectFiles[0]);

  return (
    <div className="glass-panel rounded-2xl p-7 shadow-xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Layers className="h-6 w-6 text-primary" /> Project Architecture & File Directory
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            See why games split camera, tracking, game state, and drawing into separate files.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
          <FileCode className="h-3.5 w-3.5 text-primary" /> 8 Core Modules
        </span>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-1 rounded-xl border border-border/80 bg-background/50 backdrop-blur p-3.5">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Folder className="h-3.5 w-3.5 text-amber-500" /> project/
          </div>
          <div className="space-y-1 pl-4 border-l border-border/60 ml-2">
            {projectFiles.map((f) => {
              const active = selectedFile.filename === f.filename;
              return (
                <button
                  key={f.filename}
                  onClick={() => setSelectedFile(f)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    active
                      ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileCode className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono">{f.filename}</span>
                  </span>
                  <ChevronRight className={`h-3 w-3 ${active ? "opacity-100" : "opacity-0"}`} />
                </button>
              );
            })}
            <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono text-muted-foreground/60">
              <Folder className="h-3.5 w-3.5 shrink-0" /> assets/ (images/, sounds/)
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-5 rounded-xl border border-border/80 bg-background/60 backdrop-blur p-6">
          <div className="border-b border-border/60 pb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {selectedFile.role}
            </span>
            <h3 className="mt-1 font-display text-2xl font-bold font-mono text-foreground">
              {selectedFile.filename}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {selectedFile.responsibility}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-md border border-border bg-card p-3">
              <strong className="block text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">
                Key Functions / Classes
              </strong>
              <ul className="space-y-1 font-mono text-foreground">
                {selectedFile.keyFunctions.length > 0 ? (
                  selectedFile.keyFunctions.map((fn) => (
                    <li key={fn} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-primary" /> {fn}
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground italic">Constant tokens only</li>
                )}
              </ul>
            </div>

            <div className="rounded-md border border-border bg-card p-3">
              <strong className="block text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">
                Dependencies / Imports
              </strong>
              <div className="flex flex-wrap gap-1.5">
                {selectedFile.imports.length > 0 ? (
                  selectedFile.imports.map((imp) => (
                    <span
                      key={imp}
                      className="rounded bg-muted px-2 py-0.5 font-mono text-foreground"
                    >
                      {imp}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">Standalone module</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Code Skeleton ({selectedFile.filename})
            </h4>
            <CodeBlock
              code={selectedFile.codeSkeleton}
              lang="python"
              caption={`${selectedFile.filename} starter template`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
