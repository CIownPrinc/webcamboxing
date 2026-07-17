import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { createPortal } from "react-dom";

import { APP_CONFIG } from "@/config/app.config";
import { reportLovableError } from "@/lib/lovable-error-reporting";

interface BoxerEasterEggProps {
  readonly onImpact: () => void;
  readonly onComplete: () => void;
}

export function BoxerEasterEgg({ onImpact, onComplete }: BoxerEasterEggProps): ReactElement {
  const [showGlass, setShowGlass] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasImpacted = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleTimeUpdate = (): void => {
      if (
        v.duration > 0 &&
        v.currentTime >= v.duration - APP_CONFIG.ui.easterEggImpactLeadSeconds &&
        !hasImpacted.current
      ) {
        hasImpacted.current = true;
        setShowGlass(true);
        onImpact();
        new Audio("/glass-break.wav").play().catch((error: unknown) => {
          reportLovableError(error, { source: "boxer_easter_egg_audio" });
        });
      }
    };

    const handleEnded = (): void => {
      setTimeout(() => {
        setIsFading(true);
      }, APP_CONFIG.ui.easterEggFadeDelayMilliseconds);

      setTimeout(() => {
        onComplete();
      }, APP_CONFIG.ui.easterEggCompleteDelayMilliseconds);
    };

    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("ended", handleEnded);
    v.play().catch((error: unknown) => {
      reportLovableError(error, { source: "boxer_easter_egg_video" });
      onComplete();
    });

    return () => {
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("ended", handleEnded);
    };
  }, [onImpact, onComplete]);

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${showGlass ? "opacity-0" : "opacity-100"}`}
      />

      <video
        ref={videoRef}
        src="/boxer-punch.mp4"
        className={`relative z-10 w-full max-w-4xl max-h-screen object-contain transition-opacity duration-300 ${showGlass ? "opacity-0" : "opacity-100"}`}
        playsInline
      />

      {showGlass && (
        <div
          className={`absolute z-20 pointer-events-none transition-opacity duration-[1500ms] ease-out w-96 h-96 top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 ${isFading ? "opacity-0" : "opacity-100"}`}
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
