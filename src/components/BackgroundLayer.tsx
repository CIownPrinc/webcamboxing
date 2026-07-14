import { useProgress } from "@/lib/progress";

export const WALLPAPER_PRESETS: Record<string, { name: string; url: string }> = {
  mountain: {
    name: "Mountain Dusk",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
  },
  ocean: {
    name: "Deep Ocean",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
  },
  city: {
    name: "Midnight City Grid",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80",
  },
  field: {
    name: "Minimalist Field",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80",
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
      <div className="absolute inset-0 bg-background/85 dark:bg-[#0f1117]/88 backdrop-blur-[2px] transition-colors duration-500" />
    </div>
  );
}
