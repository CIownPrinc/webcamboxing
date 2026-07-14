import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, PlayCircle, Sparkles, Target } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { findLesson, modules, totalLessons, totalMinutes } from "@/data/course";
import { useHydrated, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Webcam Boxing — Free Python Game Development & Computer Vision Course",
      },
      {
        name: "description",
        content:
          "Learn Python, OpenCV, MediaPipe, and Pygame from scratch by building a webcam-controlled arcade boxing game. 25 step-by-step interactive modules, 100% free.",
      },
      {
        property: "og:title",
        content: "Webcam Boxing — Free Python Game Development & Computer Vision Course",
      },
      {
        property: "og:description",
        content:
          "Learn Python, OpenCV, MediaPipe, and Pygame from scratch by building a webcam-controlled arcade boxing game. 25 step-by-step interactive modules, 100% free.",
      },
      { property: "og:url", content: "https://webcamboxing.com/" },
    ],
    links: [{ rel: "canonical", href: "https://webcamboxing.com/" }],
  }),
  component: Index,
});

function Index() {
  const first = modules[0].lessons[0];
  const totalHours = Math.round(totalMinutes / 60);
  const hydrated = useHydrated();
  const { lastVisited } = useProgress();
  const resume =
    hydrated && lastVisited ? findLesson(lastVisited.moduleId, lastVisited.lessonId) : null;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Webcam Boxing: Learn Python Game Development & Computer Vision",
    description:
      "A free, beginner-friendly 25-module interactive course teaching Python programming, OpenCV computer vision, MediaPipe hand tracking, and Pygame arcade game architecture by building a webcam-controlled boxing game.",
    provider: {
      "@type": "Organization",
      name: "Webcam Boxing",
      sameAs: "https://webcamboxing.com/",
    },
    isAccessibleForFree: true,
    inLanguage: "en",
    timeRequired: `PT${totalHours}H`,
    educationalLevel: "Beginner",
    about: [
      "Python programming",
      "Computer Vision",
      "OpenCV",
      "MediaPipe",
      "Game Development",
      "Pygame",
      "Finite State Machines",
    ],
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `${totalHours} hours`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need any Python or computer vision experience before starting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "None at all. We start from zero by installing Python together and writing your first lines of code. Every concept is explained step by step before we build it.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a fancy graphics card or expensive webcam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nope. Any built-in laptop webcam or standard USB camera works fine. MediaPipe is designed to run smoothly on normal CPU hardware without needing an expensive GPU.",
        },
      },
      {
        "@type": "Question",
        name: "Is this course really 100% free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, completely free and open. No signups, no paywalls, and no hidden subscriptions. You can build the entire game from start to finish right now in your browser and terminal.",
        },
      },
      {
        "@type": "Question",
        name: "What will I actually have built by the end of Module 25?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You will build a complete arcade boxing game inspired by classics like Punch-Out!!. It tracks your real left and right jabs through your webcam using computer vision, features smooth hitboxes and sound effects, and includes an intelligent AI opponent controlled by a finite state machine.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> A hands-on programming course
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              Learn Python game development and <span className="marker-red">computer vision</span>{" "}
              from scratch.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Write clean code that tracks your hands with your webcam and powers a live arcade
              boxing game using Python, OpenCV, and MediaPipe. 25 interactive modules, zero
              prerequisites.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {resume ? (
                <Link
                  to="/lessons/$moduleId/$lessonId"
                  params={{ moduleId: resume.module.id, lessonId: resume.lesson.id }}
                  className="neo-btn inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground"
                >
                  <PlayCircle className="h-4 w-4" /> Resume: {resume.lesson.title}
                </Link>
              ) : (
                <Link
                  to="/lessons/$moduleId/$lessonId"
                  params={{ moduleId: modules[0].id, lessonId: first.id }}
                  className="neo-btn inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground"
                >
                  Start Module 1 <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {resume && (
                <Link
                  to="/lessons/$moduleId/$lessonId"
                  params={{ moduleId: modules[0].id, lessonId: first.id }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-5 py-3.5 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-card hover:border-border"
                >
                  Start from Module 1 <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                to="/curriculum"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-5 py-3.5 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-card hover:border-border"
              >
                <BookOpen className="h-4 w-4 text-muted-foreground" /> See the curriculum
              </Link>
            </div>
          </div>

          <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-8 text-sm">
            <Stat label="Modules" value={String(modules.length)} />
            <Stat label="Lessons" value={String(totalLessons)} />
            <Stat label="Approx. time" value={`${totalHours}h`} />
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 grid gap-5 md:grid-cols-3">
          <FeatureLead
            icon={<Target className="h-5 w-5" />}
            title="Designed for total beginners"
            body="Every lesson explains WHY before HOW. No hand-waving, no skipping steps, and every line of Python is clearly explained."
          />
          <div className="flex flex-col gap-5">
            <FeatureSecondary
              icon={<Sparkles className="h-4 w-4" />}
              title="Built around real webcam tracking"
              body="You will learn what a webcam can and cannot see, and how to design responsive gameplay that turns normal webcam tracking into fun, fair input."
            />
            <FeatureSecondary
              icon={<BookOpen className="h-4 w-4" />}
              title="Real, working results"
              body="Every lesson ends with working code running on your screen. Game architecture, calibration, and finite state machines come along naturally as you build."
            />
          </div>
        </div>

        <h2 className="mt-16 font-display text-3xl font-bold tracking-tight">The roadmap</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          25 beginner modules take you from installing Python and OpenCV to a polished arcade boxing
          game with menus, sound effects, and an intelligent opponent.
        </p>
        <ol className="mt-8 grid gap-3.5 md:grid-cols-2">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: m.id, lessonId: m.lessons[0].id }}
                className="glass-panel group flex items-start gap-4 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 font-mono text-xs font-semibold tabular-nums text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  {String(m.number).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold leading-tight">{m.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {m.summary}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <h2 className="mt-20 font-display text-3xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Common questions about hardware, Python, and how the course works.
        </p>
        <div className="mt-6 grid gap-3.5 max-w-3xl">
          <FaqItem
            question="Do I need any Python or computer vision experience before starting?"
            answer="None at all. We start from zero by installing Python together and writing your first lines of code. Every concept is explained step by step before we build it."
          />
          <FaqItem
            question="Do I need a fancy graphics card or expensive webcam?"
            answer="Nope. Any built-in laptop webcam or standard USB camera works fine. MediaPipe is designed to run smoothly on normal CPU hardware without needing an expensive GPU."
          />
          <FaqItem
            question="Is this course really 100% free?"
            answer="Yes, completely free and open. No signups, no paywalls, and no hidden subscriptions. You can build the entire game from start to finish right now in your browser and terminal."
          />
          <FaqItem
            question="What will I actually have built by the end of Module 25?"
            answer="You will build a complete arcade boxing game inspired by classics like Punch-Out!!. It tracks your real left and right jabs through your webcam using computer vision, features smooth hitboxes and sound effects, and includes an intelligent AI opponent controlled by a finite state machine."
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="glass-panel rounded-2xl p-8 shadow-xl md:p-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Ready to step into the ring?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground leading-relaxed">
            No gloves required. Grab your webcam, fire up Python, and let&apos;s build something you
            can actually play.
          </p>
          <div className="mt-7 flex justify-center">
            {resume ? (
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: resume.module.id, lessonId: resume.lesson.id }}
                className="neo-btn inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
              >
                <PlayCircle className="h-4 w-4" /> Resume: {resume.lesson.title}
              </Link>
            ) : (
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: modules[0].id, lessonId: first.id }}
                className="neo-btn inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
              >
                Start Module 1 <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        Why debug with print statements when you can debug with a left hook?
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-display text-3xl font-bold">{value}</dd>
    </div>
  );
}

function FeatureLead({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-panel flex flex-col justify-between rounded-2xl p-7 shadow-lg md:col-span-2">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">{body}</p>
      </div>
      <div className="mt-6 border-t border-border/60 pt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Core Learning Method
      </div>
    </div>
  );
}

function FeatureSecondary({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-md transition-all duration-200 hover:border-border">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-muted/30 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="glass-panel group rounded-xl p-4 transition-colors hover:border-primary/40">
      <summary className="cursor-pointer font-display text-base font-semibold list-none flex items-center justify-between select-none">
        <span>{question}</span>
        <span className="ml-4 text-xs text-muted-foreground group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
        {answer}
      </p>
    </details>
  );
}
