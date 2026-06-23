// Core data model for an Effigy character sheet (d12 branch v4 SRD).

export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA" | "LCK";

export const ABILITY_KEYS: AbilityKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA", "LCK"];

// Dots required to reach each bonus tier: 2-2-3-4-4-5, 20 dots total for +6.
export const ABILITY_TIER_DOTS = [2, 2, 3, 4, 4, 5] as const;

// Ability dots grouped into tiers, one group per bonus threshold, for
// rendering as stacked rows with breakpoint dividers between them.
export const ABILITY_DOT_TIERS: number[] = [...ABILITY_TIER_DOTS];

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

export type ResourceKey = "stamina" | "focus" | "vigor";

// Dots required for each of the 7 steps: 1-1-2 / 3-3-4 / 5-5-6 / 7-8.
export const RESOURCE_STEP_DOTS = [1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 8] as const;

// Pool size floor is 2 (0 dots invested); each step adds 1, with the
// last step of each tier (indices 2, 5, 8, 10) being a quality reward
// instead of a pool increase.
const RESOURCE_QUALITY_STEP_INDEXES = new Set([2, 5, 8, 10]);

// Resource dots grouped into the SRD's four tiers (1-1-2 / 3-3-4 / 5-5-6 / 7-8),
// for rendering as stacked rows with breakpoint dividers between them.
export const RESOURCE_DOT_TIERS: number[] = [4, 10, 16, 15];

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

export type WoundState = "empty" | "flesh" | "mortal";

export interface CharacterSheet {
  name: string;

  abilities: Record<AbilityKey, { dots: number }>;
  resources: Record<ResourceKey, { dots: number }>;

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
    resources: {
      stamina: { dots: 0 },
      focus: { dots: 0 },
      vigor: { dots: 0 },
    },
    staminaExhausted: 0,
    focusExhausted: 0,
    tidePoints: 3,
    tidePointsMax: 3,
    wounds: Array.from({ length: woundSlots(0) }, () => "empty"),
  };
}
