"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import CategoryFilter from "./CategoryFilter";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  showCategoryFilter?: boolean;
}

export default function ProductGrid({
  products,
  loading,
  error,
  showCategoryFilter = true,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory),
    [products, activeCategory]
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 15rem), 1fr))",
    gap: "1px",
    backgroundColor: "rgba(201,168,76,0.08)",
  };

  if (error) {
    return (
      <div
        style={{
          border: "1px solid rgba(123,28,46,0.4)",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "rgba(123,28,46,0.08)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            color: "#E8C97A",
            marginBottom: "0.5rem",
            fontWeight: 500,
          }}
        >
          Could not load products
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Check that the backend is running at{" "}
          <code style={{ color: "#C9A84C" }}>
            {process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"}
          </code>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {showCategoryFilter && categories.length > 1 && (
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      )}

      {filtered.length === 0 ? (
        <div style={{ padding: "4rem 0", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
            }}
          >
            No products in this category yet.
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.3)",
          marginTop: "1.5rem",
          textAlign: "right",
        }}
      >
        {filtered.length} of {products.length} product{products.length !== 1 ? "s" : ""}
      </p>
    </>
  );
}