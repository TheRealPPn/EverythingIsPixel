import { useFakeGrinder } from "@/features/grinder/grinderLogic";

export function GrinderView() {
  const { grindPlaceholderImage } = useFakeGrinder();

  return (
    <div className="grinder-panel">
      <h2>Broyeuse</h2>
      <button onClick={grindPlaceholderImage}>
        Broyez une image factice
      </button>
    </div>
  );
}