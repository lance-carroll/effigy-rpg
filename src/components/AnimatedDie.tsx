"use client";

import { useEffect, useRef, useState } from "react";

// A single die face that cycles through random values before settling
// on its final result, re-triggered whenever `rollId` changes.
export function AnimatedDie({
  shape,
  sides,
  finalValue,
  rollId,
  highlight = false,
  size = 36,
}: {
  shape: "pentagon" | "square";
  sides: number;
  finalValue: number;
  rollId: number;
  highlight?: boolean;
  size?: number;
}) {
  const [display, setDisplay] = useState(finalValue);
  const [rolling, setRolling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setRolling(true);
    let elapsed = 0;
    let delay = 40;
    const totalDuration = 650;

    const tick = () => {
      elapsed += delay;
      if (elapsed >= totalDuration) {
        setDisplay(finalValue);
        setRolling(false);
        return;
      }
      setDisplay(1 + Math.floor(Math.random() * sides));
      delay += 14; // ease out — each step takes a little longer
      timeoutRef.current = setTimeout(tick, delay);
    };
    timeoutRef.current = setTimeout(tick, delay);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollId]);

  const clipPath =
    shape === "pentagon" ? "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" : undefined;

  return (
    <span
      className="flex items-center justify-center border font-mono text-sm font-bold transition-colors"
      style={{
        width: size,
        height: size,
        clipPath,
        borderRadius: shape === "square" ? 6 : undefined,
        borderColor: highlight && !rolling ? "var(--color-accent)" : "var(--color-border)",
        backgroundColor: highlight && !rolling ? "var(--color-accent)" : "var(--color-surface-muted)",
        color: highlight && !rolling ? "var(--color-accent-ink)" : "inherit",
      }}
    >
      {display}
    </span>
  );
}
