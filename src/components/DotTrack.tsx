// Radial dot-button track for ability scores and resource investment.
// Renders identically in play and edit mode — editMode only controls
// whether clicking a dot is allowed to invest/remove it.
export function DotTrack({
  label,
  dots,
  max,
  editMode,
  setDots,
}: {
  label: string;
  dots: number;
  max: number;
  editMode: boolean;
  setDots: (dots: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
        {label}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, index) => {
          const filled = index < dots;

          return (
            <button
              key={index}
              type="button"
              disabled={!editMode}
              aria-label={
                filled && index === dots - 1
                  ? `Remove ${label} dot ${index + 1}`
                  : `Invest ${label} dot ${index + 1}`
              }
              className={`h-3.5 w-3.5 rounded-full border transition-colors ${
                editMode ? "cursor-pointer" : "cursor-default"
              }`}
              style={{
                backgroundColor: filled ? "var(--color-accent)" : "transparent",
                borderColor: filled ? "var(--color-accent)" : "var(--color-border)",
              }}
              onClick={() => setDots(index + 1 === dots ? index : index + 1)}
            />
          );
        })}
      </div>
    </div>
  );
}
