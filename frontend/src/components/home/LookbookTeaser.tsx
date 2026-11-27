import Link from "next/link";

// Placeholder items — will be replaced with real API data in the Lookbook session
const teaserItems = [
  { id: 1, title: "Bridal Couture",        tag: "Bespoke Sewing"  },
  { id: 2, title: "Crystal Stoned Boubou", tag: "Cloth Stoning"   },
  { id: 3, title: "Luxury Bead Applique",  tag: "Beadwork"        },
];

export default function LookbookTeaser() {
  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="gold-rule mb-5" />
            <h2 className="font-serif font-medium text-display-lg text-white">
              Recent Work
            </h2>
          </div>
          <Link href="/lookbook" className="btn-outline text-sm shrink-0">
            Full Lookbook
          </Link>
        </div>

        {/* 3-image horizontal strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teaserItems.map((item) => (
            <div key={item.id} className="group">
              {/* Image placeholder — replaced with Next.js <Image> from API in lookbook session */}
              <div
                className="w-full aspect-3/4 bg-charcoal border border-gold/10 flex items-end p-4"
                aria-label={item.title}
              >
                <div>
                  <p className="text-gold text-xs font-sans mb-1">{item.tag}</p>
                  <p className="text-white font-serif text-lg font-medium">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}