"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Services",  href: "/#services"  },
  { label: "Lookbook",  href: "/lookbook"   },
  { label: "Shop",      href: "/shop"       },
  { label: "Materials", href: "/materials"  },
  { label: "Contact",   href: "/#contact"   },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background-color 0.3s ease, border-color 0.3s ease",
        backgroundColor: scrolled ? "#1B4D2E" : "rgba(27, 77, 46, 0.85)",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.25)" : "1px solid transparent",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4.5rem",
        }}
      >
        {/* Logo + Brand name */}
        <Link
          href="/"
          aria-label="Shebash Fashion Design — Home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/logo.jpeg"
            alt="Shebash Fashion Design"
            width={76}
            height={76}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            priority
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span
              className="font-serif"
              style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "#C9A84C",
                letterSpacing: "0.01em",
              }}
            >
              Shebash
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: "0.6rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Fashion Design
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "2rem" }}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "0.875rem",
                fontFamily: "var(--font-sans)",
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="btn-gold"
            style={{ fontSize: "0.8rem", padding: "0.6rem 1.4rem" }}
          >
            Book Now
          </Link>
          <Link
            href="/auth/login"
            style={{
              fontSize: "0.875rem",
              fontFamily: "var(--font-sans)",
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
          >
            Sign In
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "0.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: "block",
                width: "24px",
                height: "1px",
                backgroundColor: "#C9A84C",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform:
                  i === 0 && menuOpen ? "translateY(6px) rotate(45deg)" :
                  i === 2 && menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav
          style={{
            backgroundColor: "#1B4D2E",
            borderTop: "1px solid rgba(201,168,76,0.2)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
          aria-label="Mobile navigation"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                textDecoration: "none",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="btn-gold"
            style={{ textAlign: "center", marginTop: "0.5rem" }}
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </Link>

          <Link
            href="/auth/register"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              textDecoration: "none",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>
          <Link
            href="/auth/login"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              textDecoration: "none",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
        </nav>
      )}
    </header>
  );
}