import { useGameStore } from "@/app/store/gameStore";
import { formatPixelAmount } from "@/app/utils/numberFormat";
import { colorIdToPixiHex } from "@/app/colors/colorId";

export function PixelPoolPage() {
  const pixelPool = useGameStore((s) => s.pixelPool);

  const entries = Object.entries(pixelPool)
    .filter(([_, amount]) => (amount ?? 0n) > 0n)
    .sort((a, b) => {
      // tri par quantité décroissante
      const av = a[1] ?? 0n;
      const bv = b[1] ?? 0n;
      if (av === bv) return 0;
      return av > bv ? -1 : 1;
    });

  return (
    <div>
      <h1>Pool de pixels</h1>
      <p>
        Vue globale de toutes les couleurs actuellement présentes dans le jeu.
        Chaque case représente un “pixel agrandi” pour une couleur donnée.
      </p>

      <div className="pixel-grid">
        {entries.map(([colorId, amount]) => {
          const hex = colorIdToPixiHex(colorId);
          const hexString = `#${hex.toString(16).padStart(6, "0")}`;

          return (
            <div key={colorId} className="pixel-cell">
              <div
                className="pixel-swatch"
                style={{ backgroundColor: hexString }}
                title={colorId}
              />
              <div className="pixel-info">
                <div className="pixel-id">{colorId}</div>
                <div className="pixel-amount">
                  {formatPixelAmount(amount ?? 0n)} px
                </div>
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div style={{ marginTop: 12 }}>Aucun pixel dans le pool pour le moment.</div>
        )}
      </div>
    </div>
  );
}
