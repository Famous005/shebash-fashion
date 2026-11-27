import { ProductVariant } from "@/lib/types";

interface ProductImagePanelProps {
  productName: string;
  category: string;
  selectedVariant: ProductVariant | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Dresses":        "#1A2E28",
  "Two-Piece Sets": "#1E1A2E",
  "Occasion Wear":  "#2E221A",
  "Fabrics":        "#1A1E2E",
  "Stones & Beads": "#2E1A1E",
  "Haberdashery":   "#1E2E1A",
};

export default function ProductImagePanel({
  productName,
  category,
  selectedVariant,
}: ProductImagePanelProps) {
  const bgColor = selectedVariant?.color_hex
    ? `${selectedVariant.color_hex}22`
    : (CATEGORY_COLORS[category] ?? "#1A1A1A");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Main image */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3/4",
          backgroundColor: bgColor,
          border: "1px solid rgba(201,168,76,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          position: "relative",
          transition: "background-color 0.3s ease",
        }}
      >
        {/* Product initial */}
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "5rem",
            fontWeight: 500,
            color: selectedVariant?.color_hex
              ? `${selectedVariant.color_hex}99`
              : "rgba(201,168,76,0.25)",
            userSelect: "none",
            transition: "color 0.3s ease",
          }}
        >
          {productName.charAt(0)}
        </span>

        {selectedVariant?.color_name && (
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.08em",
            }}
          >
            {selectedVariant.color_name}
          </span>
        )}

        {/* "No image yet" label */}
        <span
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.06em",
          }}
        >
          Photo coming soon
        </span>
      </div>
    </div>
  );
}