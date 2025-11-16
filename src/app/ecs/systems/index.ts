import { world } from "@/app/ecs/world";
import { productionSystem } from "@/app/ecs/systems/productionSystem";
import { useGameStore } from "@/app/store/gameStore";

export function updateWorld(dt: number) {
  // Moteur ECS : avance la production avec notre system
  productionSystem(world, dt);

  // MOTEUR ACTUEL (Zustand)
  // -> On le garde pour l’instant afin de ne rien casser.
  const applyProduction = useGameStore.getState().applyProduction;
  applyProduction(dt);

  return world;
}
