import Link from "next/link";
import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/format";

// Colour per category for image placeholder
const CATEGORY_COLORS: Record<string, string> = {
  "Dresses":        "#2C4A3E",
  "Two-Piece Sets": "#3A2C4A",
  "Occasion Wear":  "#4A3A2C",
  "Fabrics":        "#2C3A4A",
  "Stones & Beads": "#4A2C3A",
  "Haberdashery":   "#3A4A2C",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#2A2A2A";
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = formatNaira(product.retail_price_ngn);
  const wholesalePrice = product.wholesale_price_ngn
    ? formatNaira(product.wholesale_price_ngn)
    : null;

  return (
    <Link
      href={`/shop/${product.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      aria-label={`View ${product.name}`}
    >
      <article
        style={{
          backgroundColor: "#1A1A1A",
          borderTop: "2px solid #C9A84C",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          transition: "border-color 0.2s ease",
          cursor: "pointer",
          height: "100%",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderTopColor = "#E8C97A";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderTopColor = "#C9A84C";
        }}
      >
        {/* Image placeholder — replaced with real images in lookbook session */}
        <div
          style={{
            width: "100%",
            aspectRatio: "4/3",
            backgroundColor: getCategoryColor(product.category),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Product initial as visual */}
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "3rem",
              fontWeight: 500,
              color: "rgba(201,168,76,0.4)",
              userSelect: "none",
            }}
          >
            {product.name.charAt(0)}
          </span>

          {/* Wholesale badge */}
          {product.has_wholesale && (
            <span
              style={{
                position: "absolute",
                top: "0.75rem",
                left: "0.75rem",
                backgroundColor: "#7B1C2E",
                color: "#FFFFFF",
                fontFamily: "var(--font-sans)",
                fontSize: "0.65rem",
                fontWeight: 500,
                padding: "0.2rem 0.5rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Wholesale
            </span>
          )}

          {/* Stock count badge */}
          <span
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: product.in_stock_count > 0 ? "#C9A84C" : "#888",
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              padding: "0.2rem 0.5rem",
            }}
          >
            {product.in_stock_count > 0
              ? `${product.in_stock_count} variant${product.in_stock_count > 1 ? "s" : ""}`
              : "Out of stock"}
          </span>
        </div>

        {/* Card body */}
        <div style={{ padding: "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              color: "#C9A84C",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {product.category}
          </p>

          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#FFFFFF",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.45)",
              marginTop: "0.1rem",
            }}
          >
            per {product.unit_label}
          </p>

          {/* Price row */}
          <div style={{ marginTop: "auto", paddingTop: "0.75rem", display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.3rem",
                fontWeight: 500,
                color: "#C9A84C",
              }}
            >
              {price}
            </span>
            {wholesalePrice && product.wholesale_min_qty && (
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {wholesalePrice} × {product.wholesale_min_qty}+
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}