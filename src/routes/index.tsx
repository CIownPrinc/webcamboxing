import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Target } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { modules, totalLessons, totalMinutes } from "@/data/course";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const first = modules[0].lessons[0];
  const totalHours = Math.round(totalMinutes / 60);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--color-primary) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-primary) 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> A hands-on course
          </p>
          <h1 className="font-display text-5xl leading-[0.98] tracking-tight md:text-7xl">
            Build a webcam
            <br />
            <span className="marker-red">boxing game</span> from zero.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A step-by-step course that teaches Python, computer vision, and game design by
            building an arcade boxing game — inspired by Punch-Out!! — that watches you
            through your own webcam.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/lessons/$moduleId/$lessonId"
              params={{ moduleId: modules[0].id, lessonId: first.id }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow transition-transform hover:-translate-y-0.5"
            >
              Start Module 1 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <BookOpen className="h-4 w-4" /> See the curriculum
            </Link>
          </div>

          <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8 text-sm">
            <Stat label="Modules" value={String(modules.length)} />
            <Stat label="Lessons" value={String(totalLessons)} />
            <Stat label="Approx. time" value={`${totalHours}h`} />
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <Feature
            icon={<Target className="h-4 w-4" />}
            title="Designed for beginners"
            body="Every lesson explains WHY before HOW. No hand-waving, no 'just use this' — every important line is annotated."
          />
          <Feature
            icon={<Sparkles className="h-4 w-4" />}
            title="Built around webcam limits"
            body="You'll learn what a webcam can and can't measure — and how to design gameplay that turns those limits into fair, fun input."
          />
          <Feature
            icon={<BookOpen className="h-4 w-4" />}
            title="Real, working results"
            body="Every lesson ends with something running. State machines, calibration, and modular architecture come along for the ride."
          />
        </div>

        <h2 className="mt-16 font-display text-3xl">The roadmap</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Twenty-five modules take you from installing Python to a polished arcade boxing
          game with menus, sound, and a state-machine driven opponent.
        </p>
        <ol className="mt-8 grid gap-3 md:grid-cols-2">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                to="/lessons/$moduleId/$lessonId"
                params={{ moduleId: m.id, lessonId: m.lessons[0].id }}
                className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                  {String(m.number).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-tight">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.summary}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-16 border-t border-border py-10 text-center text-sm text-muted-foreground">
        Built for anyone who wants to see their code punch back.
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="font-display text-3xl">{value}</dd>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-lg">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
