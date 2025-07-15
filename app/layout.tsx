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
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import AnalyticsProvider from "./components/AnalyticsProvider";
import PerformanceMonitor from "./components/PerformanceMonitor";

export const metadata: Metadata = {
  title: "Guhuza's Brain Boost",
  description: "Level Up Your Job Search with Guhuza's Brain Boost",
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Guhuza Quiz',
  },
  formatDetection: {
    telephone: false,
  },
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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Guhuza Quiz" />
      </head>
      <body>
        <NextTopLoader />
        <SessionProvider session={session}>
          <AnalyticsProvider>
            <ObserverProvider>
              <PlayerContextProvider>
                <BadgeProvider>
                  <Navbar />
                  {children}
                  <Footer />
                  <PWAInstallPrompt />
                  <PerformanceMonitor />
                </BadgeProvider>
              </PlayerContextProvider>
            </ObserverProvider>
          </AnalyticsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
