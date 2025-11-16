// src/app/ecs/types.ts
import type { IWorld } from "bitecs";

export type GameWorld = IWorld & {
  time?: {
    delta: number;
    elapsed: number;
  };
  // pixelPool?: any;
  // valorizerState?: any;
};

export type System = (world: GameWorld) => GameWorld;
