import type { AbilityKey } from "@/lib/sheet";

export type Quality = "Crude" | "Standard" | "Fine" | "Masterwork";

export const QUALITY_OPTIONS: Quality[] = ["Crude", "Standard", "Fine", "Masterwork"];

export const QUALITY_POTENCY: Record<Quality, number> = {
  Crude: 6,
  Standard: 5,
  Fine: 4,
  Masterwork: 3,
};

export type WeaponClass = "light" | "medium" | "heavy";
export type DefenseTarget = "Armor" | "Fortitude" | "Reflex" | "Will";

export interface WeaponDef {
  name: string;
  attackScores: AbilityKey[]; // one, or two if the wielder may choose either
  target: DefenseTarget;
  weaponClass: WeaponClass;
  qualities: string[];
}

export const WEAPON_CATALOG: WeaponDef[] = [
  { name: "Dagger", attackScores: ["DEX"], target: "Armor", weaponClass: "light", qualities: ["Quick", "Keen"] },
  { name: "Short Sword", attackScores: ["DEX"], target: "Armor", weaponClass: "light", qualities: ["Quick"] },
  { name: "Hand Axe", attackScores: ["STR", "DEX"], target: "Armor", weaponClass: "light", qualities: ["Thrown"] },
  { name: "Shortbow", attackScores: ["DEX"], target: "Reflex", weaponClass: "light", qualities: ["Quick", "Skirmish"] },
  { name: "Longsword", attackScores: ["STR", "DEX"], target: "Armor", weaponClass: "medium", qualities: ["Flowing", "Keen"] },
  { name: "Spear", attackScores: ["STR"], target: "Armor", weaponClass: "medium", qualities: ["Reach"] },
  { name: "Boarding Axe", attackScores: ["STR"], target: "Armor", weaponClass: "medium", qualities: ["Flowing"] },
  { name: "Longbow", attackScores: ["DEX"], target: "Reflex", weaponClass: "medium", qualities: ["Deliberate"] },
  { name: "Warhammer", attackScores: ["STR"], target: "Armor", weaponClass: "heavy", qualities: ["Keen"] },
  { name: "Greatsword", attackScores: ["STR"], target: "Armor", weaponClass: "heavy", qualities: ["Area"] },
  { name: "Maul", attackScores: ["STR"], target: "Fortitude", weaponClass: "heavy", qualities: [] },
  { name: "Crossbow", attackScores: ["DEX"], target: "Armor", weaponClass: "heavy", qualities: ["Deliberate", "Knight-Killer"] },
];

// Stamina cost by weapon class: { light attack, heavy attack }.
export const WEAPON_STAMINA_COST: Record<WeaponClass, { light: number; heavy: number }> = {
  light: { light: 1, heavy: 3 },
  medium: { light: 2, heavy: 3 },
  heavy: { light: 2, heavy: 4 },
};

export interface EquippedWeapon {
  name: string;
  quality: Quality;
}

export interface ArmorDef {
  name: string;
  armorBonus: number;
  reactionPotency: number;
  dots: number;
  scoreReq?: string;
}

export const ARMOR_CATALOG: ArmorDef[] = [
  { name: "Duelist's Gambeson", armorBonus: 1, reactionPotency: 4, dots: 3 },
  { name: "Scout's Leathers", armorBonus: 1, reactionPotency: 4, dots: 3 },
  { name: "Brigandine", armorBonus: 2, reactionPotency: 5, dots: 3, scoreReq: "STR 3" },
  { name: "Plate Harness", armorBonus: 3, reactionPotency: 6, dots: 3, scoreReq: "STR 6" },
  { name: "Great Plate", armorBonus: 4, reactionPotency: 6, dots: 2, scoreReq: "STR 10" },
];

export interface ShieldDef {
  name: string;
  armorBonus: number;
  reactionDice: number;
  scoreReq?: string;
}

export const SHIELD_CATALOG: ShieldDef[] = [
  { name: "Buckler", armorBonus: 1, reactionDice: 1 },
  { name: "Heater Shield", armorBonus: 1, reactionDice: 1, scoreReq: "STR 3" },
  { name: "Tower Shield", armorBonus: 2, reactionDice: 1, scoreReq: "STR 6" },
];

export interface Inventory {
  weapons: EquippedWeapon[];
  armorName: string | null;
  shieldName: string | null;
}

export function createBlankInventory(): Inventory {
  return { weapons: [], armorName: null, shieldName: null };
}

// Physical inventory slots = 10 + 2 * CON bonus. Each carried weapon,
// the equipped armor, and the equipped shield occupy 1 slot each.
export function physicalSlots(conBonus: number): number {
  return 10 + 2 * conBonus;
}

export function physicalSlotsUsed(inventory: Inventory): number {
  return inventory.weapons.length + (inventory.armorName ? 1 : 0) + (inventory.shieldName ? 1 : 0);
}

// Armor defense has no ability-bonus base — it's purely the sum of
// equipped armor and shield bonuses.
export function armorDefense(inventory: Inventory): number {
  const armor = ARMOR_CATALOG.find((a) => a.name === inventory.armorName);
  const shield = SHIELD_CATALOG.find((s) => s.name === inventory.shieldName);
  return (armor?.armorBonus ?? 0) + (shield?.armorBonus ?? 0);
}
