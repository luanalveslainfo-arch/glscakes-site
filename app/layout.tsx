import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "glscakes.pages.dev";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Glscakes — Confeitaria artesanal",
    description: "Monte seu pedido de bentô cake, bolo personalizado, kit festa ou docinhos e envie pelo WhatsApp.",
    icons: { icon: "/glscakes/logo.png", apple: "/glscakes/logo.png" },
    openGraph: {
      title: "Glscakes — Confeitaria artesanal",
      description: "Doces momentos, feitos para você. Monte sua encomenda pelo cardápio interativo.",
      url: origin,
      siteName: "Glscakes",
      locale: "pt_BR",
      type: "website",
      images: [{ url: `${origin}/og-card.png`, width: 1200, height: 630, alt: "Glscakes — Confeitaria artesanal" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Glscakes — Confeitaria artesanal",
      description: "Bentôs, bolos personalizados, kits festa e docinhos.",
      images: [`${origin}/og-card.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
