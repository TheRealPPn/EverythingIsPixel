// src/features/factory/FactoryModel.ts
import type { ColorId } from "@/app/colors/colorId";
import { colorIdFromRGB } from "@/app/colors/colorId";
import { ProductionConfig, ProductionState } from "@/app/ecs/components/production";
import { FACTORY_EID } from "@/app/ecs/world";

export type FactoryState = {
  level: number;
  isActive: boolean;
};

// État initial de l'usine
export function createInitialFactoryState(): FactoryState {
  return {
    level: 1,
    isActive: true,
  };
}

/**
 * Logique de production de l'usine pendant dt secondes.
 * On renvoie une liste de { colorId, amountFloat } pour que
 * le GameStore puisse convertir ça en pixels entiers + fractions.
 */
export function computeFactoryProduction(
  dt: number,
  state: FactoryState
): Array<{ colorId: ColorId; amountFloat: number }> {
  if (!state.isActive) return [];

  // Pour l'instant : une seule couleur, blanc pur (255,255,255)
  const primaryColorId = getFactoryPrimaryColorId(state);

  // Base : 5 px/s au niveau 1, multiplié par le level
  const baseRatePerSecond = 5;
  const rate = baseRatePerSecond * state.level;

  const amount = rate * dt; // valeur flottante, gérée ensuite dans le store

  return [
    {
      colorId: primaryColorId,
      amountFloat: amount,
    },
  ];
}

/**
 * Taux actuel de production en px/s (ou 0 si désactivé).
 * Il est calculé à partir du composant ECS (baseIntervalMs, baseQuantity, speedMultiplier)
 * et du niveau de l’usine.
 */
export function getFactoryCurrentRatePerSecond(state: FactoryState): number {
  if (!state.isActive) return 0;
  const eid = FACTORY_EID;
  const intervalMs = ProductionConfig.baseIntervalMs[eid];
  const quantity = ProductionConfig.baseQuantity[eid] || 1;
  const speed = ProductionState.speedMultiplier[eid] || 1;
  const active = ProductionState.isActive[eid] === 1;
  if (!active || !intervalMs) return 0;
  // Exemple : 1 cycle par 60000 ms → 0,0167 px/s au niveau 1
  return (quantity / (intervalMs / 1000)) * state.level * speed;
}

export function getFactoryPrimaryColorId(_state: FactoryState): ColorId {
  return colorIdFromRGB(255, 255, 255);
}