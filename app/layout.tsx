import './globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from "next/font/google";
import { Providers } from './providers'
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script'   // ✅ 新增

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'video editor online',
  description: 'A free online video editor that enables you to edit videos directly from your web browser.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col bg-darkSurfacePrimary text-text-primary dark:bg-darkSurfacePrimary dark:text-dark-text-primary font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <head>
          {/* ✅ Google Analytics 脚本 */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-9KT0REZT9Q`} // 替换成你的 GA4 ID
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9KT0REZT9Q');
          `}
          </Script>
        </head>
        <Providers>
          <Header />
          <main className="flex-grow">
            <Toaster
              toastOptions={{
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            {children}
            <Analytics />
          </main>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  )
}
