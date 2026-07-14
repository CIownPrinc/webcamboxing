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
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasImpacted = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleTimeUpdate = () => {
      // Trigger the shatter effect ~400ms before the video finishes to align with the punch
      if (v.duration > 0 && v.currentTime >= v.duration - 0.4 && !hasImpacted.current) {
        hasImpacted.current = true;
        setShowGlass(true);
        onImpact();
        new Audio("/glass-break.wav").play().catch((e) => console.error(e));
      }
    };

    const handleEnded = () => {
      // Start fading out
      setTimeout(() => {
        setIsFading(true);
      }, 1500);

      // Hide the easter egg after 3 seconds total
      setTimeout(() => {
        onComplete();
      }, 3000);
    };

    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("ended", handleEnded);
    // Auto-play the video
    v.play().catch((e) => {
      console.error("Easter egg video playback failed", e);
      onComplete(); // abort if it fails
    });

    return () => {
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("ended", handleEnded);
    };
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
        />
      )}
    </div>,
    document.body,
  );
}
