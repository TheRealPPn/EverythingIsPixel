import { world } from "@/app/ecs/world";
import { productionSystem } from "@/app/ecs/systems/productionSystem";
import { factoryProductionSystem } from "@/app/ecs/systems/factoryProductionSystem";
// import { useGameStore } from "@/app/store/gameStore"; // n’est plus nécessaire ici

export function updateWorld(dt: number) {
  // Met à jour les compteurs de production (elapsedMs et pendingProductions)
  productionSystem(world, dt);
  // Consomme les productions en attente et les transforme en pixels
  factoryProductionSystem(world);
  // L’appel à applyProduction(dt) du store peut être retiré une fois ce système en place
  return world;
}
