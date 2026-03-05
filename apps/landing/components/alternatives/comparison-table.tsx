import type { Competitor } from "@/lib/competitors";

interface ComparisonTableProps {
  features: Competitor["features"];
  competitorName: string;
}

function isPropslyHighlight(value: string): boolean {
  return value === "Free" || value === "Yes" || value === "AGPL-3.0";
}

function isCompetitorNegative(value: string): boolean {
  return value === "No";
}

export function ComparisonTable({ features, competitorName }: ComparisonTableProps) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
      {/* Header row */}
      <div
        className="grid grid-cols-3 px-4 py-3 text-sm font-medium"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div style={{ color: "var(--text-secondary)" }}>Feature</div>
        <div style={{ color: "var(--text-secondary)" }}>{competitorName}</div>
        <div style={{ color: "var(--accent)" }}>Propsly</div>
      </div>

      {/* Data rows */}
      {features.map((feature, index) => (
        <div
          key={feature.name}
          className="grid grid-cols-3 px-4 py-3 text-sm"
          style={{
            backgroundColor: index % 2 === 0 ? "transparent" : "var(--bg-surface)",
            borderBottom:
              index < features.length - 1
                ? "1px solid var(--border-default)"
                : undefined,
          }}
        >
          <div style={{ color: "var(--text-primary)" }}>{feature.name}</div>
          <div
            style={{
              color: isCompetitorNegative(feature.competitor)
                ? "var(--text-tertiary)"
                : "var(--text-secondary)",
            }}
          >
            {feature.competitor}
          </div>
          <div
            style={{
              color: isPropslyHighlight(feature.propsly)
                ? "var(--accent)"
                : "var(--text-primary)",
              fontWeight: isPropslyHighlight(feature.propsly) ? 500 : undefined,
            }}
          >
            {feature.propsly}
          </div>
        </div>
      ))}
    </div>
  );
}
