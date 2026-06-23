// Displays the four static defenses. Armor has no formula (equipment
// only, not modeled yet) so it's an editable number gated by edit
// mode, like dot tracks; Fortitude/Reflex/Will are pure read-outs
// derived from ability bonuses.
export function Defenses({
  armor,
  fortitude,
  reflex,
  will,
  editMode,
  setArmor,
}: {
  armor: number;
  fortitude: number;
  reflex: number;
  will: number;
  editMode: boolean;
  setArmor: (armor: number) => void;
}) {
  const stat = (label: string, value: number) => (
    <div className="flex flex-col items-center gap-1 rounded-md border border-[var(--color-border)] px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
        {label}
      </span>
      <span className="font-mono text-xl font-bold">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-col items-center gap-1 rounded-md border border-[var(--color-border)] px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Armor
        </span>
        <input
          type="number"
          min={0}
          value={armor}
          disabled={!editMode}
          onChange={(e) => setArmor(Math.max(0, Number(e.target.value)))}
          className="w-12 bg-transparent text-center font-mono text-xl font-bold"
        />
      </div>
      {stat("Fortitude", fortitude)}
      {stat("Reflex", reflex)}
      {stat("Will", will)}
    </div>
  );
}
