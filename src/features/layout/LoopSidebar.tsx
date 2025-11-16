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

export function LoopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const factory = useGameStore((s) => s.factory);
  const grinder = useGameStore((s) => s.grinder);
  const pixelPool = useGameStore((s) => s.pixelPool);

  // Infos calculées pour affichage “live”
  const factoryColorId = getFactoryPrimaryColorId(factory);
  const factoryRate = getFactoryCurrentRatePerSecond(factory);
  const factoryStock = pixelPool[factoryColorId] ?? 0n;

  const grinderColorId = getGrinderMainColor(grinder);
  const grinderStock = pixelPool[grinderColorId] ?? 0n;

  const totalPixels =
    Object.values(pixelPool).reduce((acc, v) => acc + (v ?? 0n), 0n);

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
                subtitle = `${factoryRate.toFixed(1)} px/s`;
                extraLine = `Stock : ${formatPixelAmount(factoryStock)} px`;
              } else if (item.id === "grinder") {
                subtitle = item.kind === "manual" ? "Manuel" : "Générateur";
                extraLine = `Stock : ${formatPixelAmount(grinderStock)} px`;
              } else if (item.id === "pool") {
                subtitle = "Vue globale";
                extraLine = `Total : ${formatPixelAmount(totalPixels)} px`;
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
