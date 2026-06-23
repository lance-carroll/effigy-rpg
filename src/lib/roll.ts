// Core resolution roll: 1d12 + ability bonus + risk dice (d6s).
// Each risk die that meets or beats Potency clears (+1, exhausts);
// dice below Potency return to the pool untouched.

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export interface RiskDieResult {
  value: number;
  cleared: boolean;
}

export interface RollResult {
  d12: number;
  abilityBonus: number;
  riskDice: RiskDieResult[];
  clearedCount: number;
  total: number;
  crit: boolean;
}

export function resolveRoll(
  abilityBonus: number,
  riskDiceCount: number,
  potency: number,
): RollResult {
  const d12 = rollDie(12);
  const riskDice: RiskDieResult[] = Array.from({ length: riskDiceCount }, () => {
    const value = rollDie(6);
    return { value, cleared: value >= potency };
  });
  const clearedCount = riskDice.filter((d) => d.cleared).length;

  return {
    d12,
    abilityBonus,
    riskDice,
    clearedCount,
    total: d12 + abilityBonus + clearedCount,
    crit: d12 === 12,
  };
}
