import { useEffect, useRef, useState } from "react";

export function BoxerEasterEgg({
  onImpact,
  onComplete,
}: {
  onImpact: () => void;
  onComplete: () => void;
}) {
  const [showGlass, setShowGlass] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // We assume the punch lands exactly when the video ends.
    // If the video is longer, we might need a timeupdate event.
    const v = videoRef.current;
    if (!v) return;

    const handleEnded = () => {
      setShowGlass(true);
      onImpact();
      new Audio("/glass-break.wav").play().catch((e) => console.error(e));

      // Hide the easter egg after 3 seconds of shattered glass
      setTimeout(() => {
        onComplete();
      }, 3000);
    };

    v.addEventListener("ended", handleEnded);
    // Auto-play the video
    v.play().catch((e) => {
      console.error("Easter egg video playback failed", e);
      onComplete(); // abort if it fails
    });

    return () => v.removeEventListener("ended", handleEnded);
  }, [onImpact, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background dimming */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${showGlass ? "opacity-0" : "opacity-100"}`}
      />

      {/* Boxer Video */}
      <video
        ref={videoRef}
        src="/boxer-punch.mp4"
        className={`relative z-10 w-full max-w-4xl max-h-screen object-contain transition-opacity duration-300 ${showGlass ? "opacity-0" : "opacity-100"}`}
        playsInline
        muted // Muted to ensure autoplay works, unless user wants sound from the video itself.
      />

      {/* Cracked Glass Overlay */}
      {showGlass && (
        <div
          className="absolute inset-0 z-20 mix-blend-screen pointer-events-none animate-in fade-in duration-100"
          style={{
            backgroundImage: "url('/cracked-glass.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
    </div>
  );
}
