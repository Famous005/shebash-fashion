import Link from "next/link";

type Service = {
  code: string;
  name: string;
  tagline: string;
  detail: string;
  href: string;
  cta: string;
};

const services: Service[] = [
  {
    code:    "01",
    name:    "Bespoke Sewing",
    tagline: "Made to your exact measurements",
    detail:
      "From everyday blouses to bridal gowns — digital measurement forms, style uploads, structured corset finishing, and clear delivery dates.",
    href: "/book/sewing",
    cta:  "Book Custom Outfit",
  },
  {
    code:    "02",
    name:    "Ready-to-Wear",
    tagline: "Luxury styles, shipped fast",
    detail:
      "Curated gowns, Ankara two-piece sets, and occasion dresses available in UK sizes 6–20. Order online, nationwide delivery.",
    href: "/shop",
    cta:  "Shop Now",
  },
  {
    code:    "03",
    name:    "Cloth Stoning",
    tagline: "Crystal embellishment, heat-pressed with precision",
    detail:
      "DMC hotfix rhinestones applied to necklines, sleeves, or full gown coverage. Upload your garment photo and get an instant quote.",
    href: "/book/stoning",
    cta:  "Request Quote",
  },
  {
    code:    "04",
    name:    "Beadwork",
    tagline: "Hand-stitched glass beads and pearl detailing",
    detail:
      "Neckline beading, 3D applique fringes, and full luxury couture beadwork — each piece colour-matched to your fabric.",
    href: "/book/beadwork",
    cta:  "Request Quote",
  },
  {
    code:    "05",
    name:    "Lookbook & Portfolio",
    tagline: "See the craftsmanship before you order",
    detail:
      "Browse completed bespoke gowns, stoning work, and beaded pieces. Share styles directly to WhatsApp or Instagram for reference.",
    href: "/lookbook",
    cta:  "View Lookbook",
  },
  {
    code:    "06",
    name:    "Materials Store",
    tagline: "Retail and wholesale tailoring supplies",
    detail:
      "Fabrics, DMC stones, glass beads, zippers, corset boning, threads — everything a tailor or designer needs, shipped across Nigeria.",
    href: "/materials",
    cta:  "Shop Materials",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-black py-24 px-6">
      <div className="max-w-content mx-auto">
        {/* Section header */}
        <div className="mb-14">
            <span className="gold-rule mb-5" />
            <h2
                className="font-serif font-medium text-white"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: "1.1" }}
            >
                What We Do
            </h2>
            <p
                className="font-sans text-white/60 mt-4"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", maxWidth: "52ch", lineHeight: "1.7" }}
            >
                Six services, one workshop. Walk in from Bida or order from anywhere in the world.
            </p>
        </div>

        {/* Asymmetric grid — not equal 6-card default */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
          {services.map((service) => (
            <article key={service.code} className="service-card group">
              <p className="text-gold-dim font-sans text-xs mb-3">{service.code}</p>
              <h3 className="font-serif font-medium text-display-sm text-white mb-1">
                {service.name}
              </h3>
              <p className="text-gold text-sm font-sans mb-4">{service.tagline}</p>
              <p className="text-white/60 text-sm font-sans leading-relaxed mb-6">
                {service.detail}
              </p>
              <Link
                href={service.href}
                className="btn-outline text-xs"
              >
                {service.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}