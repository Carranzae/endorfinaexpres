import type { Metadata } from "next";
import { Oswald, Poppins } from "next/font/google";
import "./globals.css";
import CookieConsentModal from "@/components/CookieConsentModal";

// Optimize font loading
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

export const metadata: Metadata = {
  title: "Endorfina Express – El Sabor que te Hace Feliz | Trujillo",
  description: "Comida peruana auténtica con entrega en tiempo récord. Frente a la UPN, Trujillo.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "https://endorfinaexpres.com"),
  openGraph: {
    title: "Endorfina Express – El Sabor que te Hace Feliz",
    description: "Comida peruana auténtica con entrega en tiempo récord",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${oswald.variable} ${poppins.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,700,0,0"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#1c1c1c" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={poppins.className}>
        {children}
        <CookieConsentModal />
      </body>
    </html>
  );
}
