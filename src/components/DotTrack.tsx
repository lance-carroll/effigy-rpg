// Radial dot-button track for ability scores and resource investment.
// Renders identically in play and edit mode — editMode only controls
// whether clicking a dot is allowed to invest/remove it. Dots are
// grouped into tiers (one row per tier) with a pipe divider between
// tiers, so long tracks (e.g. 45 resource dots) stay readable.
export function DotTrack({
  label,
  dots,
  tiers,
  editMode,
  setDots,
}: {
  label: string;
  dots: number;
  tiers: number[];
  editMode: boolean;
  setDots: (dots: number) => void;
}) {
  let cumulative = 0;
  const rows = tiers.map((tierSize) => {
    const start = cumulative;
    cumulative += tierSize;
    return { start, size: tierSize };
  });

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
        {label}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
        {rows.map(({ start, size }, rowIndex) => (
          <span key={rowIndex} className="flex items-center gap-2">
            {rowIndex > 0 && (
              <span className="text-[var(--color-border)]" aria-hidden>
                |
              </span>
            )}
            <span className="flex gap-1">
              {Array.from({ length: size }, (_, i) => {
                const index = start + i;
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
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
