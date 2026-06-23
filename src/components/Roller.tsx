"use client";

import { useState } from "react";
import { AnimatedDie } from "@/components/AnimatedDie";
import { QUALITY_POTENCY, WEAPON_CATALOG, type EquippedWeapon } from "@/lib/equipment";
import { resolveRoll, type RollResult } from "@/lib/roll";
import { ABILITY_KEYS, abilityBonus, type AbilityKey } from "@/lib/sheet";

const POTENCY_OPTIONS = [3, 4, 5, 6];

export function Roller({
  abilityDots,
  weapons,
  staminaAvailable,
  focusAvailable,
  onResolve,
}: {
  abilityDots: Record<AbilityKey, { dots: number }>;
  weapons: EquippedWeapon[];
  staminaAvailable: number;
  focusAvailable: number;
  onResolve: (pool: "stamina" | "focus", clearedCount: number, crit: boolean) => void;
}) {
  // -1 means manual mode (no weapon selected — free choice of ability,
  // pool, and Potency, e.g. for skill checks or spells).
  const [weaponIndex, setWeaponIndex] = useState(-1);
  const [weaponAbility, setWeaponAbility] = useState<AbilityKey>("STR");
  const [manualAbility, setManualAbility] = useState<AbilityKey>("STR");
  const [manualPool, setManualPool] = useState<"stamina" | "focus">("stamina");
  const [manualPotency, setManualPotency] = useState(5);
  const [riskCount, setRiskCount] = useState(0);
  const [result, setResult] = useState<RollResult | null>(null);
  const [rollId, setRollId] = useState(0);

  const equippedWeapon = weaponIndex >= 0 && weaponIndex < weapons.length ? weapons[weaponIndex] : null;
  const weaponDef = equippedWeapon
    ? WEAPON_CATALOG.find((w) => w.name === equippedWeapon.name)
    : null;

  const ability = weaponDef ? weaponAbility : manualAbility;
  const pool = weaponDef ? "stamina" : manualPool;
  const potency = weaponDef ? QUALITY_POTENCY[equippedWeapon!.quality] : manualPotency;

  const available = pool === "stamina" ? staminaAvailable : focusAvailable;
  const cappedRiskCount = Math.min(riskCount, available);

  const selectWeapon = (index: number) => {
    setWeaponIndex(index);
    if (index >= 0) {
      const def = WEAPON_CATALOG.find((w) => w.name === weapons[index].name);
      if (def) setWeaponAbility(def.attackScores[0]);
    }
  };

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
            Weapon
          </span>
          <select
            value={weaponIndex}
            onChange={(e) => selectWeapon(Number(e.target.value))}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
          >
            <option value={-1}>Manual (skill check / spell)</option>
            {weapons.map((w, i) => (
              <option key={i} value={i}>
                {w.name} ({w.quality})
              </option>
            ))}
          </select>
        </label>

        {weaponDef && weaponDef.attackScores.length > 1 ? (
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
              Ability
            </span>
            <select
              value={weaponAbility}
              onChange={(e) => setWeaponAbility(e.target.value as AbilityKey)}
              className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
            >
              {weaponDef.attackScores.map((key) => (
                <option key={key} value={key}>
                  {key} (+{abilityBonus(abilityDots[key].dots)})
                </option>
              ))}
            </select>
          </label>
        ) : (
          !weaponDef && (
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
                Ability
              </span>
              <select
                value={manualAbility}
                onChange={(e) => setManualAbility(e.target.value as AbilityKey)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
              >
                {ABILITY_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key} (+{abilityBonus(abilityDots[key].dots)})
                  </option>
                ))}
              </select>
            </label>
          )
        )}

        {!weaponDef && (
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
              Risk Pool
            </span>
            <select
              value={manualPool}
              onChange={(e) => setManualPool(e.target.value as "stamina" | "focus")}
              className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
            >
              <option value="stamina">Stamina ({staminaAvailable} available)</option>
              <option value="focus">Focus ({focusAvailable} available)</option>
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
            Potency
          </span>
          {weaponDef ? (
            <span className="rounded border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2 py-1">
              {potency}+ ({equippedWeapon!.quality})
            </span>
          ) : (
            <select
              value={manualPotency}
              onChange={(e) => setManualPotency(Number(e.target.value))}
              className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
            >
              {POTENCY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}+
                </option>
              ))}
            </select>
          )}
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
