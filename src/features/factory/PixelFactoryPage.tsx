import { useGameStore } from "@/app/store/gameStore";
import { formatPixelAmount } from "@/app/utils/numberFormat";
import {
  getFactoryCurrentRatePerSecond,
  getFactoryPrimaryColorId,
} from "@/features/factory/FactoryModel";
import { colorIdToPixiHex } from "@/app/colors/colorId";

export function PixelFactoryPage() {
  const factory = useGameStore((s) => s.factory);
  const pixelPool = useGameStore((s) => s.pixelPool);

  const ratePerSecond = getFactoryCurrentRatePerSecond(factory);
  const primaryColorId = getFactoryPrimaryColorId(factory);
  const stock = pixelPool[primaryColorId] ?? 0n;

  const hex = colorIdToPixiHex(primaryColorId);
  const hexString = `#${hex.toString(16).padStart(6, "0")}`;

  return (
    <div>
      <h1>Usine à pixels</h1>
      <p>
        Générateur passif qui produit des pixels en continu, même lorsque vous
        êtes sur d'autres modules. Son comportement (couleurs produites, rythme)
        est entièrement défini dans la logique de l'usine, pas dans le store.
      </p>

      <div style={{ marginTop: 12, display: "flex", gap: 16, alignItems: "center" }}>
        <div>
          <div>
            Débit actuel :{" "}
            <strong>{ratePerSecond.toFixed(1)} px/s</strong>
          </div>
          <div>
            Couleur principale :{" "}
            <code>{primaryColorId}</code>
          </div>
          <div>
            Stock actuel :{" "}
            <strong>{formatPixelAmount(stock)} px</strong>
          </div>
        </div>

        {/* Petit aperçu couleur */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.4)",
            backgroundColor: hexString,
          }}
          title={primaryColorId}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <p>
          Plus tard : animations propres à l'usine, upgrades, déblocage
          progressif de nouvelles couleurs, recettes etc. La logique restera
          encapsulée dans <code>factoryModel</code>, de sorte que le store
          n'ait jamais à connaître le détail de ce que l'usine produit.
        </p>
      </div>
    </div>
  );
}
