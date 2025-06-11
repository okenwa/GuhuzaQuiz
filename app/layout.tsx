import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { auth } from "@/auth";
import Navbar from "@/app/components/navbar";
import ObserverProvider from "./components/ObserverPovider";
import Footer from "./components/footer";
import NextTopLoader from "nextjs-toploader";
import PlayerContextProvider from "./context/playerContext";
import { BadgeProvider } from './context/badgeContext';

export const metadata: Metadata = {
  title: "Guhuza's Brain Boost",
  description: "Level Up Your Job Search with Guhuza's Brain Boost",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()

  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Guhuza Quiz Progress" />
        <meta property="og:description" content="I just completed a level on Guhuza Quiz App! Can you beat my score?" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Guhuza Quiz Progress" />
        <meta name="twitter:description" content="I just completed a level on Guhuza Quiz App! Can you beat my score?" />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
      </head>
      <body>
        <NextTopLoader />
        <SessionProvider session={session}>
        <ObserverProvider>
          <PlayerContextProvider>
            <BadgeProvider>
              <Navbar />
              {children}
              <Footer />
            </BadgeProvider>
          </PlayerContextProvider>
        </ObserverProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
