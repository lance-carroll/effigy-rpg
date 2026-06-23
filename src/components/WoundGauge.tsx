import type { WoundState } from "@/lib/sheet";

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
            className="relative h-4 flex-1 overflow-hidden rounded-sm border"
            style={{ borderColor: state === "empty" ? "var(--color-border)" : "var(--color-accent)" }}
            onClick={() => advance(index)}
          >
            <span
              className="absolute inset-y-0 left-0 transition-all"
              style={{
                width: state === "mortal" ? "100%" : state === "flesh" ? "50%" : "0%",
                backgroundColor: "var(--color-accent)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
