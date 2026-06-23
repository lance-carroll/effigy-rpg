"use client";

import { useState } from "react";
import { AnimatedDie } from "@/components/AnimatedDie";
import { resolveRoll, type RollResult } from "@/lib/roll";
import { ABILITY_KEYS, abilityBonus, type AbilityKey } from "@/lib/sheet";

const POTENCY_OPTIONS = [3, 4, 5, 6];

export function Roller({
  abilityDots,
  staminaAvailable,
  focusAvailable,
  onResolve,
}: {
  abilityDots: Record<AbilityKey, { dots: number }>;
  staminaAvailable: number;
  focusAvailable: number;
  onResolve: (pool: "stamina" | "focus", clearedCount: number, crit: boolean) => void;
}) {
  const [ability, setAbility] = useState<AbilityKey>("STR");
  const [pool, setPool] = useState<"stamina" | "focus">("stamina");
  const [potency, setPotency] = useState(5);
  const [riskCount, setRiskCount] = useState(0);
  const [result, setResult] = useState<RollResult | null>(null);
  const [rollId, setRollId] = useState(0);

  const available = pool === "stamina" ? staminaAvailable : focusAvailable;
  const cappedRiskCount = Math.min(riskCount, available);

  const roll = () => {
    const rolled = resolveRoll(abilityBonus(abilityDots[ability].dots), cappedRiskCount, potency);
    setResult(rolled);
    setRollId((id) => id + 1);
    onResolve(pool, rolled.clearedCount, rolled.crit);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
            Ability
          </span>
          <select
            value={ability}
            onChange={(e) => setAbility(e.target.value as AbilityKey)}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
          >
            {ABILITY_KEYS.map((key) => (
              <option key={key} value={key}>
                {key} (+{abilityBonus(abilityDots[key].dots)})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
            Risk Pool
          </span>
          <select
            value={pool}
            onChange={(e) => setPool(e.target.value as "stamina" | "focus")}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
          >
            <option value="stamina">Stamina ({staminaAvailable} available)</option>
            <option value="focus">Focus ({focusAvailable} available)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
            Potency
          </span>
          <select
            value={potency}
            onChange={(e) => setPotency(Number(e.target.value))}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
          >
            {POTENCY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}+
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
            Risk Dice ({cappedRiskCount})
          </span>
          <input
            type="range"
            min={0}
            max={available}
            value={cappedRiskCount}
            onChange={(e) => setRiskCount(Number(e.target.value))}
          />
        </label>

        <button
          type="button"
          onClick={roll}
          className="rounded-md border px-4 py-1.5 text-sm font-semibold"
          style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
        >
          Roll
        </button>
      </div>

      {result && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-[var(--color-border)] p-3 text-sm">
          <AnimatedDie shape="pentagon" sides={12} finalValue={result.d12} rollId={rollId} highlight={result.crit} size={44} />
          {result.crit && (
            <span className="text-xs font-bold uppercase" style={{ color: "var(--color-accent)" }}>
              Crit
            </span>
          )}
          <span>+{result.abilityBonus} ability</span>
          <span className="flex gap-1">
            {result.riskDice.map((d, i) => (
              <AnimatedDie
                key={i}
                shape="square"
                sides={6}
                finalValue={d.value}
                rollId={rollId}
                highlight={d.cleared}
              />
            ))}
          </span>
          <span className="font-mono text-lg font-bold">= {result.total}</span>
        </div>
      )}
    </div>
  );
}
