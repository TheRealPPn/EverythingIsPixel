// src/app/ecs/world.ts
import { createWorld, addEntity, addComponent } from "bitecs";
import type { GameWorld } from "@/app/ecs/types";
import {
  ProductionConfig,
  ProductionState,
} from "@/app/ecs/components/production";

export const world: GameWorld = createWorld() as GameWorld;

world.time = {
  delta: 0,
  elapsed: 0,
};

const factoryEntity = addEntity(world);
addComponent(world, ProductionConfig, factoryEntity);
addComponent(world, ProductionState, factoryEntity);

ProductionConfig.baseIntervalMs[factoryEntity] = 60000;
ProductionConfig.baseQuantity[factoryEntity] = 1;

ProductionState.elapsedMs[factoryEntity] = 0;
ProductionState.speedMultiplier[factoryEntity] = 1;
ProductionState.isActive[factoryEntity] = 1;
ProductionState.pendingProductions[factoryEntity] = 0;

export const FACTORY_EID = factoryEntity;
