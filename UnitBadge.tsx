import { unitColor, unitName } from "@/lib/format";
import type { UnitSlug } from "@/lib/types";

export default function UnitBadge({ unit }: { unit: UnitSlug | "all" }) {
  return (
    <span className="unit-badge" style={{ ["--c" as string]: unitColor(unit) }}>
      {unitName(unit)}
    </span>
  );
}
