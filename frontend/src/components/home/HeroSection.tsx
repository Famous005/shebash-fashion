import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto" style={{ maxWidth: "48rem" }}>
        <span className="gold-rule mx-auto mb-8" />

        <h1
          className="font-serif font-medium text-white leading-tight mb-6"
          style={{ fontSize: "clamp(3.2rem, 8vw, 6rem)", lineHeight: "1.05" }}
        >
          Dressed in
          <br />
          <span className="text-gold">Craft &amp; Confidence</span>
        </h1>

        <p
          className="font-sans text-white/70 mb-10 leading-relaxed mx-auto"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "52ch" }}
        >
          Bespoke ladies&apos; tailoring, hand embellishment, and tailoring supplies —
          made with intention in Bida, Niger State.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/book/sewing" className="btn-gold">
            Book Your Custom Outfit
          </Link>
          <Link href="/lookbook" className="btn-outline">
            View Lookbook
          </Link>
        </div>

        <span className="gold-rule mx-auto mt-10" />
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs font-sans">
        <span>Scroll</span>
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="6" cy="6" r="2" fill="currentColor">
            <animate attributeName="cy" values="6;12;6" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
}