import { useProgress } from "@/lib/progress";

export const WALLPAPER_PRESETS: Record<string, { name: string; url: string }> = {
  glacier: {
    name: "Glacier Ice",
    url: "/backgrounds/glacier.jpeg",
  },
  lake: {
    name: "Still Lake",
    url: "/backgrounds/lake.JPG",
  },
  lake2: {
    name: "Lake Reflection",
    url: "/backgrounds/lake2.jpeg",
  },
  lush_hills: {
    name: "Lush Hills",
    url: "/backgrounds/lush_hills.JPG",
  },
  mountain: {
    name: "Mountaintop",
    url: "/backgrounds/mountaintop.jpeg",
  },
  ocean: {
    name: "Deep Ocean",
    url: "/backgrounds/ocean.jpeg",
  },
};

export function BackgroundLayer() {
  const { wallpaper, customWallpaper } = useProgress();

  if (wallpaper === "none") {
    return null;
  }

  const activeUrl =
    wallpaper === "custom" && customWallpaper
      ? customWallpaper
      : WALLPAPER_PRESETS[wallpaper]?.url || WALLPAPER_PRESETS.mountain.url;

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden select-none">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-out"
        style={{ backgroundImage: `url("${activeUrl}")` }}
      />
      {/* Calibrated atmosphere scrim ensuring WCAG AA+ high contrast for all text above */}
      <div className="absolute inset-0 bg-background/82 dark:bg-[#0f1117]/84 backdrop-blur-[1px] transition-colors duration-500" />
    </div>
  );
}
