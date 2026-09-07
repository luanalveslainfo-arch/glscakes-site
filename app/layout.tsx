import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "hometreats.local";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Home Treats by Narmatha — Custom Cakes & Handcrafted Desserts",
    description: "Handcrafted custom cakes, cupcakes, dessert stations, brownies and treats for birthdays, weddings, baby showers and milestone celebrations in Frisco, TX & surrounding areas.",
    icons: { icon: "/hometreats/logo.png", apple: "/hometreats/logo.png" },
    openGraph: {
      title: "Home Treats by Narmatha — Custom Cakes & Handcrafted Desserts",
      description: "Custom cakes for every occasion. Made fresh, made with love, fully customizable in Frisco, TX. Build your order through our interactive menu.",
      url: origin,
      siteName: "Home Treats by Narmatha",
      locale: "en_US",
      type: "website",
      images: [{ url: `${origin}/hometreats/logo.png`, width: 800, height: 800, alt: "Home Treats by Narmatha Logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Home Treats by Narmatha — Custom Cakes & Handcrafted Desserts",
      description: "Custom cakes, cupcakes, cakesicles, brownies and dessert stations.",
      images: [`${origin}/hometreats/logo.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
