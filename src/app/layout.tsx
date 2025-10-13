import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Providers from "./providers";
import "../styles/globals.css";
import "../styles/responsive.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sustraxmx-API - Sustainable API Solutions",
  description:
    "Advanced API testing and monitoring platform for sustainable development",
  keywords: ["API", "testing", "monitoring", "sustainability", "emissions"],
  authors: [{ name: "Sustraxmx-API Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Sustraxmx-API - Sustainable API Solutions",
    description:
      "Advanced API testing and monitoring platform for sustainable development",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sustraxmx-API - Sustainable API Solutions",
    description:
      "Advanced API testing and monitoring platform for sustainable development",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W3YR0ZRVYP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W3YR0ZRVYP');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
