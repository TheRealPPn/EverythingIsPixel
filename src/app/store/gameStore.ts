import { create } from "zustand";
import type { ColorId } from "@/app/colors/colorId";
import { createInitialFactoryState } from "@/features/factory/FactoryModel";
import { createInitialGrinderState } from "@/features/grinder/GrinderModel";

export type PixelPool = {
  [colorId: string]: bigint; // ColorId => quantité en entier
};

export type FractionalPixelPool = {
  [colorId: string]: number; // stocke les fractions temporaires [0,1)
};

export type GameState = {
  tick: number;

  pixelPool: PixelPool;
  fractionalPool: FractionalPixelPool;

  // Etat par module
  factory: ReturnType<typeof createInitialFactoryState>;
  grinder: ReturnType<typeof createInitialGrinderState>;

  // Contrôle global du loop
  isLoopPaused: boolean;

  // Actions génériques
  addPixels: (colorId: ColorId, amount: bigint) => void;
  spendPixels: (colorId: ColorId, amount: bigint) => boolean;
  incrementTick: () => void;

  // Contrôle du loop
  pauseLoop: () => void;
  resumeLoop: () => void;
  toggleLoop: () => void;

  // Tick global (appelé à chaque frame)
//   applyProduction: (dt: number) => void;
};

const STORAGE_KEY = "everything-is-pixel-save-v1";

function loadInitialState(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    const pixelPool: PixelPool = {};
    if (parsed.pixelPool) {
      for (const [key, val] of Object.entries(
        parsed.pixelPool as Record<string, string>
      )) {
        pixelPool[key] = BigInt(val);
      }
    }

    const fractionalPool: FractionalPixelPool = parsed.fractionalPool ?? {};

    return {
      tick: parsed.tick ?? 0,
      pixelPool,
      fractionalPool,
      factory: parsed.factory ?? createInitialFactoryState(),
      grinder: parsed.grinder ?? createInitialGrinderState(),
      isLoopPaused: parsed.isLoopPaused ?? false,
    };
  } catch {
    return {};
  }
}

function persist(state: GameState) {
  try {
    const serializablePixelPool: Record<string, string> = {};
    for (const [key, val] of Object.entries(state.pixelPool)) {
      serializablePixelPool[key] = val.toString();
    }

    const toSave = {
      tick: state.tick,
      pixelPool: serializablePixelPool,
      fractionalPool: state.fractionalPool,
      factory: state.factory,
      grinder: state.grinder,
      isLoopPaused: state.isLoopPaused,
    };


    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

export const useGameStore = create<GameState>((set, get) => {
  const initial = loadInitialState();

  return {
    tick: initial.tick ?? 0,
    pixelPool: initial.pixelPool ?? {},
    fractionalPool: initial.fractionalPool ?? {},
    factory: initial.factory ?? createInitialFactoryState(),
    grinder: initial.grinder ?? createInitialGrinderState(),
	isLoopPaused: initial.isLoopPaused ?? false,

    addPixels: (colorId, amount) => {
      set((state) => {
        const current = state.pixelPool[colorId] ?? 0n;
        const pixelPool: PixelPool = {
          ...state.pixelPool,
          [colorId]: current + amount,
        };
        const newState = { ...state, pixelPool };
        persist(newState);
        return newState;
      });
    },

    spendPixels: (colorId, amount) => {
      let success = false;
      set((state) => {
        const current = state.pixelPool[colorId] ?? 0n;
        if (current < amount) {
          success = false;
          return state;
        }
        const pixelPool: PixelPool = {
          ...state.pixelPool,
          [colorId]: current - amount,
        };
        const newState = { ...state, pixelPool };
        persist(newState);
        success = true;
        return newState;
      });
      return success;
    },

    incrementTick: () => {
      set((state) => {
        const newState = { ...state, tick: state.tick + 1 };
        persist(newState);
        return newState;
      });
    },
	
	pauseLoop: () => {
      set((state) => {
        const newState = { ...state, isLoopPaused: true };
        persist(newState);
        return newState;
      });
    },

    resumeLoop: () => {
      set((state) => {
        const newState = { ...state, isLoopPaused: false };
        persist(newState);
        return newState;
      });
    },

    toggleLoop: () => {
      set((state) => {
        const newState = { ...state, isLoopPaused: !state.isLoopPaused };
        persist(newState);
        return newState;
      });
    },

//     applyProduction: (dt: number) => {
//       set((state) => {
//         let pixelPool: PixelPool = { ...state.pixelPool };
//         let fractionalPool: FractionalPixelPool = { ...state.fractionalPool };
// 
//         // 1) Production de l'usine (passive), selon SA logique
//         const factoryOutputs = computeFactoryProduction(dt, state.factory);
//         for (const out of factoryOutputs) {
//           const colorId = out.colorId;
//           const producedFloat = out.amountFloat;
//           const prevFrac = fractionalPool[colorId] ?? 0;
//           const total = prevFrac + producedFloat;
// 
//           const whole = Math.floor(total);
//           const frac = total - whole;
// 
//           if (whole > 0) {
//             const current = pixelPool[colorId] ?? 0n;
//             pixelPool[colorId] = current + BigInt(whole);
//           }
// 
//           fractionalPool[colorId] = frac;
//         }
// 
//         // 2) Plus tard : d'autres modules passifs (autres usines, transforms, etc.)
//         // 3) La broyeuse reste MANUELLE pour l'instant → pas de prod ici
// 
//         const newState: GameState = {
//           ...state,
//           pixelPool,
//           fractionalPool,
//         };
//         persist(newState);
//         return newState;
//       });
//     },
  };
});