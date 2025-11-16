import { useGameStore } from "@/app/store/gameStore";
import { formatPixelAmount } from "@/app/utils/numberFormat";
import { useFakeGrinder } from "@/features/grinder/grinderLogic";
import {
  getGrinderMainColor,
} from "@/features/grinder/GrinderModel";
import { colorIdToPixiHex } from "@/app/colors/colorId";

export function GrinderPage() {
  const grinder = useGameStore((s) => s.grinder);
  const pixelPool = useGameStore((s) => s.pixelPool);
  const { grindPlaceholderImage } = useFakeGrinder();

  const mainColorId = getGrinderMainColor(grinder);
  const stock = pixelPool[mainColorId] ?? 0n;

  const hex = colorIdToPixiHex(mainColorId);
  const hexString = `#${hex.toString(16).padStart(6, "0")}`;

  return (
    <div>
      <h1>Broyeuse</h1>
      <p>
        Générateur manuel : il produit des pixels lorsqu'on lui fournit des
        images (plus tard) ou lorsqu'on déclenche explicitement le broyage.
        Son comportement est défini dans la logique de la broyeuse, pas dans le store.
      </p>

      <div style={{ marginTop: 12, display: "flex", gap: 16, alignItems: "center" }}>
        <div>
          <div>
            Mode : <strong>Manuel</strong>
          </div>
          <div>
            Couleur principale actuelle :{" "}
            <code>{mainColorId}</code>
          </div>
          <div>
            Stock actuel :{" "}
            <strong>{formatPixelAmount(stock)} px</strong>
          </div>
        </div>

        {/* Aperçu couleur broyeuse */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.4)",
            backgroundColor: hexString,
          }}
          title={mainColorId}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={grindPlaceholderImage}>
          Broyer une image factice (+100 px)
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <p>
          Plus tard : drag &amp; drop d'images, file d'attente, rythme de
          broyage, passage en mode hybride (broyage automatique d'inputs en fond),
          tout en gardant la logique dans <code>grinderModel</code>.
        </p>
      </div>
    </div>
  );
}
