export default function BrandStorySection() {
  return (
    <section style={{ backgroundColor: "var(--color-off-white)", padding: "6rem 0" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 26rem), 1fr))",
            gap: "3rem",
            alignItems: "stretch",
          }}
        >
          {/* Text — left */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "1rem 0" }}>
            <span className="gold-rule" style={{ marginBottom: "1.5rem" }} />
            <h2
              className="font-serif font-medium"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                lineHeight: "1.1",
                color: "#000000",
                marginBottom: "1.5rem",
              }}
            >
              Born in Bida.
              <br />
              Worn with Pride.
            </h2>
            <p
              className="font-sans"
              style={{
                color: "rgba(0,0,0,0.7)",
                fontSize: "1rem",
                lineHeight: "1.75",
                marginBottom: "1.25rem",
                maxWidth: "58ch",
              }}
            >
              Bida, Niger State has been a city of craftspeople for centuries — known
              across West Africa for brass work, glass beading, and textile artistry.
              Shebash Fashion Design carries that tradition forward in every stitch,
              every stone, and every gown that leaves our workshop.
            </p>
            <p
              className="font-sans"
              style={{
                color: "rgba(0,0,0,0.7)",
                fontSize: "1rem",
                lineHeight: "1.75",
                maxWidth: "58ch",
              }}
            >
              Whether you are dressing for your wedding day in Abuja, ordering an
              aso-ebi set from London, or restocking your studio with tailoring
              materials here in Bida — you get the same standard: clean inner
              finishing, true-to-measurement fit, and embellishment that lasts.
            </p>
          </div>

          {/* Stats panel — right */}
          <div
            style={{
              backgroundColor: "#000000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2rem",
              padding: "2.5rem",
              minHeight: "320px",
            }}
          >
            {[
              { figure: "500+", label: "Outfits completed" },
              { figure: "7",    label: "Delivery zones across Nigeria and beyond" },
              { figure: "3",    label: "Services in one checkout" },
            ].map(({ figure, label }) => (
              <div
                key={label}
                style={{
                  borderLeft: "2px solid #C9A84C",
                  paddingLeft: "1.25rem",
                }}
              >
                <p
                  className="font-serif font-medium"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#C9A84C" }}
                >
                  {figure}
                </p>
                <p
                  className="font-sans"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginTop: "0.25rem" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}