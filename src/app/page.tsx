"use client";

import { useState } from "react";
import { Defenses } from "@/components/Defenses";
import { DotTrack } from "@/components/DotTrack";
import { FocusList } from "@/components/FocusList";
import { GaugeBar } from "@/components/GaugeBar";
import { Roller } from "@/components/Roller";
import { WoundGauge } from "@/components/WoundGauge";
import { useEditMode } from "@/hooks/useEditMode";
import {
  ABILITY_DOT_TIERS,
  ABILITY_KEYS,
  abilityBonus,
  createBlankSheet,
  FOCUS_LISTS,
  fortitude,
  reflex,
  RESOURCE_DOT_TIERS,
  resourcePool,
  will,
  woundSlots,
  type AbilityKey,
  type ResourceKey,
  type WoundState,
} from "@/lib/sheet";

export default function Home() {
  const [sheet, setSheet] = useState(createBlankSheet());
  const { editMode, toggleEditMode } = useEditMode();

  const staminaMax = resourcePool(sheet.resources.stamina.dots);
  const focusMax = resourcePool(sheet.resources.focus.dots);

  const setAbilityDots = (key: AbilityKey, dots: number) =>
    setSheet((s) => {
      const abilities = { ...s.abilities, [key]: { dots } };
      // Trim selected focuses if the bonus dropped below the count selected.
      const slots = abilityBonus(dots);
      const focuses = { ...s.focuses, [key]: s.focuses[key].slice(0, slots) };
      return { ...s, abilities, focuses };
    });

  const setFocuses = (key: AbilityKey, selected: string[]) =>
    setSheet((s) => ({ ...s, focuses: { ...s.focuses, [key]: selected } }));

  const setResourceDots = (key: ResourceKey, dots: number) =>
    setSheet((s) => {
      const resources = { ...s.resources, [key]: { dots } };
      if (key !== "vigor") return { ...s, resources };

      // Vigor's pool size is the wound track size — resize wounds to
      // match, preserving existing slot states where possible.
      const newWoundMax = woundSlots(dots);
      const wounds: WoundState[] = Array.from(
        { length: newWoundMax },
        (_, i) => s.wounds[i] ?? "empty",
      );
      return { ...s, resources, wounds };
    });

  const handleRollResolve = (pool: "stamina" | "focus", clearedCount: number, crit: boolean) =>
    setSheet((s) => {
      const next = { ...s };
      if (pool === "stamina") next.staminaExhausted = s.staminaExhausted + clearedCount;
      else next.focusExhausted = s.focusExhausted + clearedCount;
      if (crit) next.tidePoints = Math.min(s.tidePoints + 1, s.tidePointsMax);
      return next;
    });

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--color-accent)]">{sheet.name}</h1>
        <label className="flex items-center gap-2 text-sm">
          Edit Sheet
          <button
            type="button"
            role="switch"
            aria-checked={editMode}
            onClick={toggleEditMode}
            className="relative h-5 w-9 rounded-full border transition-colors"
            style={{
              backgroundColor: editMode ? "var(--color-accent)" : "transparent",
              borderColor: "var(--color-border)",
            }}
          >
            <span
              className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-[var(--foreground)] transition-transform"
              style={{ transform: editMode ? "translateX(18px)" : "translateX(2px)" }}
            />
          </button>
        </label>
      </div>

      <section className="surface-shadow flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <GaugeBar
          label="Stamina"
          value={staminaMax - sheet.staminaExhausted}
          max={staminaMax}
          setValue={(v) => setSheet((s) => ({ ...s, staminaExhausted: staminaMax - v }))}
        />
        <GaugeBar
          label="Focus"
          value={focusMax - sheet.focusExhausted}
          max={focusMax}
          setValue={(v) => setSheet((s) => ({ ...s, focusExhausted: focusMax - v }))}
        />
        <GaugeBar
          label="Tide Points"
          value={sheet.tidePoints}
          max={sheet.tidePointsMax}
          setValue={(v) => setSheet((s) => ({ ...s, tidePoints: v }))}
        />
        <WoundGauge
          wounds={sheet.wounds}
          setWounds={(wounds) => setSheet((s) => ({ ...s, wounds }))}
        />
      </section>

      <section className="surface-shadow flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Defenses
        </h2>
        <Defenses
          armor={sheet.armor}
          fortitude={fortitude(sheet.abilities)}
          reflex={reflex(sheet.abilities)}
          will={will(sheet.abilities)}
          editMode={editMode}
          setArmor={(armor) => setSheet((s) => ({ ...s, armor }))}
        />
      </section>

      <section className="surface-shadow flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Roller
        </h2>
        <Roller
          abilityDots={sheet.abilities}
          staminaAvailable={staminaMax - sheet.staminaExhausted}
          focusAvailable={focusMax - sheet.focusExhausted}
          onResolve={handleRollResolve}
        />
      </section>

      <section className="surface-shadow flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Abilities
        </h2>
        {ABILITY_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-1.5 py-1">
            <DotTrack
              label={`${key} (+${abilityBonus(sheet.abilities[key].dots)})`}
              dots={sheet.abilities[key].dots}
              tiers={ABILITY_DOT_TIERS}
              editMode={editMode}
              setDots={(dots) => setAbilityDots(key, dots)}
            />
            <FocusList
              options={FOCUS_LISTS[key]}
              selected={sheet.focuses[key]}
              slots={abilityBonus(sheet.abilities[key].dots)}
              editMode={editMode}
              setSelected={(selected) => setFocuses(key, selected)}
            />
          </div>
        ))}
      </section>

      <section className="surface-shadow flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Resources
        </h2>
        <DotTrack
          label="Stamina"
          dots={sheet.resources.stamina.dots}
          tiers={RESOURCE_DOT_TIERS}
          editMode={editMode}
          setDots={(dots) => setResourceDots("stamina", dots)}
          stacked
          dotSize="sm"
        />
        <hr className="border-[var(--color-border)]" />
        <DotTrack
          label="Focus"
          dots={sheet.resources.focus.dots}
          tiers={RESOURCE_DOT_TIERS}
          editMode={editMode}
          setDots={(dots) => setResourceDots("focus", dots)}
          stacked
          dotSize="sm"
        />
        <hr className="border-[var(--color-border)]" />
        <DotTrack
          label="Vigor"
          dots={sheet.resources.vigor.dots}
          tiers={RESOURCE_DOT_TIERS}
          editMode={editMode}
          setDots={(dots) => setResourceDots("vigor", dots)}
          stacked
          dotSize="sm"
        />
      </section>
    </main>
  );
}
