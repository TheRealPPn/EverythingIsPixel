import { createWorld, addEntity, addComponent } from "bitecs";
import { ProductionConfig, ProductionState } from "@/app/ecs/components/production";

export const world = createWorld();

// Création et configuration de l’entité de l’usine
const factoryEntity = addEntity(world);
addComponent(world, ProductionConfig, factoryEntity);
addComponent(world, ProductionState, factoryEntity);

// Intervalle de base (1 s) et 1 cycle par intervalle
ProductionConfig.baseIntervalMs[factoryEntity] = 60000;
ProductionConfig.baseQuantity[factoryEntity] = 1;

// État initial : temps écoulé à 0 ms, multiplicateur 1×, actif, 0 production en attente
ProductionState.elapsedMs[factoryEntity] = 0;
ProductionState.speedMultiplier[factoryEntity] = 1;
ProductionState.isActive[factoryEntity] = 1;
ProductionState.pendingProductions[factoryEntity] = 0;
