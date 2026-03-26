import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Kandyan Queen Salon | The Best Beauty Salon in Digana, Kandy",
  description:
    "Looking for the best beauty salon in Digana? Experience luxury haircuts, facials, bridal dressing, and spa services at Kandyan Queen Salon in Digana, Sri Lanka. Book your appointment today.",
  keywords: [
    "salon in Digana",
    "best salon Digana",
    "beauty parlor Digana",
    "bridal dressing Digana",
    "haircuts Digana",
    "facial treatments Rajawella",
    "luxury salon Kandy",
    "Kandyan Queen Salon",
    "beauty salon Sri Lanka",
  ],
  openGraph: {
    title: "Kandyan Queen Salon | The Best Beauty Salon in Digana",
    description: "Experience luxury haircuts, facials, bridal dressing, and spa services at Digana's premier beauty salon.",
    url: "https://kandyanqueen.lk",
    siteName: "Kandyan Queen Salon",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for Local Business
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Kandyan Queen Salon",
    "image": "https://kandyanqueen.lk/logo.jpg",
    "@id": "https://kandyanqueen.lk",
    "url": "https://kandyanqueen.lk",
    "telephone": "+94777433031",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "906/1, New Town, Digana",
      "addressLocality": "Rajawella",
      "addressRegion": "Central Province",
      "postalCode": "20180",
      "addressCountry": "LK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 7.2959382,
      "longitude": 80.7354834
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
