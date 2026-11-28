import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Shebash Fashion Design — Bespoke Ladies' Tailoring, Bida Niger State",
    template: "%s | Shebash Fashion Design",
  },
  description:
    "Custom bespoke sewing, cloth stoning, beadwork embellishment, and tailoring materials in Bida, Niger State. Serving Nigeria and international clients worldwide.",
  keywords: [
    "fashion designer Bida Niger State",
    "bespoke ladies tailor Bida",
    "cloth stoning beading Niger State",
    "tailoring materials shop Bida",
    "Nigerian luxury ladies wear",
    "aso-ebi tailor Minna Abuja",
    "custom African lace gowns Nigeria",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Shebash Fashion Design",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}