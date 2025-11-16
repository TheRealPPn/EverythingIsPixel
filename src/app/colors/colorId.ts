export type ColorId = `COLOR_${string}`;

function clampByte(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 255) return 255;
  return Math.floor(n);
}

function pad3(n: number): string {
  return clampByte(n).toString().padStart(3, "0");
}

// 1) Construit un ColorId à partir d'un RGB (0–255)
export function colorIdFromRGB(r: number, g: number, b: number): ColorId {
  const rr = pad3(r);
  const gg = pad3(g);
  const bb = pad3(b);
  return `COLOR_${rr}${gg}${bb}` as ColorId;
}

// 2) Parse → { r, g, b } si format OK
export function parseColorId(id: string): { r: number; g: number; b: number } | null {
  if (!id.startsWith("COLOR_")) return null;
  const payload = id.slice("COLOR_".length);
  if (payload.length !== 9) return null;

  const r = Number(payload.slice(0, 3));
  const g = Number(payload.slice(3, 6));
  const b = Number(payload.slice(6, 9));

  if (
    Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ||
    r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255
  ) {
    return null;
  }

  return { r, g, b };
}

// 3) Conversion vers 0xRRGGBB pour Pixi
export function colorIdToPixiHex(id: string): number {
  const parsed = parseColorId(id);
  if (!parsed) return 0x000000;

  const { r, g, b } = parsed;
  return (r << 16) | (g << 8) | b;
}
