"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import { api } from "@/lib/api";
import { Product, PaginatedResponse } from "@/lib/types";

export default function MaterialsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PaginatedResponse<Product>>("/products/?type=tailoring_material")
      .then(data => setProducts(data.results))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "4.5rem" }}>
        {/* Page header */}
        <section
          style={{
            backgroundColor: "#000000",
            padding: "4rem 1.5rem 3rem",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <span className="gold-rule" style={{ marginBottom: "1.25rem" }} />
            <h1
              className="font-serif"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                color: "#FFFFFF",
                marginBottom: "0.75rem",
              }}
            >
              Tailoring Materials
            </h1>
            <p
              className="font-sans"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.95rem",
                maxWidth: "52ch",
              }}
            >
              Fabrics, DMC stones, glass beads, zippers, corset boning, and
              threads — retail and wholesale. Shipped across Nigeria.
            </p>

            {/* Wholesale note */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1.25rem",
                padding: "0.4rem 0.9rem",
                backgroundColor: "rgba(123,28,46,0.2)",
                border: "1px solid rgba(123,28,46,0.4)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#7B1C2E",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-sans"
                style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}
              >
                Wholesale pricing available — contact us for bulk orders
              </span>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section
          style={{
            backgroundColor: "#000000",
            padding: "3rem 1.5rem 5rem",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              showCategoryFilter={true}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}