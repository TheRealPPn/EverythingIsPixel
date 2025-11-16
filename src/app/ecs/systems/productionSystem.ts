// src/app/ecs/systems/productionSystem.ts
import type { IWorld } from "bitecs";
import { defineQuery } from "bitecs";
import { ProductionConfig, ProductionState } from "../components/production";

const productionQuery = defineQuery([ProductionConfig, ProductionState]);

/**
 * Système générique de gestion du temps de production.
 * À chaque tick, il incrémente elapsedMs, et dès qu'on dépasse l'intervalle effectif,
 * il ajoute des "pendingProductions" pour l'entité.
 *
 * Les systèmes métiers (factory, grinder...) consomment ensuite pendingProductions.
 */
export function productionSystem(world: IWorld, deltaMs: number): IWorld {
  const entities = productionQuery(world);

  for (const eid of entities) {
    const isActive = ProductionState.isActive[eid];
    if (!isActive) continue;

    const baseInterval = ProductionConfig.baseIntervalMs[eid];
    if (baseInterval <= 0) continue;

    const speedMultiplier = ProductionState.speedMultiplier[eid] || 1;
    const effectiveInterval = baseInterval / speedMultiplier;

    // Sécurité pour éviter division par 0
    if (effectiveInterval <= 0) continue;

    // Avancement du temps pour cette entité
    ProductionState.elapsedMs[eid] += deltaMs;

    // On boucle pour gérer le cas où un gros delta dépasse plusieurs fois l'intervalle
    while (ProductionState.elapsedMs[eid] >= effectiveInterval) {
      ProductionState.elapsedMs[eid] -= effectiveInterval;

      const baseQuantity = ProductionConfig.baseQuantity[eid] || 1;
      // On ajoute le nombre de cycles de prod en attente
      ProductionState.pendingProductions[eid] += baseQuantity;
    }
  }

  return world;
}
