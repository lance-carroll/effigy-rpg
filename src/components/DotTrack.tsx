// Radial dot-button track for ability scores and resource investment.
// Renders identically in play and edit mode — editMode only controls
// whether clicking a dot is allowed to invest/remove it.
//
// `tiers` is rows of dot groups: each inner array is a tier, and each
// number within a tier is a step rendered as its own dot group with a
// single pipe divider between groups in the same row.
//
// `stacked` controls layout: false (default, used for abilities) lets
// tiers wrap inline in a single right-aligned flow. true (used for
// resources) forces a line break between tiers and left-aligns them —
// resource tiers are long enough that wrapping mid-tier reads poorly.
export function DotTrack({
  label,
  dots,
  tiers,
  editMode,
  setDots,
  stacked = false,
  dotSize = "md",
}: {
  label: string;
  dots: number;
  tiers: number[][];
  editMode: boolean;
  setDots: (dots: number) => void;
  stacked?: boolean;
  dotSize?: "sm" | "md";
}) {
  let cumulative = 0;
  const rows = tiers.map((groups) =>
    groups.map((size) => {
      const start = cumulative;
      cumulative += size;
      return { start, size };
    }),
  );

  const dotClass = dotSize === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";

  const renderGroup = (
    { start, size }: { start: number; size: number },
    groupIndex: number,
  ) => (
    <span key={groupIndex} className="flex items-center gap-2">
      {groupIndex > 0 && (
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
              className={`${dotClass} rounded-full border transition-colors ${
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
  );

  return (
    <div className={`flex items-start justify-between gap-3`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
        {label}
      </span>
      {stacked ? (
        <div className="flex flex-col items-start gap-1">
          {rows.map((groups, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              {groups.map((group, groupIndex) => renderGroup(group, groupIndex))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
          {rows.flat().map((group, groupIndex) => renderGroup(group, groupIndex))}
        </div>
      )}
    </div>
  );
}
