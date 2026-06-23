import type { WoundState } from "@/lib/sheet";

function woundColor(state: WoundState): string {
  if (state === "mortal") return "#c0392b";
  if (state === "flesh") return "#d4a017";
  return "transparent";
}

// Linear gauge for the wound track. Each segment is a two-stage click
// target: empty -> flesh (50% fill) -> mortal (100% fill) -> empty.
export function WoundGauge({
  wounds,
  setWounds,
}: {
  wounds: WoundState[];
  setWounds: (wounds: WoundState[]) => void;
}) {
  const advance = (index: number) => {
    const next = [...wounds];
    const current = next[index];
    next[index] = current === "empty" ? "flesh" : current === "flesh" ? "mortal" : "empty";
    setWounds(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Wounds
        </span>
        <span className="font-mono text-sm font-bold">
          {wounds.filter((w) => w === "mortal").length}X /{" "}
          {wounds.filter((w) => w === "flesh").length}\
        </span>
      </div>
      <div className="mt-1 flex gap-1">
        {wounds.map((state, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Wound slot ${index + 1}: ${state}, click to advance`}
            className="h-4 flex-1 rounded-sm border transition-colors"
            style={{
              borderColor: state === "empty" ? "var(--color-border)" : woundColor(state),
              backgroundColor: state === "empty" ? "transparent" : woundColor(state),
            }}
            onClick={() => advance(index)}
          />
        ))}
      </div>
    </div>
  );
}
