// Displays the four static defenses, all pure read-outs. Armor sums
// equipped armor + shield bonuses (see @/lib/equipment); the other
// three derive from ability bonuses.
export function Defenses({
  armor,
  fortitude,
  reflex,
  will,
}: {
  armor: number;
  fortitude: number;
  reflex: number;
  will: number;
}) {
  const stat = (label: string, value: number) => (
    <div
      key={label}
      className="flex flex-col items-center gap-1 rounded-md border border-[var(--color-border)] px-3 py-2"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
        {label}
      </span>
      <span className="font-mono text-xl font-bold">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {stat("Armor", armor)}
      {stat("Fortitude", fortitude)}
      {stat("Reflex", reflex)}
      {stat("Will", will)}
    </div>
  );
}
