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

// Type definitions for menu items and sections
type MenuItem = {
  id: string;
  label: string;
  path: string;
  kind?: "passive" | "manual" | "system";
};

type MenuSection = {
  id: string;
  label: string;
  items: MenuItem[];
};

// Menu structure definition
const SECTIONS: MenuSection[] = [
  {
    id: "production",
    label: "Production",
    items: [
      { id: "factory", label: "Usine à pixels", path: "/factory", kind: "passive" },
      { id: "grinder", label: "Broyeuse", path: "/grinder", kind: "manual" },
    ],
  },
  {
    id: "management",
    label: "Gestion",
    items: [
      { id: "pool", label: "Pool de pixels", path: "/pool", kind: "system" },
      // plus tard : transformeur, valorisateur, prestige, etc.
    ],
  },
];

/**
 * Barre latérale principale pour la boucle de jeu.
 * Affiche des informations dynamiques sur la production en fonction de l'état ECS.
 */
export function LoopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération de l'état via le store Zustand
  const factory = useGameStore((s) => s.factory);
  const grinder = useGameStore((s) => s.grinder);
  const pixelPool = useGameStore((s) => s.pixelPool);

  // Calcul des informations pour l'usine
  const factoryColorId = getFactoryPrimaryColorId(factory);
  const factoryRatePerSecond = getFactoryCurrentRatePerSecond(factory);
  const factoryStock = pixelPool[factoryColorId] ?? 0n;
  // Format dynamique du sous-titre : px/s ou px/min selon la cadence
  const factorySubtitle =
    factoryRatePerSecond < 0.1
      ? `${(factoryRatePerSecond * 60).toFixed(1)} px/min`
      : `${factoryRatePerSecond.toFixed(1)} px/s`;

  // Calcul des informations pour la broyeuse
  const grinderColorId = getGrinderMainColor(grinder);
  const grinderStock = pixelPool[grinderColorId] ?? 0n;

  // Calcul du total de pixels dans la réserve
  const totalPixels = Object.values(pixelPool).reduce((acc, v) => acc + (v ?? 0n), 0n);

  return (
    <div className="generator-sidebar">
      <h2>Everything is Pixel</h2>

      {SECTIONS.map((section) => (
        <div key={section.id} style={{ marginBottom: 10 }}>
          <div className="sidebar-section-label">{section.label}</div>
          <ul className="generator-list">
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;

              let subtitle: string | null = null;
              let extraLine: string | null = null;

              if (item.id === "factory") {
                subtitle = factorySubtitle;
                extraLine = `Stock : ${formatPixelAmount(factoryStock)} px`;
              } else if (item.id === "grinder") {
                subtitle = item.kind === "manual" ? "Manuel" : "Générateur";
                extraLine = `Stock : ${formatPixelAmount(grinderStock)} px`;
              } else if (item.id === "pool") {
                subtitle = "Vue globale";
                extraLine = `Total : ${formatPixelAmount(totalPixels)} px`;
              }

              return (
                <li
                  key={item.id}
                  className={`generator-card ${isActive ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="generator-card-header">
                    <strong>{item.label}</strong>
                    {item.kind && (
                      <span className="generator-kind">
                        {item.kind === "passive"
                          ? "Passif"
                          : item.kind === "manual"
                          ? "Manuel"
                          : "Système"}
                      </span>
                    )}
                  </div>
                  <div className="generator-card-body">
                    {subtitle && <div className="generator-rate">{subtitle}</div>}
                    {extraLine && (
                      <div className="generator-stock">{extraLine}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}