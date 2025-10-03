import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Providers from "./providers";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SustraxAPI - Sustainable API Solutions",
  description:
    "Advanced API testing and monitoring platform for sustainable development",
  keywords: ["API", "testing", "monitoring", "sustainability", "emissions"],
  authors: [{ name: "SustraxAPI Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "SustraxmxAPI - Sustainable API Solutions",
    description:
      "Advanced API testing and monitoring platform for sustainable development",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SustraxmxAPI - Sustainable API Solutions",
    description:
      "Advanced API testing and monitoring platform for sustainable development",
  },
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
