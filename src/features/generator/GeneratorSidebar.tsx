import { useLocation, useNavigate } from "react-router-dom";
import { useGameStore } from "@/app/store/gameStore";
import { formatPixelAmount } from "@/app/utils/numberFormat";
import {
  getFactoryCurrentRatePerSecond,
  getFactoryPrimaryColorId,
} from "@/features/factory/FactoryModel";
import {
  getGrinderMainColor,
} from "@/features/grinder/GrinderModel";

export function GeneratorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const factory = useGameStore((s) => s.factory);
  const grinder = useGameStore((s) => s.grinder);
  const pixelPool = useGameStore((s) => s.pixelPool);

  // Usine : infos principales
  const factoryColorId = getFactoryPrimaryColorId(factory);
  const factoryRate = getFactoryCurrentRatePerSecond(factory);
  const factoryStock = pixelPool[factoryColorId] ?? 0n;

  // Broyeuse : couleur dominante actuelle
  const grinderColorId = getGrinderMainColor(grinder);
  const grinderStock = pixelPool[grinderColorId] ?? 0n;

  const isFactoryActive = location.pathname === "/factory" || location.pathname === "/";
  const isGrinderActive = location.pathname === "/grinder";

  return (
    <div className="generator-sidebar">
      <h2>Générateurs</h2>
      <ul className="generator-list">
        {/* Carte Usine à pixels (passif) */}
        <li
          className={`generator-card ${isFactoryActive ? "active" : ""}`}
          onClick={() => navigate("/factory")}
        >
          <div className="generator-card-header">
            <strong>Usine à pixels</strong>
            <span className="generator-kind">Passif</span>
          </div>
          <div className="generator-card-body">
            <div className="generator-rate">
              {factoryRate.toFixed(1)} px/s
            </div>
            <div className="generator-stock">
              Stock : {formatPixelAmount(factoryStock)} px
            </div>
          </div>
        </li>

        {/* Carte Broyeuse (manuel) */}
        <li
          className={`generator-card ${isGrinderActive ? "active" : ""}`}
          onClick={() => navigate("/grinder")}
        >
          <div className="generator-card-header">
            <strong>Broyeuse</strong>
            <span className="generator-kind">Manuel</span>
          </div>
          <div className="generator-card-body">
            <div className="generator-rate">Action à déclencher</div>
            <div className="generator-stock">
              Stock : {formatPixelAmount(grinderStock)} px
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
