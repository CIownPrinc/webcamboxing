import { useProgress } from "@/lib/progress";
import { WALLPAPER_PRESETS } from "@/data/wallpapers";

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
      <div className="absolute inset-0 bg-background/82 dark:bg-[#0f1117]/84 backdrop-blur-[1px] transition-colors duration-500" />
    </div>
  );
}
