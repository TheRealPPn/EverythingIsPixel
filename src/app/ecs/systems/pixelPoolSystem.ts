// src/app/ecs/systems/pixelPoolSystem.ts
import type { GameWorld, System } from "@/app/ecs/types";

export interface PixelPool {
  counts: Map<number, number>;
}

export interface PixelPoolAccessor {
  get(world: GameWorld): PixelPool;
  set(world: GameWorld, pool: PixelPool): void;
}

export function createPixelPoolSystem(
  accessor: PixelPoolAccessor
): System {
  return (world: GameWorld): GameWorld => {
    const pool = accessor.get(world);

    for (const [colorId, amount] of pool.counts.entries()) {
      if (amount <= 0) {
        pool.counts.delete(colorId);
      } else if (!Number.isFinite(amount)) {
        pool.counts.set(colorId, 0);
      }
    }

    accessor.set(world, pool);
    return world;
  };
}

export function addPixelsToPool(
  accessor: PixelPoolAccessor,
  world: GameWorld,
  pixels: { colorId: number; amount: number }[]
): void {
  const pool = accessor.get(world);

  for (const { colorId, amount } of pixels) {
    const current = pool.counts.get(colorId) ?? 0;
    pool.counts.set(colorId, current + amount);
  }

  accessor.set(world, pool);
}
