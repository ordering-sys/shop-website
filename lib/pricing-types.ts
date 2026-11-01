export type PublicPlan = {
  id: string
  name: string
  price: number
  billingInterval: 'one_time' | 'monthly' | 'yearly'
  offeringType: 'system' | 'addon'
  staffLimit: number
  tableLimit: number
  features: string[]
}

export type PublicPricing = {
  plans: PublicPlan[]
  unavailable: boolean
  platformName: string
  contactEmail: string | null
  acceptingSubscriptions: boolean
}

export function subscriptionEmail(email: string, plan: PublicPlan): string {
  const subject = `Pricing enquiry: ${plan.name}`
  const body = `Hello,\n\nI am interested in ${plan.name} ($${plan.price.toFixed(2)} USD ${paymentLabel(plan.billingInterval)}).\nOffer type: ${plan.offeringType === 'addon' ? 'Optional add-on service' : 'System build / plan'}\nPlan reference: ${plan.id}\n\nShop name:\nContact name:\nPhone number:\n\nPlease confirm the scope, payment arrangements, and next steps.`
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function paymentLabel(interval: PublicPlan['billingInterval'], lang: 'en' | 'km' = 'en'): string {
  const labels = {
    one_time: { en: 'one-time', km: 'បង់ម្តង' },
    monthly: { en: '/ month', km: '/ ខែ' },
    yearly: { en: '/ year', km: '/ ឆ្នាំ' },
  }
  return labels[interval][lang]
}
