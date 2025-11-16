// src/app/ecs/systems/valorizerSystem.ts
import type { GameWorld, System } from "@/app/ecs/types";
import type { PixelPoolAccessor } from "@/app/ecs/systems/pixelPoolSystem";

export interface ValorizationRecipe {
  id: string;
  input: { colorId: number; amount: number }[];
  outputId: string;
  durationSeconds: number;
}

export interface ActiveValorization {
  recipeId: string;
  elapsed: number;
}

export interface ValorizerState {
  active?: ActiveValorization;
}

export type OnValorizationCompleteFn = (
  world: GameWorld,
  recipe: ValorizationRecipe
) => void;

export interface ValorizerSystemConfig {
  pixelPool: PixelPoolAccessor;
  recipes: ValorizationRecipe[];
  onComplete: OnValorizationCompleteFn;
  getState(world: GameWorld): ValorizerState;
  setState(world: GameWorld, state: ValorizerState): void;
}

export function createValorizerSystem(
  config: ValorizerSystemConfig
): System {
  const { pixelPool, recipes, onComplete, getState, setState } = config;

  const recipesById = new Map<string, ValorizationRecipe>();
  for (const r of recipes) {
    recipesById.set(r.id, r);
  }

  return (world: GameWorld): GameWorld => {
    const dt = world.time?.delta ?? 0;
    const state = getState(world);

    if (!state.active) {
      return world;
    }

    const recipe = recipesById.get(state.active.recipeId);
    if (!recipe) {
      state.active = undefined;
      setState(world, state);
      return world;
    }

    state.active.elapsed += dt;

    if (state.active.elapsed >= recipe.durationSeconds) {
      const pool = pixelPool.get(world);

      for (const { colorId, amount } of recipe.input) {
        const current = pool.counts.get(colorId) ?? 0;
        pool.counts.set(colorId, Math.max(0, current - amount));
      }

      pixelPool.set(world, pool);

      onComplete(world, recipe);

      state.active = undefined;
      setState(world, state);
    } else {
      setState(world, state);
    }

    return world;
  };
}
