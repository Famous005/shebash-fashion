"use client";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "2rem",
      }}
    >
      {["All", ...categories].map(cat => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              padding: "0.4rem 1rem",
              border: `1px solid ${isActive ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
              backgroundColor: isActive ? "#C9A84C" : "transparent",
              color: isActive ? "#000000" : "rgba(255,255,255,0.7)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              letterSpacing: "0.03em",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}