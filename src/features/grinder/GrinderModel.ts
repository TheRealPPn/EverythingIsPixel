import type { ColorId } from "@/app/colors/colorId";
import { colorIdFromRGB } from "@/app/colors/colorId";

export type GrinderState = {
  level: number;
  isActive: boolean;
  // Plus tard : slots, vitesse de broyage, modes automatiques, etc.
};

// État initial de la broyeuse
export function createInitialGrinderState(): GrinderState {
  return {
    level: 1,
    isActive: true,
  };
}

/**
 * Couleur principale associée à la broyeuse pour l'instant.
 * Plus tard, ça dépendra du type d'images broyées, des recettes, etc.
 */
export function getGrinderMainColor(_state: GrinderState): ColorId {
  // Exemple : RVB(123,56,1) => "COLOR_123056001"
  return colorIdFromRGB(123, 56, 1);
}
