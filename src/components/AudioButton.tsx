"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function AudioButton({
  src,
  label = "اسمع",
  ariaLabel,
}: {
  src: string;
  label?: string;
  ariaLabel?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      el.currentTime = 0;
      setPlaying(false);
      return;
    }
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  return (
    <div className="relative z-10">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onEnded={() => setPlaying(false)}
        onPause={() => {
          const el = audioRef.current;
          if (el && el.paused && el.currentTime === 0) setPlaying(false);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "وقف النطق" : (ariaLabel ?? "اسمع نطق الحرف")}
        className={cn(
          "inline-flex min-h-11 items-center rounded-full border border-hairline bg-surface-2 px-4 text-sm text-text",
          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
        )}
      >
        {playing ? "وقف" : label}
      </button>
    </div>
  );
}
