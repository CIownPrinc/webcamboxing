import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { registerAppServiceWorker } from "../lib/register-sw";
import { useProgress } from "../lib/progress";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              try {
                reset();
                router.invalidate();
              } catch {
                window.location.reload();
              }
              setTimeout(() => {
                if (document.querySelector("h1")?.textContent?.includes("didn't load")) {
                  window.location.reload();
                }
              }, 150);
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Webcam Boxing — Free Python Game Development & Computer Vision Course" },
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Webcam Boxing — Free Python Game Development & Computer Vision Course",
      },
      {
        name: "twitter:description",
        content:
          "Learn Python, OpenCV, MediaPipe, and Pygame from scratch by building a webcam-controlled arcade boxing game. 25 step-by-step interactive modules, 100% free.",
      },
      {
        property: "og:image",
        content: "/icon-512.png",
      },
      {
        name: "twitter:image",
        content: "/icon-512.png",
      },
    ],
    links: [
      { rel: "canonical", href: "https://webcamboxing.com" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <script
          // Apply persisted theme before paint to avoid a flash.
          dangerouslySetInnerHTML={{
            __html:
              "try{var s=JSON.parse(localStorage.getItem('wb.progress.v1')||'{}');document.documentElement.classList.toggle('dark',(s.theme||'dark')==='dark')}catch(e){}",
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { BackgroundLayer } from "../components/BackgroundLayer";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { theme } = useProgress();

  useEffect(() => {
    registerAppServiceWorker();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundLayer />
      <Outlet />
    </QueryClientProvider>
  );
}
