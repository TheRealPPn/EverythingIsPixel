import type { IWorld } from "bitecs";
import { defineQuery } from "bitecs";
import { ProductionConfig, ProductionState } from "../components/production";
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
  const rate = getFactoryCurrentRatePerSecond(factoryState); // px/s au niveau actuel
  const addPixels = store.addPixels;

  for (const eid of entities) {
    const cycles = ProductionState.pendingProductions[eid];
    if (cycles > 0) {
      // Chaque cycle correspond à une seconde (1000 ms) : on multiplie par le débit en px/s
      const produced = Math.floor(cycles * rate);
      if (produced > 0) {
        addPixels(colorId, BigInt(produced));
      }
      // On remet le compteur à zéro
      ProductionState.pendingProductions[eid] = 0;
    }
  }
  return world;
}
