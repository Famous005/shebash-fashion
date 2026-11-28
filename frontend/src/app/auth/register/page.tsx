"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FormInput from "@/components/ui/FormInput";
import { useAuth } from "@/context/AuthContext";

type FieldErrors = Record<string, string[]>;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName,        setFullName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors,          setErrors]          = useState<FieldErrors>({});
  const [general,         setGeneral]         = useState<string | null>(null);
  const [loading,         setLoading]         = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneral(null);

    // Client-side password match check
    if (password !== passwordConfirm) {
      setErrors({ password_confirm: ["Passwords do not match."] });
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name:        fullName,
        email,
        password,
        password_confirm: passwordConfirm,
        ...(phone ? { phone_e164: phone } : {}),
      });
      router.push("/");
    } catch (err) {
      const e = err as FieldErrors;
      if (typeof e === "object" && !e.detail) {
        setErrors(e);
      } else {
        setGeneral("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          backgroundColor: "#000000",
          minHeight:       "100vh",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          padding:         "6rem 1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "28rem" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <span className="gold-rule" style={{ margin: "0 auto 1.25rem" }} />
            <h1
              className="font-serif"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 500, color: "#FFFFFF" }}
            >
              Create Account
            </h1>
            <p
              className="font-sans"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "0.5rem" }}
            >
              Join Shebash Fashion Design
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {general && (
              <div
                style={{
                  padding:         "0.75rem 1rem",
                  backgroundColor: "rgba(123,28,46,0.15)",
                  border:          "1px solid rgba(123,28,46,0.4)",
                  fontFamily:      "var(--font-sans)",
                  fontSize:        "0.82rem",
                  color:           "#E8A0A0",
                }}
              >
                {general}
              </div>
            )}

            <FormInput
              label="Full Name"
              id="full_name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              error={errors.full_name?.[0]}
              placeholder="Your full name"
              required
              autoComplete="name"
            />

            <FormInput
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email?.[0]}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <FormInput
              label="WhatsApp / Phone (optional)"
              id="phone_e164"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              error={errors.phone_e164?.[0]}
              placeholder="+2348012345678"
              autoComplete="tel"
            />

            <FormInput
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password?.[0]}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />

            <FormInput
              label="Confirm Password"
              id="password_confirm"
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              error={errors.password_confirm?.[0]}
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
            />

            {/* Password rules hint */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize:   "0.72rem",
                color:      "rgba(255,255,255,0.3)",
                lineHeight: 1.6,
              }}
            >
              Password must be at least 8 characters and not too common.
            </p>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop:       "0.25rem",
                width:           "100%",
                padding:         "0.85rem",
                backgroundColor: loading ? "#8A6B28" : "#C9A84C",
                color:           "#000000",
                fontFamily:      "var(--font-sans)",
                fontWeight:      500,
                fontSize:        "0.9rem",
                border:          "none",
                cursor:          loading ? "not-allowed" : "pointer",
                letterSpacing:   "0.03em",
                transition:      "background-color 0.2s ease",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer link */}
          <div
            style={{
              marginTop:  "1.75rem",
              textAlign:  "center",
              fontFamily: "var(--font-sans)",
              fontSize:   "0.82rem",
              color:      "rgba(255,255,255,0.4)",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              style={{ color: "#C9A84C", textDecoration: "none" }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}