// Représente un nombre entier arbitrairement grand (pixels) en string lisible.
export function formatPixelAmount(value: bigint): string {
  const absVal = value < 0n ? -value : value;

  // 1) Petit nombre → affichage entier classique
  const billion = 1_000_000_000n;
  if (absVal < billion) {
    return formatWithSeparators(value);
  }

  // 2) Grand nombre → notation scientifique type 1.23e15
  const s = absVal.toString();        // ex: "1234567890000000"
  const len = s.length;               // ex: 16 → exponent = 15
  const exponent = len - 1;

  // Mantisse = 1.xxx (3 premiers chiffres max)
  const first = s[0];
  const next = s.slice(1, 3) || "0";
  const mantissa = `${first}.${next}`;

  const sign = value < 0n ? "-" : "";
  return `${sign}${mantissa}e${exponent}`;
}

// Affiche un bigint avec séparateurs de milliers (ex: 123 456 789)
function formatWithSeparators(value: bigint): string {
  const isNegative = value < 0n;
  const s = (isNegative ? -value : value).toString();

  let out = "";
  let count = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    out = s[i] + out;
    count++;
    if (count === 3 && i !== 0) {
      out = " " + out;
      count = 0;
    }
  }
  return (isNegative ? "-" : "") + out;
}
