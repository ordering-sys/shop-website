import type { Metadata } from 'next'
import { connection } from 'next/server'
import { getPublicPricing } from '@/lib/public-pricing'
import { PricingContent } from '@/components/marketing/PricingContent'

export const metadata: Metadata = {
  title: 'System builds & services',
  description: 'Explore one-time QR ordering system builds and optional maintenance and support services for your café or restaurant.',
}

export default async function PricingPage() {
  // Read at request time so saves in the separate admin app need no shared cache invalidation.
  await connection()
  const pricing = await getPublicPricing()
  return <PricingContent pricing={pricing} />
}
