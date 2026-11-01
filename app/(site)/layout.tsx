'use client'

import { TableLocationGate } from '@/components/site/TableLocationGate'
import { TableCartProvider } from '@/components/site/TableCartProvider'
import { Suspense } from 'react'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { MobileBottomNav } from '@/components/site/MobileBottomNav'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <SiteHeader />
      <div className="flex-1 pb-20 md:pb-0" style={{ paddingTop: '4rem' }}>
        <TableCartProvider>
          <Suspense fallback={children}><TableLocationGate>{children}</TableLocationGate></Suspense>
        </TableCartProvider>
      </div>
      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
      <MobileBottomNav />
    </div>
  )
}

