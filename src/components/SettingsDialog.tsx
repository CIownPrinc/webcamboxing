import { useState } from "react";
import { createPortal } from "react-dom";
import { Settings, Upload, Check, Moon, Sun } from "lucide-react";
import { useProgress, useHydrated } from "@/lib/progress";
import { WALLPAPER_PRESETS } from "./BackgroundLayer";
import { Button } from "@/components/ui/button";

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const { wallpaper, customWallpaper, setWallpaper, setCustomWallpaper, theme, setTheme } =
    useProgress();

  if (!hydrated) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-card/60 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground opacity-50 backdrop-blur"
      >
        <Settings className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Settings</span>
      </button>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomWallpaper(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-card/60 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur transition-all hover:border-primary/50 hover:bg-card hover:text-foreground shadow-sm"
        aria-label="Appearance & Settings"
        title="Appearance & Settings"
      >
        <Settings className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Settings</span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
            <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />

            <div className="flex min-h-full items-center justify-center py-6 sm:py-12 pointer-events-none">
              <div className="glass-panel relative flex max-h-[calc(100vh-3rem)] sm:max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl pointer-events-auto">
                <div className="flex shrink-0 items-center justify-between border-b border-border/60 p-4 sm:p-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-tight">
                      Appearance & Settings
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Customize your workspace background and theme preferences.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                  {/* Theme Mode Selection */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Interface Theme
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                          theme === "light"
                            ? "border-primary bg-primary/10 text-foreground shadow-sm"
                            : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40"
                        }`}
                      >
                        <Sun className="h-4 w-4 text-primary" /> Light Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                          theme === "dark"
                            ? "border-primary bg-primary/10 text-foreground shadow-sm"
                            : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40"
                        }`}
                      >
                        <Moon className="h-4 w-4 text-primary" /> Dark Mode
                      </button>
                    </div>
                  </div>

                  {/* Background Preset Selection */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Background Wallpaper
                    </label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Scenic photography diffused behind glass navigation. Text remains
                      high-contrast.
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {Object.entries(WALLPAPER_PRESETS).map(([key, preset]) => {
                        const active = wallpaper === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setWallpaper(key)}
                            className={`group relative flex flex-col items-start overflow-hidden rounded-xl border p-2 text-left transition-all ${
                              active
                                ? "border-primary ring-1 ring-primary shadow-md"
                                : "border-border/60 hover:border-border"
                            }`}
                          >
                            <div
                              className="h-14 w-full rounded-lg bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                              style={{ backgroundImage: `url("${preset.url}")` }}
                            />
                            <span className="mt-2 text-xs font-medium truncate w-full">
                              {preset.name}
                            </span>
                            {active && (
                              <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}

                      {/* Pure Solid Option */}
                      <button
                        type="button"
                        onClick={() => setWallpaper("none")}
                        className={`flex flex-col items-start justify-center rounded-xl border p-3 text-left transition-all ${
                          wallpaper === "none"
                            ? "border-primary bg-primary/10 ring-1 ring-primary shadow-md"
                            : "border-border/60 hover:border-border bg-muted/10"
                        }`}
                      >
                        <div className="flex h-14 w-full items-center justify-center rounded-lg border border-dashed border-border/80 bg-background/50 text-xs text-muted-foreground">
                          Pure Solid
                        </div>
                        <span className="mt-2 text-xs font-medium text-muted-foreground">
                          No Image
                        </span>
                      </button>

                      {/* Custom Uploaded Option if present */}
                      {customWallpaper && (
                        <button
                          type="button"
                          onClick={() => setWallpaper("custom")}
                          className={`group relative flex flex-col items-start overflow-hidden rounded-xl border p-2 text-left transition-all ${
                            wallpaper === "custom"
                              ? "border-primary ring-1 ring-primary shadow-md"
                              : "border-border/60 hover:border-border"
                          }`}
                        >
                          <div
                            className="h-14 w-full rounded-lg bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundImage: `url("${customWallpaper}")` }}
                          />
                          <span className="mt-2 text-xs font-medium truncate w-full">
                            Custom Upload
                          </span>
                          {wallpaper === "custom" && (
                            <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Custom File Uploader */}
                    <div className="mt-3">
                      <label className="neo-inset flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-3 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-primary hover:text-foreground">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload your own custom image...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 justify-end border-t border-border/60 p-4 sm:p-5">
                  <Button onClick={() => setOpen(false)} className="rounded-xl px-6 font-semibold">
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
