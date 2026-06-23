// Core data model for an Effigy character sheet (d12 branch v4 SRD).

import { createBlankInventory, type Inventory } from "@/lib/equipment";

export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA" | "LCK";

export const ABILITY_KEYS: AbilityKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA", "LCK"];

// Dots required to reach each bonus tier: 2-2-3-4-4-5, 20 dots total for +6.
export const ABILITY_TIER_DOTS = [2, 2, 3, 4, 4, 5] as const;

// Ability dots grouped into rows, one row per bonus threshold, for
// rendering as stacked rows. Each row has a single dot group.
export const ABILITY_DOT_TIERS: number[][] = ABILITY_TIER_DOTS.map((size) => [size]);

export function abilityBonus(dots: number): number {
  let remaining = dots;
  let bonus = 0;
  for (const tierDots of ABILITY_TIER_DOTS) {
    if (remaining < tierDots) break;
    remaining -= tierDots;
    bonus += 1;
  }
  return bonus;
}

// Six focuses per ability. A focus is earned (selectable) each time a
// new ability bonus threshold is reached, up to all six at +6.
export const FOCUS_LISTS: Record<AbilityKey, string[]> = {
  STR: ["Athletics", "Intimidation", "Force", "Grappling", "Construction", "Hauling"],
  DEX: ["Agility", "Finesse", "Stealth", "Aim", "Riding", "Reflexes"],
  CON: ["Endurance", "Grit", "Survival", "Resistance", "Recovery", "Metabolism"],
  INT: ["Knowledge", "Investigation", "Arcana", "Engineering", "Medicine", "Tactics"],
  WIS: ["Perception", "Insight", "Navigation", "Vigilance", "Herbalism", "Attunement"],
  CHA: ["Influence", "Streetwise", "Deception", "Performance", "Leadership", "Charm"],
  LCK: ["Intuition", "Fortune", "Scavenging", "Omens", "Timing", "Providence"],
};

export type ResourceKey = "stamina" | "focus" | "vigor";

// Dots required for each of the 7 steps: 1-1-2 / 3-3-4 / 5-5-6 / 7-8.
export const RESOURCE_STEP_DOTS = [1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 8] as const;

// Pool size floor is 2 (0 dots invested); each step adds 1, with the
// last step of each tier (indices 2, 5, 8, 10) being a quality reward
// instead of a pool increase.
const RESOURCE_QUALITY_STEP_INDEXES = new Set([2, 5, 8, 10]);

// Resource dots grouped into the SRD's four tiers (1-1-2 / 3-3-4 / 5-5-6 / 7-8).
// Each tier is one row (line break between rows); within a row, each step
// is its own dot group separated by a single pipe divider.
export const RESOURCE_DOT_TIERS: number[][] = [
  [1, 1, 2],
  [3, 3, 4],
  [5, 5, 6],
  [7, 8],
];

export function resourcePool(dots: number): number {
  let remaining = dots;
  let pool = 2;
  for (let i = 0; i < RESOURCE_STEP_DOTS.length; i++) {
    if (remaining < RESOURCE_STEP_DOTS[i]) break;
    remaining -= RESOURCE_STEP_DOTS[i];
    if (!RESOURCE_QUALITY_STEP_INDEXES.has(i)) pool += 1;
  }
  return Math.min(pool, 9);
}

// Vigor's pool size IS the wound track size (slots), using the same step table.
export function woundSlots(vigorDots: number): number {
  return resourcePool(vigorDots);
}

// Derived defenses: higher of the two governing ability bonuses + 6,
// clamped to [1, 12]. Armor has no ability-bonus base — see
// armorDefense() in @/lib/equipment, which sums equipped gear instead.
function derivedDefense(bonusA: number, bonusB: number): number {
  return Math.max(1, Math.min(12, Math.max(bonusA, bonusB) + 6));
}

export function fortitude(abilities: Record<AbilityKey, { dots: number }>): number {
  return derivedDefense(abilityBonus(abilities.STR.dots), abilityBonus(abilities.CON.dots));
}

export function reflex(abilities: Record<AbilityKey, { dots: number }>): number {
  return derivedDefense(abilityBonus(abilities.DEX.dots), abilityBonus(abilities.INT.dots));
}

export function will(abilities: Record<AbilityKey, { dots: number }>): number {
  return derivedDefense(abilityBonus(abilities.WIS.dots), abilityBonus(abilities.CHA.dots));
}

export type WoundState = "empty" | "flesh" | "mortal";

export interface CharacterSheet {
  name: string;

  abilities: Record<AbilityKey, { dots: number }>;
  resources: Record<ResourceKey, { dots: number }>;
  // Chosen focuses per ability — capped at abilityBonus(dots) selections.
  focuses: Record<AbilityKey, string[]>;

  inventory: Inventory;

  // Live play-mode state.
  staminaExhausted: number;
  focusExhausted: number;
  tidePoints: number;
  tidePointsMax: number;
  wounds: WoundState[];
}

export function createBlankSheet(name = "New Character"): CharacterSheet {
  return {
    name,
    abilities: ABILITY_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: { dots: 0 } }),
      {} as CharacterSheet["abilities"],
    ),
    focuses: ABILITY_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as CharacterSheet["focuses"],
    ),
    resources: {
      stamina: { dots: 0 },
      focus: { dots: 0 },
      vigor: { dots: 0 },
    },
    inventory: createBlankInventory(),
    staminaExhausted: 0,
    focusExhausted: 0,
    tidePoints: 3,
    tidePointsMax: 3,
    wounds: Array.from({ length: woundSlots(0) }, () => "empty"),
  };
}
