import { useGameStore } from "@/app/store/gameStore";
import { colorIdFromRGB } from "@/app/colors/colorId";

export function useFakeGrinder() {
  const addPixels = useGameStore((s) => s.addPixels);

  const grindPlaceholderImage = () => {
    // Simule une image avec dominante RVB(123, 56, 1)
    const colorId = colorIdFromRGB(123, 56, 1);
    addPixels(colorId, 100n);
  };

  return { grindPlaceholderImage };
}
