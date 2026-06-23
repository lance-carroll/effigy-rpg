// Chip row for an ability's six focuses. Renders identically in play
// and edit mode — editMode only controls whether clicking a chip can
// select/deselect it. Selecting beyond the earned slot count is a
// no-op rather than an error, since over-selecting just means there's
// nothing to do until another bonus threshold is reached.
export function FocusList({
  options,
  selected,
  slots,
  editMode,
  setSelected,
}: {
  options: string[];
  selected: string[];
  slots: number;
  editMode: boolean;
  setSelected: (selected: string[]) => void;
}) {
  const toggle = (focus: string) => {
    if (selected.includes(focus)) {
      setSelected(selected.filter((f) => f !== focus));
      return;
    }
    if (selected.length >= slots) return;
    setSelected([...selected, focus]);
  };

  return (
    <div className="flex flex-nowrap gap-1 pl-1">
      {options.map((focus) => {
        const isSelected = selected.includes(focus);
        const atCap = !isSelected && selected.length >= slots;

        return (
          <button
            key={focus}
            type="button"
            disabled={!editMode || atCap}
            aria-pressed={isSelected}
            className={`whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[9px] transition-colors ${
              editMode && !atCap ? "cursor-pointer" : "cursor-default"
            }`}
            style={{
              backgroundColor: isSelected ? "var(--color-accent)" : "transparent",
              borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
              color: isSelected ? "var(--color-accent-ink)" : "inherit",
              opacity: atCap ? 0.4 : 1,
            }}
            onClick={() => toggle(focus)}
          >
            {focus}
          </button>
        );
      })}
    </div>
  );
}
