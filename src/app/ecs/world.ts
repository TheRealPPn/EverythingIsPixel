// src/app/ecs/world.ts
import { createWorld, addEntity, addComponent } from "bitecs";
import { ProductionConfig, ProductionState } from "@/app/ecs/components/production";

export const world = createWorld();

// Création de l’entité de l’usine
const factoryEntity = addEntity(world);
addComponent(world, ProductionConfig, factoryEntity);
addComponent(world, ProductionState, factoryEntity);

// Intervalle de base (1 minute) et 1 cycle par intervalle
ProductionConfig.baseIntervalMs[factoryEntity] = 60000;
ProductionConfig.baseQuantity[factoryEntity] = 1;

// État initial
ProductionState.elapsedMs[factoryEntity] = 0;
ProductionState.speedMultiplier[factoryEntity] = 1;
ProductionState.isActive[factoryEntity] = 1;
ProductionState.pendingProductions[factoryEntity] = 0;

// <— AJOUTÉ
// Export de l'identifiant de l’usine pour les autres modules
export const FACTORY_EID = factoryEntity;
