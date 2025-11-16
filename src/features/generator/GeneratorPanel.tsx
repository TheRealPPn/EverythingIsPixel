import { useGameStore } from "@/app/store/gameStore";
import { formatPixelAmount } from "@/app/utils/numberFormat";

export function GeneratorPanel() {
  const generators = useGameStore((s) => s.generators);
  const pixelPool = useGameStore((s) => s.pixelPool);

  return (
    <div>
      <h2>Générateurs</h2>
      {generators.length === 0 && <p>Aucun générateur pour l’instant.</p>}
      <ul>
        {generators.map((gen) => {
          const stock = pixelPool[gen.colorId] ?? 0n;
          return (
            <li key={gen.id}>
              <div>
                <strong>{gen.name}</strong>
              </div>
              <div>
                {gen.baseRatePerSecond.toFixed(1)} px/s → {gen.colorId}
              </div>
              <div>Stock actuel : {formatPixelAmount(stock)} px</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
