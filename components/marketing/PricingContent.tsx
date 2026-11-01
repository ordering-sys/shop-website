'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, ChevronDown, Mail, Plus, Store, Users } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { paymentLabel, subscriptionEmail, type PublicPricing } from '@/lib/pricing-types'

type PlanFilter = 'all' | 'system' | 'addon'

export function PricingContent({ pricing, embedded = false }: { pricing: PublicPricing; embedded?: boolean }) {
  const { lang } = useTheme()
  const km = lang === 'km'
  const [filter, setFilter] = useState<PlanFilter>('all')
  const [expanded, setExpanded] = useState<string[]>([])
  const Container = embedded ? 'section' : 'main'
  const Title = embedded ? 'h2' : 'h1'
  const GroupTitle = embedded ? 'h3' : 'h2'
  const OfferTitle = embedded ? 'h4' : 'h3'
  const groups = [
    { type: 'system' as const, title: km ? 'ប្រព័ន្ធសម្រាប់ហាងរបស់អ្នក' : 'Your shop’s foundation', description: km ? 'ជ្រើសរើសការសាងសង់ប្រព័ន្ធបង់ម្តង ឬគម្រោងបន្តដែលមាន។' : 'A one-time system build, or a recurring plan where available. Choose what fits your shop.' },
    { type: 'addon' as const, title: km ? 'ជំនួយនៅពេលអ្នកត្រូវការ' : 'A little extra care', description: km ? 'សេវាថែទាំ និងជំនួយបន្ថែម ដែលអ្នកអាចជ្រើសរើសតាមតម្រូវការ។' : 'Optional maintenance and support, with a clear price and payment frequency for each service.' },
  ]
  const options = [
    { id: 'all' as const, label: km ? 'ទាំងអស់' : 'All offers' },
    { id: 'system' as const, label: km ? 'ប្រព័ន្ធ' : 'System plans' },
    { id: 'addon' as const, label: km ? 'សេវាបន្ថែម' : 'Extra care' },
  ]
  const visibleGroups = groups.filter(group => (filter === 'all' || filter === group.type) && pricing.plans.some(plan => plan.offeringType === group.type))

  return <Container id={embedded ? 'plans' : undefined} className="ms-container ms-section ms-pricing-section">
    <header className="ms-pricing-heading"><p className="ms-eyebrow">{km ? 'ការចាប់ផ្តើមដែលសមនឹងហាង' : 'Small shop. A plan that fits.'}</p><Title>{km ? <>ជ្រើសរើសការចាប់ផ្តើម។<br /><span>បន្ថែមជំនួយតាមតម្រូវការ។</span></> : <>A good start.<br /><span>A little care along the way.</span></>}</Title><p>{km ? 'ស្វែងរកប្រព័ន្ធដែលសមនឹងហាងរបស់អ្នក និងសេវាបន្ថែមដែលអ្នកត្រូវការ។ តម្លៃទាំងអស់គិតជា USD។' : 'Choose your system, then add the services you need. Clear scope, clear payment frequency. All prices in USD.'}</p></header>

    {!pricing.unavailable && pricing.plans.length > 0 && <div className="ms-plan-filters" role="group" aria-label={km ? 'ត្រងប្រភេទគម្រោង' : 'Filter pricing offers'}>{options.map(option => <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>{option.label}<span>{option.id === 'all' ? pricing.plans.length : pricing.plans.filter(plan => plan.offeringType === option.id).length}</span></button>)}</div>}

    {pricing.unavailable ? <div role="alert" className="ms-pricing-empty"><Store size={29} aria-hidden="true" /><p>{km ? 'មិនអាចផ្ទុកគម្រោងបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ ឬព្យាយាមពេលក្រោយ។' : 'Plans are taking a little longer to arrive. Please reload the page or try again later.'}</p></div> : !pricing.plans.length ? <div role="status" className="ms-pricing-empty"><Store size={29} aria-hidden="true" /><p>{km ? 'គម្រោងនឹងមានក្នុងពេលឆាប់ៗនេះ។ សូមទាក់ទងយើងសម្រាប់ព័ត៌មានបន្ថែម។' : 'Our plans will be here soon. Get in touch to talk about your shop in the meantime.'}</p></div> : <div id="pricing-offers" aria-live="polite" aria-atomic="false">
      {!visibleGroups.length && <div className="ms-pricing-empty"><p>{km ? 'មិនទាន់មានសេវាក្នុងប្រភេទនេះទេ។' : 'No offers in this category just yet.'}</p><button type="button" className="ms-inline-link" onClick={() => setFilter('all')}>{km ? 'មើលគម្រោងទាំងអស់' : 'See all offers'}<ArrowUpRight size={16} aria-hidden="true" /></button></div>}
      {visibleGroups.map(group => <section key={group.type} className="ms-offer-group" aria-label={group.title}><div className="ms-offer-group-heading"><div><GroupTitle>{group.title}</GroupTitle><p>{group.description}</p></div><span className="ms-group-icon" aria-hidden="true">{group.type === 'system' ? <Store size={21} /> : <Plus size={21} />}</span></div><div className="ms-plans-grid">
        {pricing.plans.filter(plan => plan.offeringType === group.type).map(plan => {
          const isOpen = expanded.includes(plan.id)
          const featured = plan.offeringType === 'system' && plan.billingInterval === 'one_time'
          const features = isOpen ? plan.features : plan.features.slice(0, 4)
          return <article key={plan.id} className={`ms-plan-card ${featured ? 'ms-plan-build' : ''} ${plan.offeringType === 'addon' ? 'ms-plan-addon' : ''}`}>
            <p className="ms-plan-kind">{plan.offeringType === 'addon' ? (km ? 'ជ្រើសរើសសេវាបន្ថែម' : 'Optional add-on') : featured ? (km ? 'សាងសង់ម្តង សម្រាប់ហាងរបស់អ្នក' : 'Built once. Made for your shop.') : (km ? 'គម្រោងបន្ត' : 'Recurring system plan')}</p>
            <OfferTitle>{plan.name}</OfferTitle>
            <div className="ms-plan-price"><span>${plan.price.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(plan.price) ? 0 : 2, maximumFractionDigits: 2 })}</span><span>USD {paymentLabel(plan.billingInterval, lang)}</span></div>
            <p className="ms-plan-price-note">{plan.billingInterval === 'one_time' ? (km ? 'តម្លៃបង់ម្តងសម្រាប់វិសាលភាពដែលបានរាយ' : 'One payment for the scope listed below.') : (km ? 'តម្លៃសម្រាប់រយៈពេលនីមួយៗដែលបានបង្ហាញ' : 'Price per payment period shown above.')}</p>
            {plan.offeringType === 'system' && <div className="ms-plan-allowances"><span><Users size={15} aria-hidden="true" />{plan.staffLimit} {km ? 'បុគ្គលិក' : 'staff'}</span><span><Store size={15} aria-hidden="true" />{plan.tableLimit} {km ? 'តុ' : 'tables'}</span></div>}
            <div className="ms-plan-feature-area"><ul id={`features-${plan.id}`} className="ms-plan-features">{features.map((feature, index) => <li key={index}><Check size={16} aria-hidden="true" /><span>{feature}</span></li>)}</ul>{plan.features.length > 4 && <button type="button" className="ms-feature-toggle" aria-expanded={isOpen} aria-controls={`features-${plan.id}`} onClick={() => setExpanded(previous => isOpen ? previous.filter(id => id !== plan.id) : [...previous, plan.id])}>{isOpen ? (km ? 'បង្ហាញតិច' : 'Show less') : (km ? `មើលលក្ខណៈពិសេសទាំង ${plan.features.length}` : `See all ${plan.features.length} features`)}<ChevronDown size={16} className={isOpen ? 'is-expanded' : ''} aria-hidden="true" /></button>}</div>
            {pricing.acceptingSubscriptions && pricing.contactEmail ? <a href={subscriptionEmail(pricing.contactEmail, plan)} className={`ms-button ${featured ? 'ms-button-primary' : 'ms-button-outline'} ms-plan-cta`} aria-label={`${km ? 'ទាក់ទងអំពី' : 'Enquire about'} ${plan.name}`}>{km ? 'និយាយជាមួយយើង' : plan.offeringType === 'addon' ? 'Ask about this service' : 'Let’s set up your shop'}<ArrowUpRight size={17} aria-hidden="true" /></a> : <p className="ms-plan-paused">{km ? 'មិនទាន់ទទួលសំណើថ្មីនៅពេលនេះទេ។ សូមព្យាយាមពេលក្រោយ។' : 'Enquiries are currently paused. Please check back soon.'}</p>}
          </article>
        })}
      </div></section>)}
    </div>}

    <p className="ms-pricing-footnote"><Check size={16} aria-hidden="true" />{km ? 'យើងបញ្ជាក់វិសាលភាព និងការទូទាត់ជាមួយអ្នកមុនចាប់ផ្តើម។ សេវាបន្តអាស្រ័យលើជម្រើសរបស់អ្នក។' : 'We confirm the scope and payment arrangements with you before starting. Ongoing services depend on what you choose.'}</p>
    {!embedded && pricing.contactEmail && <div className="ms-pricing-contact"><p>{km ? 'ត្រូវការជំនួយក្នុងការជ្រើសរើស?' : 'Need a hand choosing?'}</p><a href={`mailto:${encodeURIComponent(pricing.contactEmail)}`} className="ms-inline-link"><Mail size={17} aria-hidden="true" />{pricing.contactEmail}<ArrowUpRight size={16} aria-hidden="true" /></a></div>}
  </Container>
}
