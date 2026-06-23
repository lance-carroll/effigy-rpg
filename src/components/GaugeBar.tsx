// Linear gauge of segments for live play-mode pools (Stamina, Focus, Tide).
// Each segment is a single click target: filled or empty.
export function GaugeBar({
  label,
  value,
  max,
  setValue,
}: {
  label: string;
  value: number;
  max: number;
  setValue: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          {label}
        </span>
        <span className="font-mono text-sm font-bold">
          {value}/{max}
        </span>
      </div>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: max }, (_, index) => {
          const filled = index < value;

          return (
            <button
              key={index}
              type="button"
              aria-label={
                filled && index === value - 1
                  ? `Clear ${label} segment ${index + 1}`
                  : `Fill ${label} up to ${index + 1}`
              }
              className="h-4 flex-1 rounded-sm border transition-colors"
              style={{
                backgroundColor: filled ? "var(--color-accent)" : "transparent",
                borderColor: filled ? "var(--color-accent)" : "var(--color-border)",
              }}
              onClick={() => setValue(index + 1 === value ? index : index + 1)}
            />
          );
        })}
      </div>
    </div>
  );
}
