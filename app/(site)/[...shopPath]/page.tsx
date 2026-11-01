import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { isLegacyShopPath, ownerPageHref, type PublicSearchParams } from '@/lib/public-routes'
import { ShopMovedNotice } from '@/components/marketing/ShopMovedNotice'

export const metadata: Metadata = { title: 'Shop website', robots: { index: false, follow: false } }

// Compatibility redirects only. Shop UI and server actions live in the owner app.
export default async function LegacyShopPage({ params, searchParams }: {
  params: Promise<{ shopPath: string[] }>
  searchParams: Promise<PublicSearchParams>
}) {
  const { shopPath } = await params
  if (!isLegacyShopPath(shopPath)) notFound()
  const destination = ownerPageHref(shopPath, await searchParams, process.env.NEXT_PUBLIC_OWNER_SITE_URL, process.env.NEXT_PUBLIC_SITE_URL)
  if (destination) redirect(destination)
  return <ShopMovedNotice />
}
