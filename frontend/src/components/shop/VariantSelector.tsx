"use client";

import { ProductVariant } from "@/lib/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) {
  const hasColors = variants.some(v => v.color_hex !== null);
  const hasSizes  = variants.some(v => v.size_label !== null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Color swatches */}
      {hasColors && (
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.6rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Colour{selected?.color_name ? ` — ${selected.color_name}` : ""}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {variants.map(variant => {
              const isSelected = selected?.id === variant.id;
              const isOOS = !variant.in_stock;
              return (
                <button
                  key={variant.id}
                  onClick={() => !isOOS && onSelect(variant)}
                  disabled={isOOS}
                  title={`${variant.color_name}${isOOS ? " — Out of stock" : ""}`}
                  aria-label={variant.color_name ?? "colour"}
                  aria-pressed={isSelected}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    backgroundColor: variant.color_hex ?? "#555",
                    border: isSelected
                      ? "2px solid #C9A84C"
                      : "2px solid transparent",
                    outline: isSelected ? "2px solid #C9A84C" : "none",
                    outlineOffset: "2px",
                    cursor: isOOS ? "not-allowed" : "pointer",
                    opacity: isOOS ? 0.35 : 1,
                    transition: "border-color 0.15s ease, outline 0.15s ease",
                    padding: 0,
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {/* Strikethrough for OOS */}
                  {isOOS && (
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "1rem",
                        pointerEvents: "none",
                      }}
                    >
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size pills */}
      {hasSizes && (
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.6rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Size / Grade
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {variants.map(variant => {
              const isSelected = selected?.id === variant.id;
              const isOOS = !variant.in_stock;
              return (
                <button
                  key={variant.id}
                  onClick={() => !isOOS && onSelect(variant)}
                  disabled={isOOS}
                  aria-pressed={isSelected}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.78rem",
                    padding: "0.35rem 0.9rem",
                    border: `1px solid ${isSelected ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
                    backgroundColor: isSelected ? "#C9A84C" : "transparent",
                    color: isSelected ? "#000000" : isOOS ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.75)",
                    cursor: isOOS ? "not-allowed" : "pointer",
                    textDecoration: isOOS ? "line-through" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {variant.size_label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}