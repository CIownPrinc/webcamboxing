export interface WallpaperPreset {
  readonly name: string;
  readonly url: string;
}

export const WALLPAPER_PRESETS: Record<string, WallpaperPreset> = {
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
