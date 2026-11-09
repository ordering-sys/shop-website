'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, ChefHat, Coffee, QrCode, Smartphone } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type StoryStep = 0 | 1 | 2

export function OrderingStory() {
  const { lang } = useTheme()
  const km = lang === 'km'
  const [active, setActive] = useState<StoryStep>(0)
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const steps = [
    {
      icon: QrCode,
      label: km ? 'នៅតុ' : 'At the table',
      title: km ? 'ស្កេន QR ហើយចាប់ផ្តើម' : 'One scan starts the visit.',
      body: km ? 'ភ្ញៀវបើកម៉ឺនុយរបស់ហាងនៅលើទូរស័ព្ទ ដោយមិនចាំបាច់ដំឡើងកម្មវិធី។' : 'A guest opens your menu on their phone. No app download or paper menu to wait for.',
    },
    {
      icon: Smartphone,
      label: km ? 'នៅលើទូរស័ព្ទ' : 'On their phone',
      title: km ? 'ជ្រើសរើសតាមចិត្ត' : 'Choose at their own pace.',
      body: km ? 'រូបភាព តម្លៃ និងជម្រើសស្ថិតនៅកន្លែងតែមួយ មុនភ្ញៀវផ្ញើការកុម្ម៉ង់។' : 'Menu details, prices, and notes stay together before the guest sends an order.',
    },
    {
      icon: ChefHat,
      label: km ? 'នៅផ្ទះបាយ' : 'In the kitchen',
      title: km ? 'ការកុម្ម៉ង់មកដល់ច្បាស់លាស់' : 'The kitchen sees the details.',
      body: km ? 'ក្រុមការងារមើលការកុម្ម៉ង់ និងកំណត់ចំណាំរបស់ភ្ញៀវក្នុងជួរការងារតែមួយ។' : 'Your team gets a clear ticket with the table, items, and guest notes.',
    },
  ] as const

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const items = Array.from(section.querySelectorAll<HTMLElement>('[data-story-step]'))
    let frame = 0
    const update = () => {
      frame = 0
      const sectionBounds = section.getBoundingClientRect()
      if (sectionBounds.bottom < 0 || sectionBounds.top > window.innerHeight) return
      const focusLine = window.innerHeight * (window.innerWidth <= 680 ? 0.72 : 0.42)
      const centers = items.map(item => {
        const bounds = item.getBoundingClientRect()
        return bounds.top + bounds.height / 2
      })
      const closest = centers.reduce((best, center, index) =>
        Math.abs(center - focusLine) < Math.abs(centers[best] - focusLine) ? index : best, 0)
      setActive(current => current === closest ? current : closest as StoryStep)
      const span = centers[centers.length - 1] - centers[0]
      const progress = span > 0 ? Math.max(0, Math.min(1, (focusLine - centers[0]) / span)) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <section id="journey" ref={sectionRef} className="ms-story-section" aria-labelledby="ms-story-title">
    <div className="ms-container ms-story-heading">
      <p className="ms-eyebrow">{km ? 'មើលលំហូរការកុម្ម៉ង់' : 'Follow one order'}</p>
      <h2 id="ms-story-title">{km ? 'ពីការស្កេនដំបូង ទៅផ្ទះបាយ។' : <>From the first scan<br /><span>to the kitchen.</span></>}</h2>
      <p>{km ? 'ទិដ្ឋភាពតូចមួយនៃដំណើររបស់ភ្ញៀវ និងក្រុមការងារ។' : 'See how the guest and your team stay connected through a simple order.'}</p>
    </div>
    <div className="ms-container ms-story-grid">
      <div className="ms-story-steps">
        {steps.map(({ icon: Icon, label, title, body }, index) => <button
          type="button"
          key={label}
          data-story-step={index}
          className="ms-story-step"
          aria-pressed={active === index}
          aria-controls="ms-story-preview"
          onClick={() => setActive(index as StoryStep)}
        >
          <span className="ms-story-step-index">0{index + 1}<Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
          <span className="ms-story-step-label">{label}</span>
          <strong>{title}</strong>
          <span className="ms-story-step-body">{body}</span>
          <span className="ms-story-step-action">{km ? 'មើលទិដ្ឋភាព' : 'See this step'}<ArrowRight size={16} aria-hidden="true" /></span>
        </button>)}
      </div>
      <div className="ms-story-sticky">
        <div className="ms-story-artboard" id="ms-story-preview" aria-label={steps[active].title}>
          <div className="ms-story-artboard-top"><span>{km ? 'គំរូដំណើរការ' : 'ORDER FLOW / 01'}</span><span>0{active + 1} / 03</span></div>
          <div className="ms-story-progress" aria-hidden="true"><span ref={progressRef} /></div>
          <div className="ms-story-surface">
            <div className="ms-story-scene" data-active={active === 0} aria-hidden={active !== 0}><Card className="ms-story-card ms-story-qr">
              <CardHeader><span className="ms-story-card-kicker">{km ? 'តុ ០៤' : 'TABLE 04'}</span><CardTitle>{km ? 'សូមស្វាគមន៍' : 'Welcome in.'}</CardTitle><CardDescription>{km ? 'ស្កេនដើម្បីមើលម៉ឺនុយ' : 'Scan to explore the menu'}</CardDescription></CardHeader>
              <CardContent><span className="ms-story-qr-mark"><QrCode size={118} strokeWidth={1.1} aria-hidden="true" /></span><span className="ms-story-card-foot">{km ? 'ម៉ឺនុយរបស់អ្នកនៅទីនេះ' : 'Your menu starts here'}<ArrowRight size={17} aria-hidden="true" /></span></CardContent>
            </Card></div>
            <div className="ms-story-scene" data-active={active === 1} aria-hidden={active !== 1}><Card className="ms-story-card ms-story-menu">
              <CardHeader><span className="ms-story-card-kicker"><Coffee size={15} aria-hidden="true" />{km ? 'ហាងកាហ្វេគំរូ' : 'YOUR LITTLE CAFÉ'}</span><CardTitle>{km ? 'ថ្ងៃនេះចង់ញ៉ាំអ្វី?' : 'What sounds good?'}</CardTitle><CardDescription>{km ? 'ម៉ឺនុយសម្រាប់តុ ០៤' : 'Menu for table 04'}</CardDescription></CardHeader>
              <CardContent><span className="ms-story-menu-item"><span className="ms-story-menu-icon"><Coffee size={35} strokeWidth={1.2} aria-hidden="true" /></span><span><strong>{km ? 'ឡាតេទឹកកក' : 'Iced latte'}</strong><small>{km ? 'តិចស្ករ' : 'Less sugar'}</small></span><b>$2.50</b></span><span className="ms-story-menu-button">{km ? 'បន្ថែមទៅកន្ត្រក' : 'Add to order'}<ArrowRight size={17} aria-hidden="true" /></span></CardContent>
            </Card></div>
            <div className="ms-story-scene" data-active={active === 2} aria-hidden={active !== 2}><Card className="ms-story-card ms-story-kitchen">
              <CardHeader><span className="ms-story-card-kicker"><ChefHat size={15} aria-hidden="true" />{km ? 'ផ្ទះបាយ' : 'KITCHEN QUEUE'}</span><CardTitle>{km ? 'ការកុម្ម៉ង់ថ្មី' : 'New order'}</CardTitle><CardDescription>{km ? 'តុ ០៤ · ទើបមកដល់' : 'Table 04 · just received'}</CardDescription></CardHeader>
              <CardContent><span className="ms-story-ticket-row"><span>01</span><strong>{km ? 'ឡាតេទឹកកក' : 'Iced latte'}</strong><b>$2.50</b></span><span className="ms-story-ticket-note">{km ? 'កំណត់ចំណាំ៖ តិចស្ករ' : 'Guest note: less sugar'}</span><span className="ms-story-ticket-state"><Check size={17} aria-hidden="true" />{km ? 'បានទទួលការកុម្ម៉ង់' : 'Order received'}</span></CardContent>
            </Card></div>
          </div>
          <p className="ms-story-artboard-caption">{km ? 'រូបភាពគំរូប៉ុណ្ណោះ · មិនបង្កើតការកុម្ម៉ង់ពិត' : 'Illustrative preview · no real order is placed'}</p>
        </div>
      </div>
    </div>
  </section>
}
