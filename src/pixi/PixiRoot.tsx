import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export function PixiRoot() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let destroyed = false;

    const setup = async () => {
      if (!containerRef.current) return;

      const app = new Application();

      await app.init({
        resizeTo: containerRef.current,
        background: 0x000000,
        antialias: false,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      appRef.current = app;

      // ⬅️ En Pixi v8, c’est app.canvas (plus app.view)
      containerRef.current.appendChild(app.canvas);

      // Petit test visuel : un carré blanc
      const gfx = new Graphics();
      gfx.rect(0, 0, 50, 50).fill(0xffffff);
      app.stage.addChild(gfx);
    };

    setup();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  return <div style={{ width: "100%", height: "100%" }} ref={containerRef} />;
}
