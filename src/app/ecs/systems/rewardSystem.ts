// src/app/ecs/systems/rewardSystem.ts
import type { GameWorld } from "@/app/ecs/types";
import type { ValorizationRecipe } from "@/app/ecs/systems/valorizerSystem";

export interface RewardPayload {
  xp: number;
  currency: number;
}

/**
 * Strategy pour appliquer une récompense au monde / store.
 * Typiquement : appelle ton store Zustand ici.
 */
export type ApplyRewardFn = (world: GameWorld, reward: RewardPayload) => void;

/**
 * Générateur de fonction onComplete à passer dans createValorizerSystem.
 */
export function createOnValorizationComplete(
  applyReward: ApplyRewardFn
) {
  return (world: GameWorld, recipe: ValorizationRecipe): void => {
    // Exemple de logique très simple :
    const reward: RewardPayload = {
      xp: recipe.input.reduce((acc, p) => acc + p.amount, 0),
      currency: recipe.input.length * 10,
    };

    applyReward(world, reward);
  };
}
