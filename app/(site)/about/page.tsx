'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Coffee, Heart, MapPin, UtensilsCrossed } from 'lucide-react'
import { t } from '@/lib/i18n'
import { tableQs } from '@/lib/table-qs'
import { useTheme } from '@/lib/theme-context'

function AboutContent() {
  const { lang } = useTheme()
  const searchParams = useSearchParams()
  const qs = tableQs(searchParams.get('table'), searchParams.get('token'))
  const locationHref = `/map${qs ? `${qs}&tab=location` : '?tab=location'}`
  const highlights = [
    { title: t('aboutCoffeeTitle', lang), description: t('aboutCoffeeDesc', lang), Icon: Coffee },
    { title: t('aboutFoodTitle', lang), description: t('aboutFoodDesc', lang), Icon: UtensilsCrossed },
    { title: t('aboutServiceTitle', lang), description: t('aboutServiceDesc', lang), Icon: Heart },
  ]

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-12">
        <p className="label-overline mb-3">{t('storyBadge', lang)}</p>
        <h1 className="heading-section">{t('storyTitle', lang)}</h1>
        <div className="divider-primary mx-auto mt-5" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden flex items-center justify-center p-10 min-h-72 sm:min-h-96"
          style={{ background: 'linear-gradient(145deg, #2a2118, #12100d)', border: '1px solid var(--bg-border)' }}>
          <div aria-hidden="true" className="absolute -top-20 -right-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(240,167,66,0.25), transparent 70%)' }} />
          <div aria-hidden="true" className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(48,201,160,0.16), transparent 70%)' }} />
          <p className="relative text-center leading-tight whitespace-pre-line text-3xl sm:text-4xl italic" style={{ fontFamily: "'Playfair Display', serif", color: '#f5ede0' }}>
            {t('storyQuote', lang)}
          </p>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 mb-5" style={{ color: 'var(--primary)' }}>
            <Coffee className="w-5 h-5" aria-hidden="true" />
            <span className="font-semibold">{t('cafeName', lang)}</span>
          </div>
          <p className="text-lg leading-8 mb-6" style={{ color: 'var(--text-secondary)' }}>{t('storyDesc', lang)}</p>
          <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-secondary)' }}>{t('heroDesc', lang)}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/order${qs}`} className="btn-primary inline-flex items-center gap-2">
              {t('heroExplore', lang)} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href={`/contact${qs}`} className="btn-outline inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" /> {t('heroBook', lang)}
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-20" aria-labelledby="about-experience-title">
        <div className="max-w-2xl mb-8">
          <p className="label-overline mb-2">{t('aboutExperienceBadge', lang)}</p>
          <h2 id="about-experience-title" className="heading-section mb-4">{t('aboutExperienceTitle', lang)}</h2>
          <p className="text-base leading-7" style={{ color: 'var(--text-secondary)' }}>{t('aboutExperienceIntro', lang)}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ title, description, Icon }, index) => (
            <article key={title} className="rounded-2xl border p-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
              <div className="flex items-start justify-between gap-4 mb-8">
                <span className="inline-flex size-11 items-center justify-center rounded-xl" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>0{index + 1}</span>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-2 lg:items-center" aria-labelledby="about-table-title">
        <div className="relative min-h-80 aspect-[4/3] overflow-hidden rounded-2xl border lg:aspect-auto lg:h-full" style={{ borderColor: 'var(--bg-border)', background: 'var(--bg-elevated)' }}>
          <Image
            src="/images/hero-coffee-3d.jpg"
            alt={lang === 'km' ? 'កាហ្វេឡាតេក្នុងពែងខ្មៅ' : 'Latte in a black cup'}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="lg:pl-6">
          <p className="label-overline mb-2">{t('aboutTableBadge', lang)}</p>
          <h2 id="about-table-title" className="heading-section mb-4">{t('aboutTableTitle', lang)}</h2>
          <p className="text-base leading-7 mb-6" style={{ color: 'var(--text-secondary)' }}>{t('aboutTableDesc', lang)}</p>
          <ol className="grid gap-3">
            {[t('how1Title', lang), t('how2Title', lang), t('how3Title', lang)].map((step, index) => (
              <li key={step} className="flex items-center gap-4 rounded-xl border px-4 py-3" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
                <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>0{index + 1}</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-20 rounded-2xl border p-6 sm:p-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }} aria-labelledby="about-visit-title">
        <div className="max-w-xl">
          <h2 id="about-visit-title" className="heading-section mb-2">{t('aboutVisitTitle', lang)}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('aboutVisitDesc', lang)}</p>
        </div>
        <Link href={locationHref} className="btn-primary inline-flex items-center justify-center gap-2 shrink-0">
          <MapPin className="size-4" aria-hidden="true" /> {t('aboutFindUs', lang)} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  )
}

export default function AboutPage() {
  return <Suspense fallback={null}><AboutContent /></Suspense>
}
