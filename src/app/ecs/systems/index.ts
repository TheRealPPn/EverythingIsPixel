// src/app/ecs/systems/index.ts
import type { GameWorld, System } from "@/app/ecs/types";
import { world } from "@/app/ecs/world";

import { productionSystem } from "@/app/ecs/systems/productionSystem";
import { factoryProductionSystem } from "@/app/ecs/systems/factoryProductionSystem";

import { createGrinderSystem } from "@/app/ecs/systems/grinderSystem";
import type {
  GrinderBackend,
  GrinderResultPixelPacket,
} from "@/app/ecs/systems/grinderSystem";

import {
  createPixelPoolSystem,
  addPixelsToPool,
} from "@/app/ecs/systems/pixelPoolSystem";
import type { PixelPoolAccessor } from "@/app/ecs/systems/pixelPoolSystem";

import { createValorizerSystem } from "@/app/ecs/systems/valorizerSystem";
import type {
  ValorizerState,
  ValorizationRecipe,
} from "@/app/ecs/systems/valorizerSystem";

import { createOnValorizationComplete } from "@/app/ecs/systems/rewardSystem";
import type { ApplyRewardFn } from "@/app/ecs/systems/rewardSystem";

import { useGameStore } from "@/app/store/gameStore";

export interface EcsPixelPool {
  counts: Map<number, number>;
}

const pixelPoolAccessor: PixelPoolAccessor = {
  get(w: GameWorld): EcsPixelPool {
    // @ts-expect-error extension dynamique du world
    if (!w.pixelPool) {
      // @ts-expect-error
      w.pixelPool = { counts: new Map<number, number>() } as EcsPixelPool;
    }
    // @ts-expect-error
    return w.pixelPool;
  },
  set(w: GameWorld, pool: EcsPixelPool) {
    // @ts-expect-error
    w.pixelPool = pool;
  },
};

const valorizerStateAccessor = {
  getState(w: GameWorld): ValorizerState {
    // @ts-expect-error
    if (!w.valorizerState) {
      // @ts-expect-error
      w.valorizerState = { active: undefined } as ValorizerState;
    }
    // @ts-expect-error
    return w.valorizerState;
  },
  setState(w: GameWorld, state: ValorizerState) {
    // @ts-expect-error
    w.valorizerState = state;
  },
};

const applyReward: ApplyRewardFn = (_world, reward) => {
  const state = useGameStore.getState();
  if ((state as any).addXp) {
    (state as any).addXp(reward.xp);
  }
  if ((state as any).addCurrency) {
    (state as any).addCurrency(reward.currency);
  }
};

const onValorizationComplete = createOnValorizationComplete(applyReward);

const grinderBackend: GrinderBackend = {
  requestGrinding(jobEid: number) {
    console.debug("[GrinderBackend] requestGrinding", jobEid);
  },
  pollResults(_world: GameWorld) {
    const results: Array<{
      jobEid: number;
      pixels: GrinderResultPixelPacket[];
    }> = [];
    return results;
  },
};

const grinderSystem = createGrinderSystem({
  backend: grinderBackend,
  addPixelsToPool: (w, pixels) =>
    addPixelsToPool(pixelPoolAccessor, w, pixels),
});
const pixelPoolSystem = createPixelPoolSystem(pixelPoolAccessor);
const valorizerSystem = createValorizerSystem({
  pixelPool: pixelPoolAccessor,
  recipes: [],
  onComplete: onValorizationComplete,
  ...valorizerStateAccessor,
});

const pipeline: System[] = [
  productionSystem,
  factoryProductionSystem,
  grinderSystem,
  pixelPoolSystem,
  valorizerSystem,
];

export function updateWorld(dt: number): GameWorld {
  world.time = world.time ?? { delta: 0, elapsed: 0 };
  world.time.delta = dt;
  world.time.elapsed += dt;

  let w: GameWorld = world;
  for (const system of pipeline) {
    w = system(w);
  }
  return w;
}
