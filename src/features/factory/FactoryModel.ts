import type { ColorId } from "@/app/colors/colorId";
import { colorIdFromRGB } from "@/app/colors/colorId";

export type FactoryState = {
  level: number;
  isActive: boolean;
  // Plus tard : upgrades, recettes, slots, etc.
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
 * Taux actuel de production en px/s, pour l'affichage UI.
 */
export function getFactoryCurrentRatePerSecond(state: FactoryState): number {
  if (!state.isActive) return 0;
  const baseRatePerSecond = 5;
  return baseRatePerSecond * state.level;
}

/**
 * Couleur principale produite par l'usine.
 * Pour l'instant : blanc (255,255,255) => COLOR_255255255.
 * Plus tard, on pourra faire dépendre ça du level, des upgrades, etc.
 */
export function getFactoryPrimaryColorId(_state: FactoryState): ColorId {
  return colorIdFromRGB(255, 255, 255); // "COLOR_255255255"
}
