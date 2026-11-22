import type { Metadata, Viewport } from 'next'
import './globals.css'
import './marketing.css'
import 'lenis/dist/lenis.css'
import { ThemeProvider } from '@/lib/theme-context'
import { PageReady } from '@/components/marketing/PageReady'
import { TableQrIcon } from '@/components/marketing/ShopIcons'

const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('cafe-theme');d.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){d.setAttribute('data-theme','light')}d.classList.add('ms-loading');setTimeout(function(){if(d.classList.contains('ms-ready'))return;d.classList.remove('ms-loading');d.classList.add('ms-ready');window.dispatchEvent(new Event('ms:ready'))},8000)})()`

const siteTitle = 'Table ordering for small shops'
const siteDescription = 'Explore our QR ordering service, benefits, system plans, and optional maintenance and support for small cafés and restaurants.'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.NEXT_PUBLIC_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  referrer: 'no-referrer',
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${siteTitle}` },
  description: siteDescription,
  applicationName: siteTitle,
  openGraph: {
    type: 'website',
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    locale: 'km_KH',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="km"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className="h-full notranslate"
      translate="no"
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
        {/* Static, trusted string: applies the saved theme before first paint and guarantees the loader lifts. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript><style>{'.ms-loader{display:none!important}'}</style></noscript>
      </head>
      <body className="min-h-full flex flex-col notranslate" translate="no">
        <div className="ms-loader" aria-hidden="true">
          <div className="ms-loader-inner">
            <span className="ms-loader-mark"><TableQrIcon size={34} strokeWidth={1.5} /></span>
            <span className="ms-loader-name">table ordering<small>កុម្ម៉ង់តាម QR</small></span>
            <span className="ms-loader-bar"><span /></span>
          </div>
        </div>
        <ThemeProvider>
          <PageReady />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
