export default function ProductCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        borderTop: "2px solid #2A2A2A",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3",
          backgroundColor: "#242424",
        }}
      />
      {/* Category */}
      <div style={{ width: "35%", height: "0.65rem", backgroundColor: "#2A2A2A", borderRadius: "2px" }} />
      {/* Name */}
      <div style={{ width: "80%", height: "1rem", backgroundColor: "#2A2A2A", borderRadius: "2px" }} />
      <div style={{ width: "55%", height: "1rem", backgroundColor: "#2A2A2A", borderRadius: "2px" }} />
      {/* Price */}
      <div style={{ width: "40%", height: "1.25rem", backgroundColor: "#2A2A2A", borderRadius: "2px", marginTop: "0.25rem" }} />
    </div>
  );
}