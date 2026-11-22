'use client'

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChefHat, ClipboardList, Coffee, Globe2, Mail, Moon, PencilLine, Plus, QrCode, Smartphone, Sprout, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { ProductWalkthrough } from '@/components/marketing/ProductWalkthrough'
import { OrderingStory } from '@/components/marketing/OrderingStory'
import { SplitText } from '@/components/marketing/SplitText'
import { ClocheIcon, CupIcon, MenuPhoneIcon, TableQrIcon, TapIcon, TicketIcon } from '@/components/marketing/ShopIcons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const stagger = (index: number) => ({ '--reveal-i': index }) as CSSProperties

export function ServiceProduct({ children, platformName, contactEmail }: { children: ReactNode; platformName: string; contactEmail: string | null }) {
  const { lang, theme } = useTheme()
  const km = lang === 'km'
  const benefits = [
    { Icon: Smartphone, title: km ? 'ពីការស្កេន ទៅការកុម្ម៉ង់' : 'From “scan” to “sounds delicious.”', body: km ? 'អតិថិជនមើលម៉ឺនុយ និងកុម្ម៉ង់ពីទូរស័ព្ទ ដោយមិនចាំបាច់ដំឡើងកម្មវិធី។' : 'Your menu is a scan away. Guests browse, choose, and order from their own phone. No app to install.', tag: km ? 'សម្រាប់អតិថិជន' : 'For your guests', wide: true },
    { Icon: PencilLine, title: km ? 'ម៉ឺនុយដែលកែបានគ្រប់ពេល' : 'New price? A quick update.', body: km ? 'កែតម្លៃ បន្ថែមមុខម្ហូប ឬលាក់មុខម្ហូបដែលអស់ ពីផ្ទាំងគ្រប់គ្រង។' : 'Change a price, add a special, or mark an item unavailable from your dashboard.', tag: km ? 'ងាយគ្រប់គ្រង' : 'Easy to manage', wide: false },
    { Icon: ChefHat, title: km ? 'ផ្ទះបាយធ្វើការកាន់តែងាយ' : 'A clearer kitchen queue.', body: km ? 'ការកុម្ម៉ង់ និងកំណត់ចំណាំរបស់អតិថិជនត្រូវបានបង្ហាញឱ្យក្រុមផ្ទះបាយ។' : 'Orders and guest notes arrive together, ready for your team to prepare and update.', tag: km ? 'សម្រាប់ក្រុមការងារ' : 'For your team', wide: false },
    { Icon: ClipboardList, title: km ? 'មើលហាងពីកន្លែងតែមួយ' : 'Your everyday essentials. Together.', body: km ? 'គ្រប់គ្រងម៉ឺនុយ បុគ្គលិក ការកុម្ម៉ង់ និងរបាយការណ៍លក់ក្នុងប្រព័ន្ធតែមួយ។' : 'Keep your menu, staff access, orders, and sales reports in one familiar workspace.', tag: km ? 'សម្រាប់ម្ចាស់ហាង' : 'For the owner', wide: true },
  ]
  const steps = [
    { Icon: PencilLine, title: km ? 'ធ្វើឱ្យវាជាហាងរបស់អ្នក' : 'Make it yours', body: km ? 'យើងជួយរៀបចំឈ្មោះហាង ម៉ឺនុយ និង QR នៅតុ។' : 'We help set up your shop’s branding, menu, team access, and table QR codes.' },
    { Icon: QrCode, title: km ? 'អតិថិជនស្កេន និងជ្រើសរើស' : 'Scan. Choose. Order.', body: km ? 'QR នៅតុបើកម៉ឺនុយរបស់ហាង ដោយផ្ទាល់លើទូរស័ព្ទ។' : 'Guests scan the table code and open your shop’s ordering page directly.' },
    { Icon: ChefHat, title: km ? 'ក្រុមការងាររៀបចំ និងបម្រើ' : 'Prepare & serve', body: km ? 'ក្រុមការងារទទួលការកុម្ម៉ង់ និងធ្វើបច្ចុប្បន្នភាពស្ថានភាព។' : 'Your kitchen receives the order. Your guest follows along as it gets ready.' },
  ]
  const questions = [
    { q: km ? 'តើអតិថិជនត្រូវដំឡើងកម្មវិធីទេ?' : 'Do my customers need to download an app?', a: km ? 'មិនចាំបាច់ទេ។ ពួកគេស្កេន QR នៅតុ ហើយម៉ឺនុយបើកក្នុងកម្មវិធីរុករកលើទូរស័ព្ទ។' : 'No. Guests scan the QR code on their table and the menu opens in their phone’s browser.' },
    { q: km ? 'តើហាងតូចអាចប្រើបានទេ?' : 'Is this suitable for a small shop?', a: km ? 'បាទ/ចាស។ ចាប់ផ្តើមជាមួយហាងមួយ និងជ្រើសរើសគម្រោងដែលសមនឹងចំនួនតុ និងបុគ្គលិករបស់អ្នក។' : 'Yes. Start with one café or shop and choose a plan with the table and staff allowances that fit your operation.' },
    { q: km ? 'តើការបង់ម្តងរួមបញ្ចូលអ្វីខ្លះ?' : 'What does a one-time build include?', a: km ? 'វារួមបញ្ចូលការសាងសង់ និងការរៀបចំតាមវិសាលភាពក្នុងគម្រោងដែលអ្នកជ្រើសរើស។ យើងនឹងបញ្ជាក់ការងារ និងការប្រគល់មុនចាប់ផ្តើម។' : 'It covers the build and setup described in your selected plan. We confirm the scope and handover with you before starting. Maintenance and ongoing support are separate unless explicitly included.' },
    { q: km ? 'តើការបង្ហោះ និងឈ្មោះដែនរួមបញ្ចូលទេ?' : 'Are hosting and a domain included?', a: km ? 'សូមពិនិត្យព័ត៌មានក្នុងគម្រោងរបស់អ្នក។ យើងនឹងបញ្ជាក់ឈ្មោះដែន ការបង្ហោះ និងថ្លៃសេវាបន្តមុនចាប់ផ្តើម។' : 'Check the details of your chosen offer. We’ll confirm domain, hosting, database, and any ongoing service costs before you commit.' },
    { q: km ? 'តើមានជំនួយក្រោយរៀបចំទេ?' : 'Can I get help after setup?', a: km ? 'អាចបាន។ មើលសេវាថែទាំ និងជំនួយបន្ថែម ហើយយើងនឹងព្រមព្រៀងអំពីការគាំទ្រ និងពេលវេលាឆ្លើយតបជាមួយអ្នក។' : 'Yes. Explore the optional maintenance and support services. We agree on the included work, contact channels, and response times with you.' },
  ]
  const marquee = [
    { Icon: TableQrIcon, text: km ? 'ម៉ឺនុយតាម QR' : 'QR menus' },
    { Icon: MenuPhoneIcon, text: km ? 'កុម្ម៉ង់តាមទូរស័ព្ទ' : 'Table ordering' },
    { Icon: TicketIcon, text: km ? 'ផ្ទាំងផ្ទះបាយ' : 'Kitchen display' },
    { Icon: Globe2, text: km ? 'ខ្មែរ និងអង់គ្លេស' : 'Khmer & English' },
    { Icon: ClocheIcon, text: km ? 'តាមដានស្ថានភាព' : 'Live order status' },
    { Icon: CupIcon, text: km ? 'សម្រាប់ហាងតូចៗ' : 'Made for small shops' },
  ]
  const heroTitle = km
    ? ['ហាងតូចរបស់អ្នក។', { text: 'ការកុម្ម៉ង់កាន់តែងាយ។', accent: true }]
    : ['Big care for', { text: 'your small shop.', accent: true }]

  return <main className="ms-homepage">
    {/* 00 — Hero: pinned while a 3D order scene turns with scroll and pointer */}
    <section className="ms3-hero" data-progress="pin" data-progress-ease="0.65" data-pointer-scene aria-labelledby="ms3-hero-title">
      <div className="ms3-hero-sticky">
        <div className="ms3-hero-backdrop" aria-hidden="true">
          <span className="ms3-glow ms3-glow-a" data-speed="0.18" />
          <span className="ms3-glow ms3-glow-b" data-speed="-0.12" />
          <span className="ms3-hero-grid-lines" />
        </div>
        <div className="ms-container ms3-hero-layout">
          <div className="ms3-hero-copy">
            <p className="ms3-kicker"><span className="ms3-kicker-dot" aria-hidden="true" />{km ? 'ម៉ឺនុយ QR · កុម្ម៉ង់តាមតុ' : 'QR menu · table ordering'}</p>
            <SplitText as="p" reveal={false} className="ms3-hero-product" lines={[platformName]} />
            <SplitText as="h1" id="ms3-hero-title" reveal={false} className="ms3-hero-title" lines={heroTitle} />
            <p className="ms3-hero-description">{km ? `${platformName} ភ្ជាប់ម៉ឺនុយ អតិថិជន និងផ្ទះបាយរបស់អ្នក ដូច្នេះអ្នកអាចផ្តោតលើការបម្រើភ្ញៀវ។` : `${platformName} connects your menu, guests, and kitchen—giving you a little more room to do what you love.`}</p>
            <div className="ms3-hero-actions">
              <Link href="#plans" scroll={false} className="ms-button ms-button-primary ms3-button-glow"><span>{km ? 'រកគម្រោងសម្រាប់ហាង' : 'Find your shop’s plan'}</span><ArrowUpRight size={18} aria-hidden="true" /></Link>
              <Link href="#demo" scroll={false} className="ms-button ms3-button-ghost"><span className="ms3-ghost-icon"><TapIcon size={16} /></span>{km ? 'សាកល្បងមើល' : 'Take a quick tour'}</Link>
            </div>
          </div>

          <div className="ms3-stage" data-center-scene aria-hidden="true">
            <div className="ms3-stage-tilt">
              <div className="ms3-stage-scroll">
                <span className="ms3-orbit"><span /></span>
                <span className="ms3-floor" />

                {/* Table QR card, standing behind the phone */}
                <div className="ms3-qr-card">
                  <span className="ms3-qr-label">{km ? 'តុ ០៤' : 'Table 04'}</span>
                  <span className="ms3-qr-code"><QrCode strokeWidth={1.3} /></span>
                  <span className="ms3-qr-hint">{km ? 'ស្កេនដើម្បីកុម្ម៉ង់' : 'Scan to order'}</span>
                </div>

                {/* Guest phone with a little menu, its layers lifted toward the viewer */}
                <div className="ms3-phone">
                  <div className="ms3-phone-screen">
                    <span className="ms3-phone-notch" />
                    <div className="ms3-phone-top"><span><CupIcon size={14} />{km ? 'ហាងកាហ្វេ' : 'Little café'}</span><em>{km ? 'តុ ០៤' : 'Table 04'}</em></div>
                    <p className="ms3-phone-greeting">{km ? 'ថ្ងៃនេះចង់ញ៉ាំអ្វី?' : 'What sounds good?'}</p>
                    <div className="ms3-phone-item is-picked"><span className="ms3-phone-thumb"><Coffee size={20} strokeWidth={1.6} /></span><span><b>{km ? 'ឡាតេទឹកកក' : 'Iced latte'}</b><small>{km ? 'តិចស្ករ' : 'Less sugar'}</small></span><strong>$2.50</strong></div>
                    <div className="ms3-phone-item"><span className="ms3-phone-thumb is-alt"><ClocheIcon size={20} strokeWidth={1.6} /></span><span><b>{km ? 'នំខេក' : 'Butter croissant'}</b><small>{km ? 'ស្រស់ពីឡ' : 'Fresh today'}</small></span><strong>$1.80</strong></div>
                    <div className="ms3-phone-item"><span className="ms3-phone-thumb"><CupIcon size={20} strokeWidth={1.6} /></span><span><b>{km ? 'តែបៃតង' : 'Green tea'}</b><small>{km ? 'ក្តៅ ឬត្រជាក់' : 'Hot or iced'}</small></span><strong>$2.00</strong></div>
                    <span className="ms3-phone-button">{km ? 'ផ្ញើការកុម្ម៉ង់' : 'Send order'}<ArrowRight size={14} /></span>
                  </div>
                </div>

                {/* Kitchen ticket, floating in front */}
                <div className="ms3-ticket">
                  <div className="ms3-ticket-head"><span><TicketIcon size={15} />{km ? 'ផ្ទះបាយ' : 'Kitchen'}</span><em>{km ? 'តុ ០៤' : 'Table 04'}</em></div>
                  <p><b>1×</b>{km ? 'ឡាតេទឹកកក' : 'Iced latte'}</p>
                  <small>{km ? 'កំណត់ចំណាំ៖ តិចស្ករ' : 'Note: less sugar'}</small>
                  <span className="ms3-ticket-bar"><span /></span>
                  <span className="ms3-ticket-state"><ChefHat size={13} />{km ? 'កំពុងរៀបចំ' : 'Preparing'}</span>
                </div>

                <span className="ms3-chip ms3-chip-ready"><Check size={15} />{km ? 'រួចរាល់' : 'Order ready'}</span>
              </div>
            </div>
          </div>
        </div>
        <a href="#demo" className="ms3-scroll-cue"><span className="ms3-scroll-mouse" aria-hidden="true"><span /></span><span>{km ? 'រំកិលចុះដើម្បីស្វែងយល់' : 'Scroll to explore'}</span><ArrowDown size={14} aria-hidden="true" /></a>
      </div>
    </section>

    {/* Marquee: drifts with the scroll direction and speeds up with scroll velocity */}
    <div className="ms3-marquee" data-marquee aria-label={km ? 'លក្ខណៈពិសេសសំខាន់ៗ' : 'Key features'} role="region">
      <div className="ms3-marquee-track" data-marquee-track>
        {[0, 1].map(copy => <ul key={copy} className="ms3-marquee-group" aria-hidden={copy === 1 ? true : undefined}>
          {marquee.map(({ Icon, text }) => <li key={text}><Icon size={26} strokeWidth={1.5} aria-hidden="true" />{text}</li>)}
        </ul>)}
      </div>
    </div>

    {/* 01 — Interactive demo in a 3D frame that settles flat as it scrolls into view */}
    <section id="demo" className="ms3-demo" data-progress aria-labelledby="ms3-demo-title">
      <div className="ms-container ms3-demo-layout">
        <div className="ms3-demo-copy">
          <p className="ms-eyebrow" data-reveal><span className="ms3-num">01</span>{km ? 'សាកល្បងដោយខ្លួនឯង' : 'Try it yourself'}</p>
          <SplitText as="h2" id="ms3-demo-title" lines={km ? ['ទិដ្ឋភាពបី។', { text: 'ហាងតែមួយ។', accent: true }] : ['Three perspectives.', { text: 'One happy little shop.', accent: true }]} />
          <p className="ms-section-intro" data-reveal style={stagger(2)}>{km ? 'ប្តូររវាងអតិថិជន ផ្ទះបាយ និងម្ចាស់ហាង ដើម្បីមើលពីរបៀបដែលការកុម្ម៉ង់មួយធ្វើដំណើរ។' : 'Switch between the guest, the kitchen, and the owner to see how a single order moves through your shop.'}</p>
          <ul className="ms3-demo-points">
            {[km ? 'គ្មានកម្មវិធីត្រូវដំឡើង' : 'No app to install', km ? 'កំណត់ចំណាំទៅដល់ផ្ទះបាយ' : 'Guest notes reach the kitchen', km ? 'ស្ថានភាពផ្ទាល់សម្រាប់ភ្ញៀវ' : 'Live status for every guest'].map((point, index) => <li key={point} data-reveal style={stagger(index + 3)}><Check size={16} aria-hidden="true" />{point}</li>)}
          </ul>
        </div>
        <div className="ms3-demo-frame">
          <div className="ms3-demo-tilt"><ProductWalkthrough /></div>
        </div>
      </div>
    </section>

    {/* 02 — Benefits */}
    <section id="benefits" className="ms-container ms-section ms3-benefits" aria-labelledby="ms3-benefits-title">
      <div className="ms-section-heading">
        <div>
          <p className="ms-eyebrow" data-reveal><span className="ms3-num">02</span>{km ? 'រៀបចំឱ្យថ្ងៃធ្វើការកាន់តែងាយ' : 'Built around your everyday'}</p>
          <SplitText as="h2" id="ms3-benefits-title" lines={km ? ['តិចការរវល់។', { text: 'ច្រើនពេលសម្រាប់ភ្ញៀវ។', accent: true }] : ['Less juggling.', { text: 'More time for your guests.', accent: true }]} />
        </div>
        <p className="ms-section-intro" data-reveal style={stagger(2)}>{km ? 'ឧបករណ៍ដែលអ្នកត្រូវការ សម្រាប់បម្រើអតិថិជន និងគ្រប់គ្រងហាងតូចរបស់អ្នក។' : 'Thoughtful tools for the way a small shop actually works. From the first scan to the last order of the day.'}</p>
      </div>
      <div className="ms3-benefits-grid">{benefits.map(({ Icon, title, body, tag, wide }, index) => <div key={index} className={`ms3-benefit${wide ? ' is-wide' : ''}`} data-reveal style={stagger(index)}>
        <div className="ms3-tilt" data-tilt>
          <Card className="ms3-benefit-card">
            <span className="ms3-card-glare" aria-hidden="true" />
            <CardHeader><span className="ms3-benefit-icon"><Icon size={24} strokeWidth={1.6} aria-hidden="true" /></span><span className="ms3-benefit-tag">{tag}</span><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent><CardDescription>{body}</CardDescription>{index === 0 && <div className="ms3-benefit-flow" aria-hidden="true"><TableQrIcon size={24} /><span /><MenuPhoneIcon size={24} /><span /><TicketIcon size={24} /></div>}</CardContent>
            <span className="ms3-benefit-index" aria-hidden="true">0{index + 1}</span>
          </Card>
        </div>
      </div>)}</div>
    </section>

    {/* 03 — How it works: pinned, travels sideways on wide screens, stacks on small ones */}
    <section id="how-it-works" className="ms3-process" data-hscroll aria-labelledby="ms3-process-title">
      <div className="ms3-process-sticky">
        <div className="ms3-process-track" data-hscroll-track>
          <div className="ms3-process-intro">
            <p className="ms-eyebrow" data-reveal><span className="ms3-num">03</span>{km ? 'ងាយចាប់ផ្តើម ងាយប្រើ' : 'Simple from the very start'}</p>
            <SplitText as="h2" id="ms3-process-title" lines={km ? ['ពីហាងរបស់អ្នក', { text: 'ទៅការកុម្ម៉ង់ដំបូង។', accent: true }] : ['From your shop', { text: 'to your first order.', accent: true }]} />
            <Link href="#demo" scroll={false} className="ms-inline-link" data-reveal style={stagger(3)}>{km ? 'ស្វែងយល់តាមគំរូ' : 'Explore the preview'}<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          {steps.map(({ Icon, title, body }, index) => <article key={index} className="ms3-step" data-reveal style={stagger(index)}>
            <span className="ms3-step-number" aria-hidden="true">0{index + 1}</span>
            <span className="ms3-step-icon"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span>
            <h3><span className="sr-only">{km ? `ជំហាន ${index + 1}៖ ` : `Step ${index + 1}: `}</span>{title}</h3>
            <p>{body}</p>
          </article>)}
          <div className="ms3-process-end" data-reveal>
            <p>{km ? 'រួចរាល់ហើយឬនៅ?' : 'Ready when you are.'}</p>
            <Link href="#plans" scroll={false} className="ms-button ms-button-primary"><span>{km ? 'មើលគម្រោង' : 'See the plans'}</span><ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="ms3-process-rail" aria-hidden="true"><span /></div>
      </div>
    </section>

    <OrderingStory />

    {children}

    {/* FAQ */}
    <section id="faq" className="ms-container ms-section ms-faq-section ms3-faq" aria-labelledby="ms3-faq-title">
      <div>
        <p className="ms-eyebrow" data-reveal><span className="ms3-num">06</span>{km ? 'ចម្លើយមុនចាប់ផ្តើម' : 'A few things you might be wondering'}</p>
        <SplitText as="h2" id="ms3-faq-title" lines={km ? ['មានសំណួរ?'] : ['Good questions.', { text: 'Clear answers.', accent: true }]} />
        <p className="ms-section-intro" data-reveal style={stagger(2)}>{km ? 'ចាប់ផ្តើមដោយយល់ច្បាស់អំពីប្រព័ន្ធ និងសេវាដែលអ្នកជ្រើសរើស។' : 'Start with a clear picture of what you’re getting and how we can help.'}</p>
        <Link href="#contact" scroll={false} className="ms-inline-link" data-reveal style={stagger(3)}>{km ? 'សួរយើងបន្ថែម' : 'Ask us anything else'}<ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className="ms-faq-list">{questions.map(({ q, a }, index) => <details key={index} name="service-questions" className="ms-faq-item" data-reveal style={stagger(index)}><summary>{q}<Plus size={20} aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
    </section>

    {/* Contact: the card opens up (clip-path) as it scrolls into view */}
    <section id="contact" className="ms-container ms-contact-section" aria-labelledby="ms3-contact-title">
      <div className="ms-contact-card ms3-contact-card" data-progress>
        <div className="ms-contact-copy">
          <p className="ms-eyebrow" data-reveal><Sprout size={17} aria-hidden="true" />{km ? 'ការចាប់ផ្តើមតូចមួយ ដ៏ល្អ' : 'Here’s to your next small beginning'}</p>
          <SplitText as="h2" id="ms3-contact-title" lines={[km ? 'សាងសង់អ្វីដែលសមនឹងហាងរបស់អ្នក។' : 'Let’s make your shop’s day a little easier.']} />
          <p data-reveal style={stagger(2)}>{km ? 'ប្រាប់យើងអំពីហាង និងតម្រូវការរបស់អ្នក។ យើងនឹងជួយស្វែងរកការរៀបចំដែលសមស្រប។' : 'Tell us about your shop, your menu, and the way you work. We’ll figure out the right setup together.'}</p>
          <div data-reveal style={stagger(3)}>{contactEmail ? <a href={`mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent('Shop ordering system enquiry')}`} className="ms-button ms-button-primary"><Mail size={18} aria-hidden="true" /><span>{km ? 'និយាយអំពីហាងរបស់អ្នក' : 'Let’s talk about your shop'}</span><ArrowUpRight size={17} aria-hidden="true" /></a> : <Link href="#plans" scroll={false} className="ms-button ms-button-primary"><span>{km ? 'ស្វែងយល់ពីគម្រោង' : 'Explore the plans'}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>}</div>
        </div>
        <div className="ms-contact-art" aria-hidden="true"><span className="ms-contact-ring" /><span className="ms-contact-orbit-dot" />{Array.from({ length: 8 }, (_, index) => <span key={index} className={`ms-contact-planet-orbit ms-contact-planet-orbit-${index + 1}`}><span /></span>)}<span className="ms-contact-badge ms-contact-badge-qr"><QrCode size={18} strokeWidth={1.7} /></span><span className="ms-contact-badge ms-contact-badge-kitchen"><ChefHat size={19} strokeWidth={1.7} /></span><CupIcon size={90} strokeWidth={1} /><span className="ms-contact-star" data-theme={theme}><span className="ms-contact-symbol ms-contact-symbol-sun"><Sun size={72} strokeWidth={1.4} /></span><span className="ms-contact-symbol ms-contact-symbol-moon"><Moon size={72} strokeWidth={1.4} /></span></span></div>
      </div>
    </section>
  </main>
}
