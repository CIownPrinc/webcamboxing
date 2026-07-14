// Course data for "Webcam Boxing: From Zero to Punch-Out!!"
// All lesson content is authored inline here so it can be searched, indexed,
// and rendered from a single source of truth.

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string; level?: 2 | 3 }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; lang: string; code: string; caption?: string }
  | { type: "callout"; kind: "info" | "warn" | "tip" | "why"; title?: string; text: string }
  | { type: "analogy"; text: string }
  | { type: "diagram"; title?: string; svg: string }
  | { type: "hint"; label: string; text: string }
  | { type: "quiz"; question: string; options: string[]; answer: number; explain: string };

export type Resource = { title: string; url: string; kind?: "docs" | "video" | "article" | "repo" };

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objectives: string[];
  prerequisites?: string[];
  blocks: Block[];
  mistakes?: string[];
  debugging?: string[];
  challenge?: {
    prompt: string;
    hint?: string;
    solution: { code: string; lang: string; explain?: string };
  };
  recap: string[];
  resources?: Resource[];
};

export type Module = {
  id: string;
  number: number;
  title: string;
  summary: string;
  lessons: Lesson[];
};

/* -------------------------------------------------------------------------- */
/*  SVG diagram helpers                                                        */
/* -------------------------------------------------------------------------- */

const gameLoopSvg = `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Game loop">
  <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="20" y="80" width="110" height="60" rx="10"/>
    <rect x="170" y="80" width="110" height="60" rx="10"/>
    <rect x="320" y="80" width="110" height="60" rx="10"/>
    <path d="M130 110 H170" marker-end="url(#a)"/>
    <path d="M280 110 H320" marker-end="url(#a)"/>
    <path d="M430 110 Q475 110 475 40 Q475 20 260 20 Q75 20 75 40 Q75 80 75 80" marker-end="url(#a)"/>
  </g>
  <g font-family="Inter" font-size="14" fill="currentColor" text-anchor="middle">
    <text x="75" y="115">Input</text>
    <text x="225" y="115">Update</text>
    <text x="375" y="115">Render</text>
    <text x="260" y="200" font-size="12" opacity="0.7">Repeat ~60 times per second</text>
  </g>
</svg>`;

const punchFsmSvg = `
<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Punch FSM">
  <defs><marker id="p" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    ${[0, 1, 2, 3, 4]
      .map((i) => `<rect x="${20 + i * 120}" y="70" width="100" height="60" rx="10"/>`)
      .join("")}
    ${[0, 1, 2, 3]
      .map((i) => `<path d="M${120 + i * 120} 100 H${140 + i * 120}" marker-end="url(#p)"/>`)
      .join("")}
    <path d="M580 130 Q580 180 320 180 Q60 180 60 130" marker-end="url(#p)" stroke-dasharray="4 3"/>
  </g>
  <g font-family="Inter" font-size="13" fill="currentColor" text-anchor="middle">
    <text x="70" y="105">IDLE</text>
    <text x="190" y="105">CHAMBER</text>
    <text x="310" y="105">LAUNCH</text>
    <text x="430" y="105">EXTEND</text>
    <text x="550" y="105">COOLDOWN</text>
  </g>
</svg>`;

const coordSvg = `
<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Image coordinate system">
  <rect x="20" y="20" width="280" height="180" fill="none" stroke="currentColor"/>
  <g stroke="currentColor" stroke-width="1" fill="none">
    <path d="M20 20 H60" marker-end="url(#c)"/>
    <path d="M20 20 V60" marker-end="url(#c)"/>
  </g>
  <defs><marker id="c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>
  <circle cx="180" cy="120" r="4" fill="currentColor"/>
  <line x1="20" y1="120" x2="180" y2="120" stroke="currentColor" stroke-dasharray="3 3"/>
  <line x1="180" y1="20" x2="180" y2="120" stroke="currentColor" stroke-dasharray="3 3"/>
  <g font-family="Inter" font-size="12" fill="currentColor">
    <text x="65" y="15">+x</text><text x="8" y="65">+y</text>
    <text x="185" y="115">(x, y)</text>
    <text x="30" y="35">(0,0)</text>
</svg>`;

const handLandmarksSvg = `
<svg viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MediaPipe 21 Hand Landmarks">
  <rect x="10" y="10" width="340" height="240" rx="12" fill="none" stroke="currentColor" opacity="0.2"/>
  <g stroke="currentColor" stroke-width="2" fill="none" opacity="0.6">
    <path d="M180 220 L130 160 L110 120 L100 90 L95 70"/>
    <path d="M180 220 L155 140 L145 95 L140 65 L138 45"/>
    <path d="M180 220 L180 135 L180 85 L180 55 L180 35"/>
    <path d="M180 220 L205 142 L212 95 L215 68 L218 48"/>
    <path d="M180 220 L230 155 L245 115 L252 90 L258 72"/>
  </g>
  <g fill="currentColor" stroke="var(--color-background)" stroke-width="1.5">
    <circle cx="180" cy="220" r="7"/><text x="180" y="242" font-family="Inter" font-size="11" text-anchor="middle" font-weight="bold">0: Wrist (Anchor)</text>
    <circle cx="95" cy="70" r="5"/><text x="75" y="68" font-family="Inter" font-size="10">4: Thumb</text>
    <circle cx="138" cy="45" r="5"/><text x="138" y="35" font-family="Inter" font-size="10" text-anchor="middle">8: Index</text>
    <circle cx="180" cy="35" r="5"/><text x="180" y="25" font-family="Inter" font-size="10" text-anchor="middle">12: Middle</text>
    <circle cx="218" cy="48" r="5"/><text x="228" y="38" font-family="Inter" font-size="10">16: Ring</text>
    <circle cx="258" cy="72" r="5"/><text x="278" y="75" font-family="Inter" font-size="10">20: Pinky</text>
  </g>
</svg>`;

const velocitySmoothingSvg = `
<svg viewBox="0 0 440 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Exponential Moving Average Velocity Smoothing">
  <rect x="20" y="20" width="400" height="180" rx="8" fill="none" stroke="currentColor" opacity="0.2"/>
  <path d="M40 170 Q70 60 90 160 T140 50 T190 170 T240 40 T290 160 T340 70 T390 150" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.7"/>
  <path d="M40 170 Q90 130 140 110 T240 95 T340 100 T390 110" fill="none" stroke="#22c55e" stroke-width="3"/>
  <g font-family="Inter" font-size="11" fill="currentColor">
    <text x="50" y="45" fill="#ef4444" font-weight="600">-- Raw Noisy Speed (Motion Blur / Jitter)</text>
    <text x="50" y="65" fill="#22c55e" font-weight="600">── Exponential Smoothed Velocity (α = 0.35)</text>
    <text x="220" y="190" text-anchor="middle" opacity="0.8">Time (Frames @ 60 FPS)</text>
  </g>
</svg>`;

const hitboxCollisionSvg = `
<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simple Arcade Hitbox Collision">
  <rect x="150" y="50" width="120" height="130" rx="6" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6 4"/>
  <text x="210" y="42" font-family="Inter" font-size="12" fill="#3b82f6" font-weight="bold" text-anchor="middle">Enemy Rect Hitbox</text>
  <circle cx="165" cy="110" r="38" fill="none" stroke="#22c55e" stroke-width="2.5"/>
  <circle cx="165" cy="110" r="4" fill="#22c55e"/>
  <text x="100" y="114" font-family="Inter" font-size="12" fill="#22c55e" font-weight="bold">Player Fist (Circle)</text>
  <circle cx="165" cy="110" r="8" fill="#ef4444" opacity="0.8"/>
  <text x="210" y="115" font-family="Inter" font-size="13" fill="#ef4444" font-weight="bold" text-anchor="middle">💥 INTERSECTION DETECTED!</text>
</svg>`;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const p = (text: string): Block => ({ type: "p", text });
const h = (text: string, level: 2 | 3 = 2): Block => ({ type: "h", text, level });
const list = (items: string[], ordered = false): Block => ({ type: "list", items, ordered });
const code = (lang: string, code: string, caption?: string): Block => ({
  type: "code",
  lang,
  code,
  caption,
});
const info = (text: string, title?: string): Block => ({
  type: "callout",
  kind: "info",
  title,
  text,
});
const why = (text: string, title = "Why we do this"): Block => ({
  type: "callout",
  kind: "why",
  title,
  text,
});
const warn = (text: string, title = "Watch out"): Block => ({
  type: "callout",
  kind: "warn",
  title,
  text,
});
const tip = (text: string, title = "Tip"): Block => ({ type: "callout", kind: "tip", title, text });
const analogy = (text: string): Block => ({ type: "analogy", text });

/* -------------------------------------------------------------------------- */
/*  Modules                                                                    */
/* -------------------------------------------------------------------------- */

export const modules: Module[] = [
  {
    id: "intro",
    number: 1,
    title: "Introduction",
    summary:
      "What you'll build, why webcam boxing is a great first CV project, and how to use this course.",
    lessons: [
      {
        id: "welcome",
        title: "Welcome to Webcam Boxing",
        minutes: 8,
        difficulty: "Beginner",
        objectives: [
          "Understand what you'll build by the end of the course",
          "Know the shape of every lesson so you can pace yourself",
          "Set realistic expectations for what a webcam can and cannot see",
        ],
        blocks: [
          h("What we're building"),
          p(
            "By the last module you'll have a small arcade boxing game — inspired by Punch-Out!! — that watches you through your webcam. You'll throw left and right punches by moving your fists toward the camera, raise both hands to block, and an animated opponent will attack, recover, and take damage on a health bar.",
          ),
          p(
            "This is a game, not a fitness tracker. We design around what a normal webcam can reliably see, and we lean on classic game design (state machines, cooldowns, hitboxes) to turn noisy sensor data into satisfying gameplay.",
          ),
          h("How each lesson is structured"),
          list([
            "Learning objectives so you know where you're going",
            "A short 'why' section before we write any code",
            "Step-by-step code you can type as you read",
            "A diagram or analogy for anything abstract",
            "Common mistakes and a debugging section",
            "A mini challenge with a hidden solution",
            "A recap and a link to the next lesson",
          ]),
          why(
            "Every lesson ends with something running. Even if you close the tab after ten minutes, you'll leave with a working, small result — that's the freeCodeCamp / Odin Project spirit we're aiming for.",
          ),
          h("Set expectations for the webcam"),
          p(
            "A single webcam sees a flat image. It doesn't measure force, it doesn't know distance in meters, and it blurs when things move fast. Instead of fighting this, we'll build a game that only needs to answer easier questions like 'did the right wrist move forward quickly?'",
          ),
        ],
        recap: [
          "The end goal is a small arcade boxing game driven by your webcam.",
          "Each lesson follows a consistent structure with a working result.",
          "We design around webcam limits, not against them.",
        ],
        resources: [
          {
            title: "MediaPipe — Hand Landmarker",
            url: "https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker",
            kind: "docs",
          },
          {
            title: "OpenCV Python tutorials",
            url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
            kind: "docs",
          },
        ],
      },
      {
        id: "webcam-limits",
        title: "What a webcam actually sees",
        minutes: 10,
        difficulty: "Beginner",
        objectives: [
          "Name the three biggest limits of a consumer webcam for game input",
          "Explain why we don't try to measure real punch force",
          "List the signals we WILL rely on instead",
        ],
        blocks: [
          h("Three things a webcam is bad at"),
          list([
            "Depth. A single lens can't tell how far your fist is; it only sees a 2D projection.",
            "Speed under motion blur. Fast motion smears across a frame, so pixels lie about position.",
            "Absolute scale. If you sit closer, your fist gets bigger — the camera can't distinguish 'closer' from 'moved forward'.",
          ]),
          analogy(
            "Imagine tracing a moving car onto a foggy window with a marker. You can tell it's moving and roughly where, but you can't tell how fast in miles per hour or how far away it is.",
          ),
          why(
            "If we tried to measure real punch force we'd fight physics, math, and the camera at once. Instead, we'll ask easier questions the camera can answer well.",
          ),
          h("Signals we CAN trust"),
          list([
            "Wrist position on screen (from pose or hand landmarks)",
            "Change in wrist position across frames — velocity",
            "Direction of motion (forward vs sideways)",
            "Body pose (are hands up? both up = block)",
            "Time in a state (has the punch cooled down yet?)",
          ]),
          info(
            "You'll see this list appear again in Module 12 when we build the punch detector. Everything the game reads about the player is built from these five signals.",
          ),
          {
            type: "quiz",
            question:
              "You want your game to feel fair. Which of these is the WORST thing to base gameplay on from a single webcam?",
            options: [
              "The 2D position of your wrist on screen",
              "How fast your wrist moved between two frames",
              "The estimated force of your punch in newtons",
              "Whether both hands are near the top of the frame",
            ],
            answer: 2,
            explain:
              "A single lens has no way to recover mass, acceleration, or distance in meters — so 'force in newtons' is a made-up number. The other three are shapes/positions the camera can actually see, which is what we'll build the game around.",
          },
        ],
        recap: [
          "Webcams struggle with depth, motion blur, and absolute scale.",
          "We trade 'measure force' for 'detect a gesture'.",
          "The reliable signals are position, velocity, direction, pose, and time.",
        ],
      },
    ],
  },
  {
    id: "install-python",
    number: 2,
    title: "Installing Python",
    summary:
      "Get a modern Python 3 installed on macOS, Windows, or Linux, and verify it from the terminal.",
    lessons: [
      {
        id: "install",
        title: "Install Python 3 and verify it",
        minutes: 15,
        difficulty: "Beginner",
        objectives: [
          "Install Python 3.11 or newer on your operating system",
          "Open a terminal and confirm `python --version` works",
          "Understand what `pip` is",
        ],
        blocks: [
          h("Why a specific version"),
          p(
            "MediaPipe and OpenCV don't support every Python release equally. Python 3.11 or 3.12 is the sweet spot at the time of writing — new enough to be supported everywhere, old enough that every library has wheels for it.",
          ),
          h("Install"),
          list(
            [
              "Windows: download from python.org and check 'Add Python to PATH' during install",
              "macOS: `brew install python@3.12` (install Homebrew first from brew.sh)",
              "Linux: `sudo apt install python3.12 python3.12-venv` on Debian/Ubuntu",
            ],
            true,
          ),
          h("Verify"),
          code(
            "bash",
            `python --version
# or
python3 --version

pip --version`,
          ),
          p(
            "If you see something like `Python 3.12.3`, you're set. `pip` is the tool that downloads libraries like OpenCV and MediaPipe — we'll use it in Module 4.",
          ),
        ],
        mistakes: [
          "Installing Python from the Microsoft Store on Windows without checking PATH — the terminal then can't find it.",
          "Assuming `python` and `python3` are the same command. On macOS/Linux they often aren't.",
        ],
        recap: [
          "Install Python 3.11 or 3.12.",
          "`python --version` should print your Python version.",
          "`pip` is the package installer, and it comes with Python.",
        ],
        resources: [
          { title: "python.org downloads", url: "https://www.python.org/downloads/", kind: "docs" },
        ],
      },
    ],
  },
  {
    id: "vscode",
    number: 3,
    title: "VS Code",
    summary: "A minimal, distraction-free VS Code setup for Python and this project.",
    lessons: [
      {
        id: "setup-vscode",
        title: "Set up VS Code for Python",
        minutes: 10,
        difficulty: "Beginner",
        objectives: [
          "Install VS Code",
          "Install the Python extension",
          "Know how to open a folder as a project",
        ],
        blocks: [
          h("Install"),
          p(
            "Download VS Code from code.visualstudio.com. When it opens, click the Extensions icon on the left sidebar and install:",
          ),
          list([
            "Python (by Microsoft)",
            "Pylance (comes with Python)",
            "Ruff (linting) — optional but recommended",
          ]),
          h("Open your project folder"),
          p(
            "File → Open Folder → create an empty folder called `webcam-boxing`. Everything you write in this course will live under that folder.",
          ),
          tip(
            "The keyboard shortcut Ctrl+` (backtick) opens VS Code's integrated terminal. Get used to it — you'll live there.",
          ),
        ],
        recap: [
          "VS Code + the Python extension is enough.",
          "Open your project as a folder, not individual files.",
        ],
      },
    ],
  },
  {
    id: "venv",
    number: 4,
    title: "Virtual environments",
    summary:
      "Isolate the libraries this project uses so it doesn't collide with anything else on your machine.",
    lessons: [
      {
        id: "create-venv",
        title: "Create a venv and install the libraries",
        minutes: 12,
        difficulty: "Beginner",
        objectives: [
          "Create a project-local virtual environment",
          "Activate it, install OpenCV, MediaPipe, Pygame and NumPy",
          "Explain why we do this instead of installing globally",
        ],
        blocks: [
          why(
            "A virtual environment is a copy of Python's package folder that belongs only to this project. If two projects need different versions of the same library, they don't have to fight.",
          ),
          analogy(
            "Think of a venv like a lunchbox. Everyone at the picnic brings their own lunchbox instead of sharing one giant plate — nobody ends up eating someone else's sandwich.",
          ),
          h("Create and activate"),
          code(
            "bash",
            `# from inside your project folder
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows (PowerShell)
.venv\\Scripts\\Activate.ps1`,
          ),
          p(
            "Your terminal prompt should now start with `(.venv)`. Every `pip install` you run while active goes into this folder only.",
          ),
          h("Install the stack"),
          code(
            "bash",
            `pip install --upgrade pip
pip install opencv-python mediapipe pygame numpy`,
          ),
          warn(
            "If MediaPipe fails to install, check your Python version. As of 2026 MediaPipe wheels exist for Python 3.10–3.12 on most platforms. If you're on 3.13 you may need to downgrade.",
          ),
        ],
        challenge: {
          prompt:
            "Freeze your installed packages into a requirements.txt file so anyone (including future-you) can recreate the environment.",
          hint: "There is a pip command called `freeze`.",
          solution: {
            lang: "bash",
            code: `pip freeze > requirements.txt
# to recreate later:
# pip install -r requirements.txt`,
            explain:
              "`pip freeze` prints every installed package and its exact version. Redirecting to a file makes a portable recipe.",
          },
        },
        recap: [
          "`python -m venv .venv` creates an isolated Python.",
          "Activate it every time you open the project.",
          "Install libraries with pip, freeze them with `pip freeze`.",
        ],
        resources: [
          {
            title: "Python venv docs",
            url: "https://docs.python.org/3/library/venv.html",
            kind: "docs",
          },
        ],
      },
    ],
  },
  {
    id: "python-basics",
    number: 5,
    title: "Python basics you'll actually use",
    summary: "The subset of Python you need for this project — no fluff.",
    lessons: [
      {
        id: "essentials",
        title: "Variables, functions, loops, classes, tuples",
        minutes: 25,
        difficulty: "Beginner",
        objectives: [
          "Read and write functions with default arguments",
          "Use `for` loops, list comprehensions, and dictionaries",
          "Understand tuples (they'll show up as (x, y) coordinates everywhere)",
          "Write a small class with `__init__`",
        ],
        blocks: [
          h("The 20% you'll use 80% of the time"),
          code(
            "python",
            `# Functions
def clamp(value, low, high):
    """Return value pinned into [low, high]."""
    if value < low:
        return low
    if value > high:
        return high
    return value

# Tuples: coordinates, sizes, colors
position = (320, 240)          # (x, y)
color_red = (0, 0, 255)        # BGR in OpenCV!

# Dictionaries: settings, mappings
settings = {"window_w": 1280, "window_h": 720, "fps": 60}

# Loops
for i in range(3):
    print("round", i)

# Classes — we'll use these for Player, Enemy, etc.
class Player:
    def __init__(self, health=100):
        self.health = health

    def take_damage(self, amount):
        self.health = clamp(self.health - amount, 0, 100)

p = Player()
p.take_damage(20)
print(p.health)  # 80
`,
          ),
          info(
            "BGR vs RGB: OpenCV stores colors as (Blue, Green, Red) — the opposite of what most tools use. This will bite you at least once.",
          ),
          {
            type: "quiz",
            question: "In OpenCV, what does the tuple (0, 0, 255) usually mean?",
            options: ["Pure blue", "Pure green", "Pure red", "Transparent"],
            answer: 2,
            explain:
              "OpenCV stores colors as (Blue, Green, Red). The last channel is red, so (0, 0, 255) is pure red. Every other Python library you meet will use RGB — remember to convert when you leave OpenCV.",
          },
        ],
        mistakes: [
          "Using `=` when you mean `==` in an `if` (Python will refuse to run — good).",
          "Forgetting `self` as the first argument of a method.",
          "Modifying a list while iterating over it.",
        ],
        recap: [
          "Functions, tuples, dicts, and classes are all you need.",
          "Coordinates are almost always tuples of (x, y).",
        ],
      },
    ],
  },
  {
    id: "opencv-intro",
    number: 6,
    title: "Using OpenCV",
    summary: "What OpenCV actually is, and the four functions you'll use constantly.",
    lessons: [
      {
        id: "what-is-opencv",
        title: "What is OpenCV?",
        minutes: 8,
        difficulty: "Beginner",
        objectives: ["Know what OpenCV does", "Know the four functions we'll use constantly"],
        blocks: [
          p(
            "OpenCV is a huge computer-vision library originally written in C++. The `opencv-python` package wraps it so you can call it from Python. For this project we only need four functions.",
          ),
          code(
            "python",
            `import cv2

cv2.VideoCapture(0)   # open a camera
cv2.imshow("Preview", frame)   # show an image in a window
cv2.waitKey(1)        # give the OS 1 ms to update the window
cv2.destroyAllWindows()  # close windows when done`,
          ),
          why(
            "We're not building an image processing pipeline — we're using OpenCV as a camera driver and a debug window. That's it. MediaPipe does the heavy vision work.",
          ),
        ],
        recap: [
          "OpenCV = camera + window + a tiny bit of drawing.",
          "MediaPipe does the tracking, OpenCV just shows the pixels.",
        ],
      },
    ],
  },
  {
    id: "display-webcam",
    number: 7,
    title: "Displaying the webcam",
    summary:
      "Open the camera, show its frames in a window, and quit cleanly. This is your first working result.",
    lessons: [
      {
        id: "first-window",
        title: "Your first webcam window",
        minutes: 15,
        difficulty: "Beginner",
        prerequisites: ["Modules 2–6"],
        objectives: [
          "Open the default webcam with cv2.VideoCapture",
          "Read frames in a loop and display them",
          "Exit cleanly when the user presses q",
        ],
        blocks: [
          h("The plan"),
          list(
            [
              "Ask OpenCV for the default camera",
              "In a loop: read a frame, mirror it, show it, wait 1 ms for a key",
              "If the key is 'q', break out and release everything",
            ],
            true,
          ),
          h("The code"),
          code(
            "python",
            `# camera.py — first working webcam window
import cv2

def main():
    # 0 is the default camera. If you have multiple, try 1, 2, ...
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        raise RuntimeError("Could not open webcam")

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                # Some cameras occasionally miss a frame; just try again.
                continue

            # Mirror horizontally so it feels like a mirror, not a video call.
            frame = cv2.flip(frame, 1)

            cv2.imshow("Webcam", frame)

            # waitKey(1) does two jobs:
            #  1. lets the OS actually paint the window
            #  2. reads a keypress (returns -1 if nothing)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
`,
            "camera.py",
          ),
          info(
            "Run it: `python camera.py`. A window with your face should appear, mirrored. Press `q` to quit.",
          ),
          h("Line-by-line"),
          list([
            "`cv2.VideoCapture(0)` grabs the first camera the OS reports.",
            "`cap.read()` returns `(ok, frame)`. `ok` is False when the camera is disconnected.",
            "`cv2.flip(frame, 1)` mirrors the image left-to-right — matches how you expect a mirror to behave.",
            "`cv2.waitKey(1) & 0xFF` is a portable trick for reading a single key across OSes.",
            "The `finally:` block guarantees we release the camera even if we crash.",
          ]),
        ],
        mistakes: [
          "Forgetting `cap.release()` — the camera stays 'busy' until you close your terminal.",
          "Using `waitKey(0)` — that waits forever, so the window looks frozen.",
          "Skipping `cv2.flip` — you throw a punch and the enemy hits the wrong glove.",
        ],
        debugging: [
          "Black window? Some laptops need permission — check camera privacy settings.",
          "'Could not open webcam' — another app (Zoom, browser) might be holding it. Close it.",
          "Very low FPS? We fix that in Module 11 with a proper FPS counter.",
        ],
        challenge: {
          prompt: "Draw a red circle in the middle of every frame before you show it.",
          hint: "`cv2.circle(frame, center, radius, color, thickness)`. Remember OpenCV uses BGR!",
          solution: {
            lang: "python",
            code: `h, w = frame.shape[:2]
cv2.circle(frame, (w // 2, h // 2), 40, (0, 0, 255), 3)`,
            explain:
              "`frame.shape` is `(height, width, channels)`. We center on `(w/2, h/2)`. `(0, 0, 255)` is red in BGR, and `3` is the outline thickness in pixels.",
          },
        },
        recap: [
          "A webcam is a loop: read a frame → do something → show it → repeat.",
          "`waitKey(1)` is required for the window to update at all.",
          "Always release the camera in a `finally` block.",
        ],
        resources: [
          {
            title: "OpenCV: Getting Started with Videos",
            url: "https://docs.opencv.org/4.x/dd/d43/tutorial_py_video_display.html",
            kind: "docs",
          },
        ],
      },
    ],
  },
  {
    id: "mediapipe-hands",
    number: 8,
    title: "MediaPipe hand tracking",
    summary:
      "Add MediaPipe on top of your webcam feed and draw the 21 landmarks each hand exposes.",
    lessons: [
      {
        id: "hands-first-run",
        title: "Detect hands and draw landmarks",
        minutes: 20,
        difficulty: "Beginner",
        objectives: [
          "Load MediaPipe's hand tracker",
          "Feed it every frame",
          "Draw the returned landmarks on top of the video",
        ],
        blocks: [
          why(
            "MediaPipe gives us 21 named points per hand for free. Doing this ourselves would be a whole graduate degree — instead we call `hands.process(frame)` and read the answer.",
          ),
          code(
            "python",
            `# tracker.py — first hand-tracking demo
import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

def main():
    cap = cv2.VideoCapture(0)

    # max_num_hands=2 → track both hands
    # min_detection_confidence — throw out weak guesses
    with mp_hands.Hands(
        max_num_hands=2,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.5,
    ) as hands:
        while True:
            ok, frame = cap.read()
            if not ok:
                continue
            frame = cv2.flip(frame, 1)

            # MediaPipe wants RGB, OpenCV gives us BGR
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    mp_draw.draw_landmarks(
                        frame,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS,
                    )

            cv2.imshow("Hands", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
`,
          ),
          info(
            "Wave your hands. You should see a green skeleton with 21 dots per hand overlaid on top.",
          ),
          {
            type: "diagram",
            title: "MediaPipe's 21 Hand Landmarks — 0 is the Wrist Anchor",
            svg: handLandmarksSvg,
          },
          h("What MediaPipe returned"),
          list([
            "`results.multi_hand_landmarks` — a list of hands (0, 1, or 2 items)",
            "Each hand has 21 landmarks with `.x`, `.y`, `.z` in [0, 1] normalized coordinates",
            "`results.multi_handedness` — is this the Left or Right hand?",
          ]),
          {
            type: "quiz",
            question:
              "Why do we call cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) before hands.process(rgb)?",
            options: [
              "It makes the picture look prettier on screen.",
              "MediaPipe expects RGB input; OpenCV gives us BGR.",
              "It's required for cv2.imshow to display the frame.",
              "It's just faster than passing BGR.",
            ],
            answer: 1,
            explain:
              "MediaPipe was trained on RGB images. Passing BGR still 'works' but the tracker sees swapped channels — detection quality drops silently. Always convert before .process().",
          },
        ],
        mistakes: [
          "Passing BGR frames to MediaPipe — the tracker will still 'work' but get worse over time.",
          "Creating a fresh `Hands()` inside the loop — extremely slow, and unnecessary.",
        ],
        recap: [
          "MediaPipe consumes RGB frames and returns landmark lists.",
          "21 landmarks per hand, x/y/z normalized to [0, 1].",
          "Draw them with `mp.solutions.drawing_utils`.",
        ],
        resources: [
          {
            title: "MediaPipe Hands",
            url: "https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker",
            kind: "docs",
          },
        ],
      },
    ],
  },
  {
    id: "landmarks",
    number: 9,
    title: "Understanding landmarks",
    summary:
      "What each of the 21 hand landmarks means, and why we'll only care about a few of them.",
    lessons: [
      {
        id: "landmark-map",
        title: "The 21-point hand map",
        minutes: 12,
        difficulty: "Beginner",
        objectives: [
          "Name landmarks 0, 4, 8, 12, 16, 20",
          "Explain why we'll use landmark 0 (wrist) as the punch anchor",
        ],
        blocks: [
          p(
            "MediaPipe numbers each hand landmark from 0 (wrist) to 20 (pinky tip). Fingertips are 4, 8, 12, 16, 20. Knuckles at the base of each finger are 5, 9, 13, 17.",
          ),
          why(
            "For punch detection we anchor on landmark 0, the wrist. Fingertips jitter, curl, and get occluded during a punch. The wrist moves smoothly with the fist and stays visible.",
          ),
          {
            type: "diagram",
            title: "The wrist is the calmest point on the hand",
            svg: `<svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" font-family="Inter" font-size="12">
              <circle cx="170" cy="180" r="8"/><text x="185" y="185">0 wrist</text>
              <circle cx="120" cy="60" r="5"/><text x="90" y="55">4 thumb tip</text>
              <circle cx="150" cy="40" r="5"/><text x="120" y="30">8 index tip</text>
              <circle cx="180" cy="35" r="5"/><text x="190" y="30">12 middle</text>
              <circle cx="210" cy="45" r="5"/><text x="220" y="40">16 ring</text>
              <circle cx="235" cy="60" r="5"/><text x="245" y="60">20 pinky</text>
              <g stroke="currentColor" fill="none" stroke-width="1.5">
                <line x1="170" y1="180" x2="120" y2="60"/>
                <line x1="170" y1="180" x2="150" y2="40"/>
                <line x1="170" y1="180" x2="180" y2="35"/>
                <line x1="170" y1="180" x2="210" y2="45"/>
                <line x1="170" y1="180" x2="235" y2="60"/>
              </g></g></svg>`,
          },
        ],
        recap: [
          "21 landmarks per hand, wrist = 0.",
          "We track the wrist because it's the most stable point during a punch.",
        ],
      },
    ],
  },
  {
    id: "wrist-tracking",
    number: 10,
    title: "Tracking wrist positions",
    summary: "Extract only the two wrists per frame, in pixel coordinates, and remember them.",
    lessons: [
      {
        id: "extract-wrists",
        title: "Extract left and right wrist coordinates",
        minutes: 18,
        difficulty: "Intermediate",
        objectives: [
          "Convert MediaPipe's normalized coordinates to pixel coordinates",
          "Separate the left wrist from the right wrist using handedness",
          "Store the last N wrist positions for use in the next module",
        ],
        blocks: [
          why(
            "Normalized coordinates are portable but useless for drawing. Pixel coordinates draw correctly and make velocity math intuitive.",
          ),
          {
            type: "diagram",
            title: "Image coordinates: origin top-left, y grows downward",
            svg: coordSvg,
          },
          code(
            "python",
            `from collections import deque

HISTORY = 15   # keep the last ~0.25 seconds at 60 fps

left_history = deque(maxlen=HISTORY)
right_history = deque(maxlen=HISTORY)

def process(frame, results):
    h, w = frame.shape[:2]
    if not results.multi_hand_landmarks:
        return
    for lm_list, handed in zip(results.multi_hand_landmarks, results.multi_handedness):
        label = handed.classification[0].label  # "Left" or "Right"
        wrist = lm_list.landmark[0]             # landmark 0 = wrist
        px = int(wrist.x * w)
        py = int(wrist.y * h)
        if label == "Left":
            left_history.append((px, py))
        else:
            right_history.append((px, py))
`,
          ),
          info(
            "Because we mirrored the frame, MediaPipe's 'Left' is your on-screen left — your right hand. If that's confusing, we'll swap labels in the game code.",
          ),
        ],
        recap: [
          "Multiply normalized x, y by width, height to get pixels.",
          "Use `multi_handedness` to tell left from right.",
          "Keep a small history — `collections.deque(maxlen=N)` is perfect.",
        ],
      },
    ],
  },
  {
    id: "velocity",
    number: 11,
    title: "Calculating movement speed",
    summary:
      "Turn a history of wrist positions into a velocity in pixels per second. This becomes 'how hard is that punch?'",
    lessons: [
      {
        id: "velocity-math",
        title: "From positions to velocity",
        minutes: 20,
        difficulty: "Intermediate",
        objectives: [
          "Compute per-frame delta with NumPy",
          "Convert delta to pixels per second using delta time",
          "Smooth the value with an exponential moving average",
        ],
        blocks: [
          h("The math"),
          p(
            "Velocity is (current position − previous position) divided by the time between them. For a 2D point we get a vector; its length is the speed.",
          ),
          code(
            "python",
            `# velocity.py
import time
import numpy as np

class WristVelocity:
    """Turn a stream of (x, y) wrist positions into a smoothed speed in px/s.

    Each wrist (left, right) gets its own instance so their state can't collide.
    """

    def __init__(self, alpha: float = 0.4):
        # alpha = 0 → no smoothing.  alpha = 1 → ignore new data entirely.
        self.alpha = alpha
        self._prev_pos = None
        self._prev_t = None
        self._smoothed = 0.0

    def update(self, pos):
        """Feed one new wrist position, return the smoothed speed."""
        if pos is None:
            # Hand not detected this frame — decay toward zero.
            self._smoothed *= (1 - self.alpha)
            return self._smoothed

        now = time.perf_counter()
        if self._prev_pos is None:
            self._prev_pos, self._prev_t = pos, now
            return 0.0

        dt = max(now - self._prev_t, 1e-3)  # avoid divide-by-zero on fast frames
        delta = np.array(pos) - np.array(self._prev_pos)
        raw = float(np.linalg.norm(delta) / dt)

        # Exponential moving average — the speedometer-needle trick.
        self._smoothed = self.alpha * raw + (1 - self.alpha) * self._smoothed
        self._prev_pos, self._prev_t = pos, now
        return self._smoothed
`,
            "velocity.py",
          ),
          why(
            "Smoothing matters because MediaPipe wobbles by a few pixels even when your hand is still. Without smoothing, a stationary wrist looks like it's moving 300 px/s and randomly triggers punches.",
          ),
          analogy(
            "Smoothing is like a car's speedometer needle — it lags a fraction of a second so it doesn't twitch on every bump.",
          ),
          {
            type: "diagram",
            title: "Raw Noisy Speed vs Exponential Moving Average (EMA)",
            svg: velocitySmoothingSvg,
          },
          info(
            "Because it's a class, we create TWO of them — one per wrist — so left and right don't share state. Module 12 will import `WristVelocity` and use it exactly like that.",
          ),
          {
            type: "quiz",
            question:
              "Why did we turn the velocity code into a class instead of using module-level globals?",
            options: [
              "Classes always run faster in Python.",
              "So each wrist can keep its own history without them clobbering each other.",
              "Because MediaPipe requires it.",
              "To avoid importing numpy.",
            ],
            answer: 1,
            explain:
              "Two wrists share the module if we use globals — the left wrist's speed would overwrite the right wrist's previous position every frame. One instance per wrist keeps the state isolated.",
          },
        ],
        recap: [
          "Speed = distance / time, done per frame with NumPy.",
          "Use `time.perf_counter()` for high-resolution timing.",
          "Exponential smoothing tames pixel jitter.",
          "One WristVelocity instance per wrist — never share state.",
        ],
      },
    ],
  },
  {
    id: "punch-detector",
    number: 12,
    title: "Building a punch detector",
    summary:
      "The heart of the game: turn wrist velocity into a discrete 'PUNCH!' event with left/right/speed metadata.",
    lessons: [
      {
        id: "punch-gesture",
        title: "Why gestures beat physics",
        minutes: 10,
        difficulty: "Intermediate",
        objectives: ["Explain why we detect gesture shape rather than measure force"],
        blocks: [
          why(
            "Force in newtons requires mass, acceleration, and a reference frame. We have none of those. A gesture — 'wrist moved forward fast' — is a shape we can recognize with cheap math.",
          ),
          list([
            "A punch is a movement, not a measurement.",
            "Games have used gesture recognition since the Wii — it's a well-trodden path.",
            "Gestures fail gracefully: worst case you miss a punch, you don't get a weird '3.7 newton' value.",
          ]),
        ],
        recap: ["Detect the shape of a punch. Do not try to measure its force."],
      },
      {
        id: "punch-thresholds",
        title: "First naive detector: threshold on speed",
        minutes: 15,
        difficulty: "Intermediate",
        objectives: [
          "Fire a punch when smoothed speed crosses a threshold",
          "Feel why a raw threshold isn't enough",
        ],
        blocks: [
          code(
            "python",
            `# punch_naive.py — first attempt, uses WristVelocity from Module 11
from velocity import WristVelocity

PUNCH_THRESHOLD = 1200  # pixels per second — we'll calibrate this in Module 14

left_vel  = WristVelocity()
right_vel = WristVelocity()

def maybe_punch(side: str, wrist_pos):
    """Call once per frame with the current wrist (x, y) or None."""
    vel = left_vel if side == "left" else right_vel
    speed = vel.update(wrist_pos)
    if speed > PUNCH_THRESHOLD:
        print(f"{side} punch! speed={speed:.0f} px/s")
`,
          ),
          warn(
            "Run this and wave your hand around — you'll trigger 10 punches per second. That's the setup for the next lesson.",
          ),
          {
            type: "quiz",
            question:
              "You wave your hand slowly across the frame and the console prints 'punch!' six times in a row. Why?",
            options: [
              "MediaPipe misdetected your finger as a hand.",
              "There's no state — every frame speed > threshold is a fresh 'punch'.",
              "OpenCV is running too fast.",
              "You forgot to install numpy.",
            ],
            answer: 1,
            explain:
              "The check has no memory. As long as speed stays above the threshold, every frame is a new punch. Module 13 fixes this by turning the detector into a state machine so one gesture fires exactly one event.",
          },
        ],
        recap: ["Threshold alone spams events.", "We need a state machine to gate the trigger."],
      },
    ],
  },
  {
    id: "fsm",
    number: 13,
    title: "Using a finite state machine",
    summary: "Wrap the detector in a state machine so a single punch fires exactly one event.",
    lessons: [
      {
        id: "punch-fsm",
        title: "IDLE → CHAMBER → LAUNCH → EXTEND → COOLDOWN",
        minutes: 22,
        difficulty: "Intermediate",
        objectives: [
          "Model a punch as five states",
          "Fire the event exactly once per gesture",
          "Understand why cooldowns exist",
        ],
        blocks: [
          { type: "diagram", title: "Punch state machine", svg: punchFsmSvg },
          p(
            "The diagram above is the full five-state model. In practice we can ship a very solid version with only three of those states — IDLE, LAUNCH, and COOLDOWN — and add CHAMBER and EXTEND as stretch goals. Here's what each of the three does:",
          ),
          list([
            "IDLE — wrist is still or moving slowly; we watch for the threshold.",
            "LAUNCH — speed crossed the threshold; we track the peak speed until the punch slows down.",
            "COOLDOWN — one gesture already fired; ignore new triggers for ~250 ms.",
          ]),
          info(
            "CHAMBER (a 'wind-up' where the wrist first pulls back) and EXTEND (holding the peak reach) are pattern refinements you can add later — the recap links to them under Module 25 extensions.",
          ),
          code(
            "python",
            `from enum import Enum, auto
import time

class Punch(Enum):
    IDLE = auto()
    LAUNCH = auto()
    EXTEND = auto()
    COOLDOWN = auto()

class PunchDetector:
    def __init__(self, threshold=1200, cooldown=0.25):
        self.state = Punch.IDLE
        self.threshold = threshold
        self.cooldown = cooldown
        self._t_cooldown_ends = 0
        self._peak_speed = 0

    def update(self, speed):
        now = time.perf_counter()
        event = None

        if self.state == Punch.IDLE:
            if speed > self.threshold:
                self.state = Punch.LAUNCH
                self._peak_speed = speed
        elif self.state == Punch.LAUNCH:
            self._peak_speed = max(self._peak_speed, speed)
            if speed < self.threshold * 0.6:
                # movement is slowing → punch complete
                event = ("punch", self._peak_speed)
                self.state = Punch.COOLDOWN
                self._t_cooldown_ends = now + self.cooldown
        elif self.state == Punch.COOLDOWN:
            if now >= self._t_cooldown_ends:
                self.state = Punch.IDLE
                self._peak_speed = 0

        return event
`,
          ),
          why(
            "Firing on entry to LAUNCH would fire many times as speed hovers near the threshold. Firing when the wrist slows down (LAUNCH → COOLDOWN) captures 'one punch, one event' cleanly. And the peak speed becomes our damage input.",
          ),
          {
            type: "quiz",
            question:
              "In this state machine, WHEN do we actually emit the ('punch', peak_speed) event?",
            options: [
              "The moment speed first crosses the threshold (IDLE → LAUNCH).",
              "Every frame we're in LAUNCH.",
              "When we leave LAUNCH because the wrist is slowing down.",
              "When the cooldown ends.",
            ],
            answer: 2,
            explain:
              "Emitting on IDLE → LAUNCH would fire multiple times as speed hovers near the threshold. Emitting when speed drops back below 60% of threshold means we've seen a full 'up-and-down' hump — one gesture, one event — and we've captured the peak speed to use as damage.",
          },
        ],
        mistakes: [
          "Firing the event every frame speed > threshold — you get 20 punches per second.",
          "Forgetting the cooldown — one gesture triggers two hits back-to-back.",
          "Using system clock (`time.time()`) instead of `time.perf_counter()` — less precise.",
        ],
        recap: [
          "States give us a clean 'one gesture = one event' contract.",
          "Peak speed inside LAUNCH becomes damage input.",
        ],
      },
    ],
  },
  {
    id: "calibration",
    number: 14,
    title: "Calibration",
    summary:
      "Different bodies, cameras, and rooms give different pixel speeds. Let the player calibrate their own threshold.",
    lessons: [
      {
        id: "calibrate",
        title: "A 5-second calibration routine",
        minutes: 15,
        difficulty: "Intermediate",
        objectives: [
          "Sample the player's own 'fast punch' speed",
          "Pick a threshold from a percentile of that sample",
        ],
        blocks: [
          why(
            "A '1200 px/s' threshold is meaningless. A tall person close to the camera moves 3× more pixels than a short person across the room. Calibrating is the difference between 'works for you' and 'works for one specific developer at their desk'.",
          ),
          code(
            "python",
            `import numpy as np

def calibrate(get_speed, seconds=5, fps=60):
    """Ask the user to throw a few punches, return a threshold."""
    samples = []
    frames = seconds * fps
    for _ in range(frames):
        samples.append(get_speed())
    samples = np.array(samples)
    # Threshold = 60th percentile of observed speeds during calibration.
    return float(np.percentile(samples, 60))
`,
          ),
        ],
        recap: [
          "Threshold is not a constant — it's a per-player, per-setup value.",
          "Sample your own motion, take a percentile.",
        ],
      },
    ],
  },
  {
    id: "pygame-window",
    number: 15,
    title: "Building a Pygame window",
    summary:
      "Open a real game window and start a proper game loop separate from the OpenCV preview.",
    lessons: [
      {
        id: "pygame-first",
        title: "Hello, Pygame",
        minutes: 15,
        difficulty: "Beginner",
        objectives: [
          "Open a Pygame window",
          "Run a 60 fps game loop with delta time",
          "Quit cleanly on window close or ESC",
        ],
        blocks: [
          { type: "diagram", title: "The game loop", svg: gameLoopSvg },
          code(
            "python",
            `import pygame, sys

pygame.init()
screen = pygame.display.set_mode((1280, 720))
pygame.display.set_caption("Webcam Boxing")
clock = pygame.time.Clock()

running = True
while running:
    dt = clock.tick(60) / 1000.0   # seconds since last frame

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False

    # update world here using dt

    screen.fill((15, 15, 20))
    pygame.draw.circle(screen, (220, 60, 60), (640, 360), 80)
    pygame.display.flip()

pygame.quit()
sys.exit()
`,
          ),
          why(
            "Delta time (`dt`) is seconds per frame. Anything that moves multiplies its speed by `dt` so the game runs the same on a slow or fast machine.",
          ),
        ],
        recap: [
          "Pygame is just an input/window/audio layer.",
          "Every game is: handle events → update(dt) → render → flip.",
        ],
      },
    ],
  },
  {
    id: "render",
    number: 16,
    title: "Rendering game objects",
    summary: "Draw the boxer, the enemy, the health bar, and a simple background.",
    lessons: [
      {
        id: "renderer",
        title: "A tiny Renderer module",
        minutes: 20,
        difficulty: "Intermediate",
        objectives: ["Separate drawing from game logic", "Draw a health bar you can reuse"],
        blocks: [
          code(
            "python",
            `# renderer.py
import pygame

PAPER = (245, 240, 230)
INK = (30, 25, 25)
RED = (200, 50, 50)

def draw_health(screen, x, y, w, h, pct, color=RED):
    pct = max(0.0, min(1.0, pct))
    pygame.draw.rect(screen, INK, (x-2, y-2, w+4, h+4), 2)
    pygame.draw.rect(screen, color, (x, y, int(w * pct), h))

def draw_enemy(screen, x, y, size=120, hit=False):
    color = (255, 120, 100) if hit else INK
    pygame.draw.circle(screen, color, (x, y), size)
`,
          ),
          tip(
            "Every drawing function takes the surface first and returns nothing. That makes them dead simple to test and reuse.",
          ),
        ],
        recap: ["Separate `renderer.py` from game logic keeps update code readable."],
      },
    ],
  },
  {
    id: "enemy-fsm",
    number: 17,
    title: "Enemy state machine",
    summary: "A dumb-but-satisfying opponent: idle → telegraph → attack → recover.",
    lessons: [
      {
        id: "enemy",
        title: "Model the enemy as four states",
        minutes: 25,
        difficulty: "Intermediate",
        objectives: [
          "Design a simple enemy FSM",
          "Understand why arcade games use tiny FSMs, not AI",
        ],
        blocks: [
          why(
            "The Punch-Out!! series famously used pattern-based opponents. Players learn the patterns and feel skillful. Complex AI would make the game feel random.",
          ),
          code(
            "python",
            `from enum import Enum, auto
import random, time

class E(Enum):
    IDLE = auto()
    TELEGRAPH = auto()
    ATTACK = auto()
    RECOVER = auto()

class Enemy:
    def __init__(self):
        self.state = E.IDLE
        self.health = 100
        self.t_next = time.perf_counter() + random.uniform(1.0, 2.0)

    def update(self, now, on_hit_player):
        if now < self.t_next:
            return
        if self.state == E.IDLE:
            self.state = E.TELEGRAPH
            self.t_next = now + 0.5      # player has 0.5 s to react
        elif self.state == E.TELEGRAPH:
            self.state = E.ATTACK
            self.t_next = now + 0.15
        elif self.state == E.ATTACK:
            on_hit_player(damage=10)
            self.state = E.RECOVER
            self.t_next = now + 1.2
        elif self.state == E.RECOVER:
            self.state = E.IDLE
            self.t_next = now + random.uniform(0.8, 1.6)
`,
          ),
          info(
            "The TELEGRAPH state is the 'wind-up' animation. It's what gives the player a chance to raise a block.",
          ),
        ],
        recap: [
          "Four states are enough for a fun arcade enemy.",
          "Telegraphs make the game feel fair.",
        ],
      },
    ],
  },
  {
    id: "collision",
    number: 18,
    title: "Collision detection",
    summary: "When does a punch count as a hit? Simple hitboxes and circle-circle tests.",
    lessons: [
      {
        id: "hitboxes",
        title: "Circle vs circle is all we need",
        minutes: 15,
        difficulty: "Intermediate",
        objectives: ["Test whether a wrist hits the enemy using a circle intersection"],
        blocks: [
          code(
            "python",
            `def circles_hit(a, ra, b, rb):
    dx = a[0] - b[0]
    dy = a[1] - b[1]
    return (dx*dx + dy*dy) <= (ra + rb) ** 2
`,
          ),
          why(
            "Circles are direction-independent and cheap: one subtraction per axis, one comparison, no square root. Perfect for 2D arcade fights.",
          ),
          {
            type: "diagram",
            title: "Circle vs Rectangle / Circle Intersection Hitbox",
            svg: hitboxCollisionSvg,
          },
        ],
        recap: ["Squared-distance comparison avoids the expensive sqrt."],
      },
    ],
  },
  {
    id: "health",
    number: 19,
    title: "Health",
    summary: "Wire punches to enemy damage and enemy attacks to player damage.",
    lessons: [
      {
        id: "health-flow",
        title: "Damage flow and speed → damage mapping",
        minutes: 15,
        difficulty: "Intermediate",
        objectives: [
          "Map punch peak speed to Slow/Medium/Fast damage buckets",
          "Route damage into the enemy and player",
        ],
        blocks: [
          code(
            "python",
            `def speed_to_damage(peak, cal):
    """Bucket punch strength based on the calibrated threshold."""
    if peak > cal * 1.6: return 15   # Fast
    if peak > cal * 1.2: return 10   # Medium
    return 6                          # Slow
`,
          ),
          why(
            "Three buckets is enough. Continuous damage feels random; three tiers feel like the game noticed how hard you tried.",
          ),
        ],
        recap: ["Damage is a bucketed function of peak speed, not a linear formula."],
      },
    ],
  },
  {
    id: "blocking",
    number: 20,
    title: "Blocking",
    summary: "Detect the block pose (both hands up near the face) and interrupt incoming damage.",
    lessons: [
      {
        id: "block",
        title: "Both hands up = block",
        minutes: 15,
        difficulty: "Intermediate",
        objectives: [
          "Detect the block pose from wrist heights",
          "Absorb damage during a valid block window",
        ],
        blocks: [
          code(
            "python",
            `def is_blocking(left_wrist, right_wrist, frame_h):
    if left_wrist is None or right_wrist is None:
        return False
    upper = frame_h * 0.4    # top 40% of the frame
    return left_wrist[1] < upper and right_wrist[1] < upper
`,
          ),
          info("Remember: y grows downward. 'Wrist above the upper region' means `y < upper`."),
        ],
        recap: [
          "A block is a pose, not a gesture.",
          "Poses are cheap: compare y-values to a fraction of the frame height.",
        ],
      },
    ],
  },
  {
    id: "gameloop",
    number: 21,
    title: "Full game loop",
    summary:
      "Combine tracker + player + enemy + renderer into one running game with win/lose conditions.",
    lessons: [
      {
        id: "loop",
        title: "Stitch everything together in main.py",
        minutes: 30,
        difficulty: "Intermediate",
        objectives: [
          "Run tracker and game in the same process",
          "Detect win (enemy hp ≤ 0) and lose (player hp ≤ 0)",
        ],
        blocks: [
          info(
            "`Tracker` here is a small facade class you'll assemble from the pieces built earlier: MediaPipe hands (Mod. 8), wrist extraction (Mod. 10), a `WristVelocity` per wrist (Mod. 11), a `PunchDetector` per wrist (Mod. 13), and the `is_blocking` check (Mod. 20). `tracker.step()` reads a frame and updates all of them; `punch_left/right(threshold)` returns a small object with `.pos` and `.speed` when a punch fired this frame, else `None`.",
          ),
          code(
            "python",
            `# main.py — abridged
import pygame, cv2, time
from tracker import Tracker
from player import Player
from enemy import Enemy, E
from combat import speed_to_damage, circles_hit
from renderer import draw_enemy, draw_health, PAPER

pygame.init()
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()

tracker = Tracker(cam_index=0)
player  = Player()
enemy   = Enemy()
cal_threshold = 1200   # replace with Module 14 calibrator

running = True
while running:
    dt  = clock.tick(60) / 1000
    now = time.perf_counter()

    for ev in pygame.event.get():
        if ev.type == pygame.QUIT: running = False

    tracker.step()
    left_hit  = tracker.punch_left(cal_threshold)
    right_hit = tracker.punch_right(cal_threshold)
    blocking  = tracker.is_blocking()

    for hit in (left_hit, right_hit):
        if hit and circles_hit(hit.pos, 40, (640, 360), 120):
            enemy.health -= speed_to_damage(hit.speed, cal_threshold)

    enemy.update(now, on_hit_player=lambda damage:
                 None if blocking else setattr(player, "health", player.health - damage))

    if enemy.health <= 0: print("You win!"); running = False
    if player.health <= 0: print("KO!"); running = False

    screen.fill(PAPER)
    draw_enemy(screen, 640, 360, hit=enemy.state == E.ATTACK)
    draw_health(screen, 40, 40, 400, 20, player.health / 100)
    draw_health(screen, 840, 40, 400, 20, enemy.health / 100)
    pygame.display.flip()

pygame.quit()
`,
          ),
          info(
            "This is the shape of a complete game. The rest of the course polishes what happens inside each line.",
          ),
        ],
        recap: ["main.py orchestrates modules — it should stay small."],
      },
    ],
  },
  {
    id: "menus",
    number: 22,
    title: "Menus",
    summary: "Title screen, calibration screen, and a game-over screen.",
    lessons: [
      {
        id: "menus",
        title: "A tiny scene manager",
        minutes: 20,
        difficulty: "Intermediate",
        objectives: ["Split the app into scenes (Menu, Calibrate, Play, GameOver)"],
        blocks: [
          code(
            "python",
            `class Scene: name = "base"
class MenuScene(Scene): name = "menu"
class PlayScene(Scene): name = "play"
# ...
scenes = {"menu": MenuScene(), "play": PlayScene()}
current = "menu"
`,
          ),
          why(
            "Scenes keep unrelated code apart. Menu code doesn't need to know a thing about MediaPipe.",
          ),
        ],
        recap: ["A scene manager is just a dict + a string."],
      },
    ],
  },
  {
    id: "sound",
    number: 23,
    title: "Sound",
    summary: "Punch thuds, block clunks, and a title-screen loop with `pygame.mixer`.",
    lessons: [
      {
        id: "sfx",
        title: "Load and play sounds",
        minutes: 12,
        difficulty: "Beginner",
        objectives: ["Load .wav/.ogg files", "Trigger a hit sound on damage"],
        blocks: [
          code(
            "python",
            `import pygame
pygame.mixer.init()
hit = pygame.mixer.Sound("assets/sounds/hit.wav")
block = pygame.mixer.Sound("assets/sounds/block.wav")

def on_hit(): hit.play()
`,
          ),
          tip(
            "Free sound sources: freesound.org (CC-licensed), or generate short retro punches with sfxr / jsfxr.",
          ),
        ],
        recap: ["Sounds are objects you `.play()` — no channels required for a small game."],
      },
    ],
  },
  {
    id: "polish",
    number: 24,
    title: "Polish",
    summary: "Screen shake, hit flashes, a punch impact particle, and difficulty tuning.",
    lessons: [
      {
        id: "polish",
        title: "Three tiny effects that make it feel like a game",
        minutes: 25,
        difficulty: "Intermediate",
        objectives: [
          "Add screen shake on player hits",
          "Flash the enemy sprite when hit",
          "Tune enemy timing so it's beatable but tense",
        ],
        blocks: [
          code(
            "python",
            `import random
shake = 0
def add_shake(amount): 
    global shake; shake = max(shake, amount)

def apply_shake(screen_pos):
    global shake
    if shake <= 0: return screen_pos
    dx = random.randint(-shake, shake)
    dy = random.randint(-shake, shake)
    shake = max(0, shake - 1)
    return (screen_pos[0] + dx, screen_pos[1] + dy)
`,
          ),
          why(
            "Screen shake is the single cheapest 'juice' in games. Two lines of code, and hits suddenly feel weighty.",
          ),
        ],
        recap: ["Polish is a handful of small effects, not a mode."],
      },
    ],
  },
  {
    id: "extensions",
    number: 25,
    title: "Where to go next",
    summary: "Ideas for stretching the project once you're comfortable.",
    lessons: [
      {
        id: "next-projects",
        title: "Ten directions from here",
        minutes: 8,
        difficulty: "Beginner",
        objectives: ["Pick a next step that matches your interest"],
        blocks: [
          list(
            [
              "Multiple enemies with different telegraph timings",
              "Boss fights with multi-phase FSMs",
              "Dodge left/right using body pose (MediaPipe Pose)",
              "Combo detection — three fast lefts in a row = a special",
              "On-screen mirrored webcam behind the ring",
              "Sprite animation instead of circles",
              "Save high scores to a JSON file",
              "Add haptics via keyboard rumble on hits (platform-specific)",
              "Package with PyInstaller so friends can play",
              "Port the tracker to a browser with MediaPipe Web + Canvas",
            ],
            true,
          ),
          info(
            "Whichever you pick, the pattern is the same: identify a reliable webcam signal, wrap it in an FSM, gate it with a cooldown, and give it a satisfying render.",
          ),
        ],
        recap: [
          "The core pattern (signal → FSM → cooldown → render) generalizes to almost any webcam game.",
        ],
      },
    ],
  },
];

export const allLessons = modules.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })));

export function findLesson(moduleId: string, lessonId: string) {
  const m = modules.find((x) => x.id === moduleId);
  if (!m) return null;
  const l = m.lessons.find((x) => x.id === lessonId);
  if (!l) return null;
  const flatIdx = allLessons.findIndex((x) => x.module.id === moduleId && x.lesson.id === lessonId);
  return {
    module: m,
    lesson: l,
    prev: flatIdx > 0 ? allLessons[flatIdx - 1] : null,
    next: flatIdx < allLessons.length - 1 ? allLessons[flatIdx + 1] : null,
  };
}

export const glossary: { term: string; def: string }[] = [
  {
    term: "Landmark",
    def: "A named point on a body, hand, or face returned by MediaPipe. Hand landmarks are numbered 0 (wrist) through 20 (pinky tip).",
  },
  {
    term: "Normalized coordinates",
    def: "x and y in the range [0, 1] instead of pixels. Multiply by width/height to get pixel positions.",
  },
  {
    term: "Finite state machine (FSM)",
    def: "A model where the system is in exactly one of a small set of states and transitions between them on events.",
  },
  {
    term: "Cooldown",
    def: "A minimum time between two occurrences of the same event, used to prevent one gesture from firing twice.",
  },
  {
    term: "Delta time",
    def: "Seconds elapsed since the previous frame. Multiplying velocity by delta time keeps motion frame-rate independent.",
  },
  {
    term: "Hitbox",
    def: "A simple geometric shape (usually a circle or rectangle) that stands in for a character's collision volume.",
  },
  {
    term: "Exponential moving average",
    def: "A smoothing formula: smoothed = α × new + (1 − α) × previous. Cheap and effective.",
  },
  {
    term: "Calibration",
    def: "A per-user, per-setup step that measures the player's own range so thresholds aren't hard-coded.",
  },
  {
    term: "Handedness",
    def: "MediaPipe's Left/Right label for a detected hand — helpful, but flipped once you mirror the frame.",
  },
  {
    term: "Game loop",
    def: "The repeating cycle of Input → Update → Render that every real-time game runs at ~60 Hz.",
  },
];

export const globalResources: { section: string; items: Resource[] }[] = [
  {
    section: "Official docs",
    items: [
      { title: "Python 3 docs", url: "https://docs.python.org/3/", kind: "docs" },
      {
        title: "OpenCV Python tutorials",
        url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
        kind: "docs",
      },
      {
        title: "MediaPipe Solutions",
        url: "https://ai.google.dev/edge/mediapipe/solutions/guide",
        kind: "docs",
      },
      { title: "Pygame docs", url: "https://www.pygame.org/docs/", kind: "docs" },
      { title: "NumPy docs", url: "https://numpy.org/doc/stable/", kind: "docs" },
    ],
  },
  {
    section: "Deeper reading",
    items: [
      {
        title: "Game Programming Patterns — State",
        url: "https://gameprogrammingpatterns.com/state.html",
        kind: "article",
      },
      {
        title: "Game Programming Patterns — Game Loop",
        url: "https://gameprogrammingpatterns.com/game-loop.html",
        kind: "article",
      },
      {
        title: "MDN — Coordinate systems",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems",
        kind: "article",
      },
    ],
  },
  {
    section: "Reference repos",
    items: [
      {
        title: "MediaPipe examples (Python)",
        url: "https://github.com/google-ai-edge/mediapipe-samples",
        kind: "repo",
      },
      {
        title: "OpenCV samples",
        url: "https://github.com/opencv/opencv/tree/4.x/samples/python",
        kind: "repo",
      },
    ],
  },
];

export const totalLessons = allLessons.length;
export const totalMinutes = allLessons.reduce((s, x) => s + x.lesson.minutes, 0);
