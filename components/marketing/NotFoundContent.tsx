'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'

export function NotFoundContent() {
  const { lang } = useTheme()
  return <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-6 text-center" style={{ color: 'var(--text-primary)' }}>
    <p className="text-6xl font-bold" style={{ color: 'var(--primary)' }}>404</p>
    <h1 className="text-3xl font-bold">{lang === 'km' ? 'រកមិនឃើញទំព័រ' : 'Page not found'}</h1>
    <Link href="/" className="btn-primary inline-flex min-h-12 items-center">{lang === 'km' ? 'ទៅទំព័រសេវាកម្ម' : 'Back to our service'}</Link>
  </main>
}
