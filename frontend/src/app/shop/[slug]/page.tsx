"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductImagePanel from "@/components/shop/ProductImagePanel";
import VariantSelector from "@/components/shop/VariantSelector";
import { api } from "@/lib/api";
import { Product, ProductVariant } from "@/lib/types";
import { formatNaira } from "@/lib/format";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct]           = useState<Product | null>(null);
  const [selected, setSelected]         = useState<ProductVariant | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api
      .get<Product>(`/products/${slug}/`)
      .then(data => {
        setProduct(data);
        // Auto-select first in-stock variant
        const firstInStock = data.variants?.find(v => v.in_stock) ?? data.variants?.[0] ?? null;
        setSelected(firstInStock);
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [slug]);

  const displayPrice = selected
    ? formatNaira(selected.effective_price_ngn)
    : product
    ? formatNaira(product.retail_price_ngn)
    : null;

  const isInStock = selected ? selected.in_stock : false;

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: "4.5rem", backgroundColor: "#000000", minHeight: "100vh" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
              <div style={{ aspectRatio: "3/4", backgroundColor: "#1A1A1A" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
                {[70, 50, 90, 40].map(w => (
                  <div key={w} style={{ height: "1rem", width: `${w}%`, backgroundColor: "#1A1A1A", borderRadius: "2px" }} />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: "4.5rem", backgroundColor: "#000000", minHeight: "100vh" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "#C9A84C", marginBottom: "1rem" }}>
              Product not found
            </p>
            <Link href="/shop" className="btn-outline" style={{ fontSize: "0.85rem" }}>
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isRTW = product.product_type === "ready_to_wear";

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "4.5rem", backgroundColor: "#000000", minHeight: "100vh" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "2.5rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <Link
              href={isRTW ? "/shop" : "/materials"}
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
            >
              {isRTW ? "Shop" : "Materials"}
            </Link>
            <span>/</span>
            <span style={{ color: "#C9A84C" }}>{product.name}</span>
          </nav>

          {/* Two-column layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
              gap: "3.5rem",
              alignItems: "start",
            }}
          >
            {/* Left — image */}
            <ProductImagePanel
              productName={product.name}
              category={product.category}
              selectedVariant={selected}
            />

            {/* Right — product info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Category + SKU */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    color: "#C9A84C",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.category}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  {product.sku}
                </span>
              </div>

              {/* Product name */}
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2rem",
                    fontWeight: 500,
                    color: "#C9A84C",
                  }}
                >
                  {displayPrice}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  per {product.unit_label}
                </span>
                {product.has_wholesale && product.wholesale_price_ngn && product.wholesale_min_qty && (
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.4)",
                      paddingLeft: "0.5rem",
                      borderLeft: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {formatNaira(product.wholesale_price_ngn)} × {product.wholesale_min_qty}+ wholesale
                  </span>
                )}
              </div>

              {/* Gold divider */}
              <div style={{ height: "1px", backgroundColor: "rgba(201,168,76,0.15)" }} />

              {/* Description */}
              {product.description && (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.75,
                    maxWidth: "52ch",
                  }}
                >
                  {product.description}
                </p>
              )}

              {/* Variant selector */}
              {product.variants && product.variants.length > 0 && (
                <VariantSelector
                  variants={product.variants}
                  selected={selected}
                  onSelect={setSelected}
                />
              )}

              {/* Stock status */}
              {selected && (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.78rem",
                    color: isInStock ? "rgba(201,168,76,0.8)" : "rgba(123,28,46,0.9)",
                  }}
                >
                  {isInStock
                    ? `${selected.stock_quantity} in stock`
                    : "Out of stock"}
                </p>
              )}

              {/* Gold divider */}
              <div style={{ height: "1px", backgroundColor: "rgba(201,168,76,0.15)" }} />

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  disabled={!isInStock}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    padding: "0.9rem 1.75rem",
                    backgroundColor: isInStock ? "#C9A84C" : "#333",
                    color: isInStock ? "#000000" : "rgba(255,255,255,0.3)",
                    border: "none",
                    cursor: isInStock ? "pointer" : "not-allowed",
                    letterSpacing: "0.03em",
                    transition: "background-color 0.2s ease",
                    width: "100%",
                  }}
                  onMouseEnter={e => {
                    if (isInStock) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E8C97A";
                  }}
                  onMouseLeave={e => {
                    if (isInStock) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C";
                  }}
                >
                  {isInStock ? "Add to Cart" : "Out of Stock"}
                </button>

                <a
                  href={`https://wa.me/234XXXXXXXXXX?text=Hello%20Shebash%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ textAlign: "center", fontSize: "0.85rem" }}
                >
                  Order via WhatsApp
                </a>
              </div>

              {/* Weight note */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                Approx. weight: {product.weight_grams}g · Shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}