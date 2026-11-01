import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { PublicPlan, PublicPricing } from '@/lib/pricing-types'

export async function getPublicPricing(): Promise<PublicPricing> {
  const result: PublicPricing = {
    plans: [], unavailable: false, platformName: 'Table ordering',
    contactEmail: null, acceptingSubscriptions: false,
  }
  try {
    const db = createAdminClient()
    // Explicit public columns only. Never read subscriptions or client accounts.
    const [initialPlans, settings] = await Promise.all([
      db.from('platform_plans').select('id, name, price, billing_interval, offering_type, staff_limit, table_limit, features')
        .eq('status', 'active').order('price').order('name').limit(500),
      db.from('platform_settings').select('name, support_email, onboarding').limit(1).maybeSingle(),
    ])
    if (!settings.error && settings.data) {
      result.platformName = settings.data.name?.trim() || result.platformName
      const email = settings.data.support_email?.trim()
      result.contactEmail = typeof email === 'string' && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email) ? email : null
      result.acceptingSubscriptions = settings.data.onboarding === 'open' && result.contactEmail !== null
    }
    // Permit the public app to deploy before the pricing migration. Old records
    // remain monthly system plans; new billing types never fall back to monthly.
    const legacy = ['42703', 'PGRST204'].includes(initialPlans.error?.code ?? '')
    const plans = legacy ? await db.from('platform_plans')
      .select('id, name, monthly_price, staff_limit, table_limit, features')
      .eq('status', 'active').order('monthly_price').order('name').limit(500) : initialPlans
    if (plans.error) return { ...result, unavailable: true }
    result.plans = (plans.data ?? []).flatMap(row => {
      const rawPrice = legacy && 'monthly_price' in row ? row.monthly_price : 'price' in row ? row.price : null
      const price = Number(rawPrice)
      const interval = legacy ? 'monthly' : 'billing_interval' in row ? row.billing_interval : null
      const offeringType = legacy ? 'system' : 'offering_type' in row ? row.offering_type : null
      const staff = Number(row.staff_limit)
      const tables = Number(row.table_limit)
      if (!row.id || !row.name?.trim() || rawPrice == null || !Number.isFinite(price) || price < 0 ||
        !['one_time', 'monthly', 'yearly'].includes(interval) || !['system', 'addon'].includes(offeringType) ||
        (offeringType === 'system' && (!Number.isInteger(staff) || staff < 1 || !Number.isInteger(tables) || tables < 1))) return []
      const plan: PublicPlan = {
        id: row.id, name: row.name.trim(), price, billingInterval: interval, offeringType,
        staffLimit: offeringType === 'addon' ? 0 : staff, tableLimit: offeringType === 'addon' ? 0 : tables,
        features: typeof row.features === 'string' ? row.features.split(/\r?\n/).map(line => line.trim()).filter(Boolean) : [],
      }
      return [plan]
    })
    return result
  } catch {
    return { ...result, unavailable: true }
  }
}
