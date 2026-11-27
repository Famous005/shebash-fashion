import CopyrightYear from "@/components/layout/CopyrightYear";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Services: [
    { label: "Bespoke Sewing",   href: "/book/sewing"   },
    { label: "Cloth Stoning",    href: "/book/stoning"  },
    { label: "Beadwork",         href: "/book/beadwork" },
    { label: "Ready-to-Wear",    href: "/shop"          },
    { label: "Materials Store",  href: "/materials"     },
  ],
  Explore: [
    { label: "Lookbook",         href: "/lookbook"      },
    { label: "Size Guide",       href: "/size-guide"    },
    { label: "Track Order",      href: "/orders"        },
    { label: "My Account",       href: "/account"       },
  ],
};

export default function Footer() {
 
  return (
    <footer className="bg-charcoal border-t border-gold/20">
      <div className="max-w-content mx-auto px-6 pt-14 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand col */}
          <div>
            <Image
              src="/images/logo.jpeg"
              alt="Shebash Fashion Design"
              width={64}
              height={64}
              className="rounded-full object-cover mb-4"
            />
            <p className="text-white/60 text-sm max-w-prose leading-relaxed">
              Bespoke ladies &apos; tailoring, embellishment, and tailoring supplies.
              Crafted with care in Bida, Niger State.
            </p>
            <a
              href="https://wa.me/2348061362600"
              className="inline-flex items-center gap-2 mt-5 text-gold text-sm font-medium hover:text-gold-light transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.527 5.84L0 24l6.335-1.498A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.001-1.373l-.36-.214-3.724.879.938-3.613-.234-.372A9.783 9.783 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
      </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-gold text-sm font-sans font-medium mb-4">{heading}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Gold divider */}
        <div className="h-px bg-gold/20 mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-white/40 text-xs font-sans">
          <p>© <CopyrightYear /> Shebash Fashion Design. Bida, Niger State, Nigeria.</p>
          <p>Crafted with pride in Nigeria</p>
        </div>
      </div>
    </footer>
  );
}