import { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { updateWorld } from "@/app/ecs/systems";
import { useGameStore } from "@/app/store/gameStore";
import { PixiRoot } from "@/pixi/PixiRoot";
import { LoopSidebar } from "@/features/layout/LoopSidebar";
import { PixelFactoryPage } from "@/features/factory/PixelFactoryPage";
import { GrinderPage } from "@/features/grinder/GrinderPage";
import { PixelPoolPage } from "@/features/pixelPool/PixelPoolPage";

if (import.meta.env.DEV) {
  // @ts-ignore
  window.useGameStore = useGameStore;
}

export function App() {
  const incrementTick = useGameStore((s) => s.incrementTick);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    let frameId: number;

    const loop = (time: number) => {
      if (lastTime.current == null) lastTime.current = time;
      const dt = (time - lastTime.current) / 1000;
      lastTime.current = time;

      const { isLoopPaused } = useGameStore.getState();
      if (!isLoopPaused) {
        updateWorld(dt);
        incrementTick();
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [incrementTick]);

  return (
    <div className="app-root">
      <PixiRoot />

      <div className="ui-overlay">
        <LoopSidebar />
        <div className="page-area">
          <Routes>
            <Route path="/" element={<Navigate to="/factory" replace />} />
            <Route path="/factory" element={<PixelFactoryPage />} />
            <Route path="/grinder" element={<GrinderPage />} />
            <Route path="/pool" element={<PixelPoolPage />} />
            <Route
              path="*"
              element={
                <div>
                  <p>Page inconnue, retour à l’usine.</p>
                  <PixelFactoryPage />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
