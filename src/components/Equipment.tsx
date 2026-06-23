"use client";

import { useState } from "react";
import {
  ARMOR_CATALOG,
  physicalSlots,
  physicalSlotsUsed,
  QUALITY_OPTIONS,
  SHIELD_CATALOG,
  WEAPON_CATALOG,
  type Inventory,
  type Quality,
} from "@/lib/equipment";

export function Equipment({
  inventory,
  conBonus,
  editMode,
  setInventory,
}: {
  inventory: Inventory;
  conBonus: number;
  editMode: boolean;
  setInventory: (inventory: Inventory) => void;
}) {
  const [pendingWeapon, setPendingWeapon] = useState(WEAPON_CATALOG[0].name);
  const [pendingQuality, setPendingQuality] = useState<Quality>("Standard");

  const maxSlots = physicalSlots(conBonus);
  const usedSlots = physicalSlotsUsed(inventory);
  const slotsFull = usedSlots >= maxSlots;

  const addWeapon = () => {
    if (slotsFull) return;
    setInventory({
      ...inventory,
      weapons: [...inventory.weapons, { name: pendingWeapon, quality: pendingQuality }],
    });
  };

  const removeWeapon = (index: number) =>
    setInventory({ ...inventory, weapons: inventory.weapons.filter((_, i) => i !== index) });

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-[var(--foreground)]/60">
        Physical slots: {usedSlots} / {maxSlots}
      </div>

      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
          Weapons
        </h3>
        <ul className="flex flex-col gap-1">
          {inventory.weapons.map((w, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-sm">
              <span>
                {w.name} <span className="text-[var(--foreground)]/60">({w.quality})</span>
              </span>
              {editMode && (
                <button
                  type="button"
                  onClick={() => removeWeapon(i)}
                  className="text-xs text-[var(--color-accent)]"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
          {inventory.weapons.length === 0 && (
            <li className="text-sm text-[var(--foreground)]/40">No weapons carried.</li>
          )}
        </ul>
        {editMode && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select
              value={pendingWeapon}
              onChange={(e) => setPendingWeapon(e.target.value)}
              className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
            >
              {WEAPON_CATALOG.map((w) => (
                <option key={w.name} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
            <select
              value={pendingQuality}
              onChange={(e) => setPendingQuality(e.target.value as Quality)}
              className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
            >
              {QUALITY_OPTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={slotsFull}
              onClick={addWeapon}
              className="rounded border px-2 py-1 text-sm disabled:opacity-40"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
            Armor
          </span>
          <select
            value={inventory.armorName ?? ""}
            disabled={!editMode}
            onChange={(e) =>
              setInventory({ ...inventory, armorName: e.target.value || null })
            }
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
          >
            <option value="">None</option>
            {ARMOR_CATALOG.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name} (+{a.armorBonus})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
            Shield
          </span>
          <select
            value={inventory.shieldName ?? ""}
            disabled={!editMode}
            onChange={(e) =>
              setInventory({ ...inventory, shieldName: e.target.value || null })
            }
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
          >
            <option value="">None</option>
            {SHIELD_CATALOG.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} (+{s.armorBonus})
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
