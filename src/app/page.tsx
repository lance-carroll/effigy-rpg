"use client";

import { useState } from "react";
import { DotTrack } from "@/components/DotTrack";
import { GaugeBar } from "@/components/GaugeBar";
import { WoundGauge } from "@/components/WoundGauge";
import { useEditMode } from "@/hooks/useEditMode";
import {
  ABILITY_KEYS,
  abilityBonus,
  createBlankSheet,
  resourcePool,
  woundSlots,
  type AbilityKey,
  type ResourceKey,
} from "@/lib/sheet";

export default function Home() {
  const [sheet, setSheet] = useState(createBlankSheet());
  const { editMode, toggleEditMode } = useEditMode();

  const staminaMax = resourcePool(sheet.resources.stamina.dots);
  const focusMax = resourcePool(sheet.resources.focus.dots);
  const woundMax = woundSlots(sheet.resources.vigor.dots);

  const setAbilityDots = (key: AbilityKey, dots: number) =>
    setSheet((s) => ({ ...s, abilities: { ...s.abilities, [key]: { dots } } }));

  const setResourceDots = (key: ResourceKey, dots: number) =>
    setSheet((s) => ({ ...s, resources: { ...s.resources, [key]: { dots } } }));

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

      <section className="surface-shadow flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Abilities
        </h2>
        {ABILITY_KEYS.map((key) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <DotTrack
              label={`${key} (+${abilityBonus(sheet.abilities[key].dots)})`}
              dots={sheet.abilities[key].dots}
              max={20}
              editMode={editMode}
              setDots={(dots) => setAbilityDots(key, dots)}
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
          max={45}
          editMode={editMode}
          setDots={(dots) => setResourceDots("stamina", dots)}
        />
        <DotTrack
          label="Focus"
          dots={sheet.resources.focus.dots}
          max={45}
          editMode={editMode}
          setDots={(dots) => setResourceDots("focus", dots)}
        />
        <DotTrack
          label="Vigor"
          dots={sheet.resources.vigor.dots}
          max={45}
          editMode={editMode}
          setDots={(dots) => setResourceDots("vigor", dots)}
        />
      </section>
    </main>
  );
}
