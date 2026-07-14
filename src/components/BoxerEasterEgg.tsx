import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

  return createPortal(
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
      />

      {/* Cracked Glass Overlay */}
      {showGlass && (
        <div
          className="absolute z-20 pointer-events-none animate-in fade-in duration-100 w-96 h-96 top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundImage: "url('/cracked-glass.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      )}
    </div>,
    document.body,
  );
}
