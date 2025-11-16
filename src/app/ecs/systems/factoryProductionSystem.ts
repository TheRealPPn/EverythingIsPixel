import type { IWorld } from "bitecs";
import { defineQuery } from "bitecs";
import { ProductionConfig, ProductionState } from "@/app/ecs/components/production";
import { useGameStore } from "@/app/store/gameStore";
import {
  getFactoryPrimaryColorId,
  getFactoryCurrentRatePerSecond,
} from "@/features/factory/FactoryModel";

// Sélectionne toutes les entités dotées de ProductionConfig/State.
const productionQuery = defineQuery([ProductionConfig, ProductionState]);

export function factoryProductionSystem(world: IWorld): IWorld {
  const entities = productionQuery(world);
  const store = useGameStore.getState();
  const factoryState = store.factory;
  const colorId = getFactoryPrimaryColorId(factoryState);
  const addPixels = store.addPixels;

  for (const eid of entities) {
    const cycles = ProductionState.pendingProductions[eid];
    if (cycles > 0) {
      const baseQty = ProductionConfig.baseQuantity[eid] || 1;
      // Chaque cycle produit baseQty pixels par niveau
      const produced = cycles * baseQty * factoryState.level;
      if (produced > 0) {
        addPixels(colorId, BigInt(produced));
      }
      ProductionState.pendingProductions[eid] = 0;
    }
  }
  return world;
}
