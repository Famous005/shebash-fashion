"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FormInput from "@/components/ui/FormInput";
import { useAuth } from "@/context/AuthContext";

type FieldErrors = Record<string, string[]>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loginId,  setLoginId]  = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState<FieldErrors>({});
  const [general,  setGeneral]  = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneral(null);
    setLoading(true);
    try {
      await login({ login_id: loginId, password });
      router.push("/");
    } catch (err) {
      const e = err as FieldErrors;
      if (e.login_id || e.password || e.non_field_errors) {
        setErrors(e);
      } else {
        setGeneral("Login failed. Please check your details and try again.");
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
          paddingTop:      "4.5rem",
          backgroundColor: "#000000",
          minHeight:       "100vh",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          padding:         "6rem 1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "26rem" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <span className="gold-rule" style={{ margin: "0 auto 1.25rem" }} />
            <h1
              className="font-serif"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 500, color: "#FFFFFF" }}
            >
              Welcome Back
            </h1>
            <p
              className="font-sans"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "0.5rem" }}
            >
              Sign in to your Shebash account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
              label="Email or Phone"
              id="login_id"
              type="text"
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              error={errors.login_id?.[0]}
              placeholder="you@example.com or +234..."
              required
              autoComplete="username"
            />

            <FormInput
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password?.[0] ?? errors.non_field_errors?.[0]}
              placeholder="Your password"
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop:       "0.5rem",
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer links */}
          <div
            style={{
              marginTop:  "1.75rem",
              textAlign:  "center",
              fontFamily: "var(--font-sans)",
              fontSize:   "0.82rem",
              color:      "rgba(255,255,255,0.4)",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              style={{ color: "#C9A84C", textDecoration: "none" }}
            >
              Create one
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}