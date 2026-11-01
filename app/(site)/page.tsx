import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPublicPricing } from '@/lib/public-pricing'
import { ownerPageHref, type PublicSearchParams } from '@/lib/public-routes'
import { ServiceProduct } from '@/components/marketing/ServiceProduct'
import { PricingContent } from '@/components/marketing/PricingContent'
import { ShopMovedNotice } from '@/components/marketing/ShopMovedNotice'

export const metadata: Metadata = {
  title: 'QR ordering for Shop',
  description: 'A simple QR menu and ordering system for small cafés and restaurants. Explore the benefits, system builds, and optional maintenance and support plans.',
}

export default async function ServicePage({ searchParams }: { searchParams: Promise<PublicSearchParams> }) {
  const query = await searchParams
  if (query.table !== undefined || query.token !== undefined) {
    const destination = ownerPageHref(['order'], query, process.env.NEXT_PUBLIC_OWNER_SITE_URL, process.env.NEXT_PUBLIC_SITE_URL)
    if (destination) redirect(destination)
    return <ShopMovedNotice />
  }
  const pricing = await getPublicPricing()
  return <ServiceProduct platformName={pricing.platformName} contactEmail={pricing.contactEmail}>
    <PricingContent pricing={pricing} embedded />
  </ServiceProduct>
}
