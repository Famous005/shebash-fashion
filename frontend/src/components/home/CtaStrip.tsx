export default function CtaStrip() {
  return (
    <section id="contact" className="bg-black border-t border-b border-gold/20 py-16 px-6 text-center">
      <div className="max-w-content mx-auto">
        <h2 className="font-serif font-medium text-display-lg text-white mb-4">
          Ready to order?
        </h2>
        <p className="font-sans text-white/60 text-base mb-8 max-w-prose mx-auto">
          Send us a WhatsApp message and we will guide you from measurement to delivery.
        </p>
        <a
          href="https://wa.me/2348061362600?text=Hello%20Shebash%2C%20I%27d%20like%20to%20place%20an%20order"
          className="btn-gold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Message Us on WhatsApp
        </a>
        <p className="mt-5 text-white/30 text-xs font-sans">
          Monday – Saturday, 8:30 AM – 6:30 PM (WAT) · Bida, Niger State
        </p>
      </div>
    </section>
  );
}