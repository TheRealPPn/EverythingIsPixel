// src/app/ecs/components/production.ts
import { defineComponent, Types } from "bitecs";

/**
 * Configuration "statique" de la production d'un module.
 * Attachée à chaque entité qui produit dans le temps (usine, broyeuse, valorisateur, etc.).
 */
export const ProductionConfig = defineComponent({
  // Durée de base entre deux productions complètes (en ms)
  baseIntervalMs: Types.f32,
  // Quantité de "cycles de production" générés à chaque intervalle
  baseQuantity: Types.f32,
});

/**
 * État "dynamique" de la production.
 * Mis à jour à chaque tick par le système de production.
 */
export const ProductionState = defineComponent({
  // Temps accumulé depuis la dernière production (en ms)
  elapsedMs: Types.f32,
  // Multiplicateur de vitesse (1 = normal, 2 = 2x plus rapide, etc.)
  speedMultiplier: Types.f32,
  // 1 = actif, 0 = inactif
  isActive: Types.ui8,
  // Nombre de productions en attente pour ce module
  pendingProductions: Types.ui16,
});
