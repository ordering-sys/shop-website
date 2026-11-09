'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Check, ChefHat, ClipboardList, Coffee, Globe2, Mail, Moon, PencilLine, Plus, QrCode, Smartphone, Sprout, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { ProductWalkthrough } from '@/components/marketing/ProductWalkthrough'
import { OrderingStory } from '@/components/marketing/OrderingStory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ServiceProduct({ children, platformName, contactEmail }: { children: ReactNode; platformName: string; contactEmail: string | null }) {
  const { lang, theme } = useTheme()
  const km = lang === 'km'
  const benefits = [
    { Icon: Smartphone, title: km ? 'ពីការស្កេន ទៅការកុម្ម៉ង់' : 'From “scan” to “sounds delicious.”', body: km ? 'អតិថិជនមើលម៉ឺនុយ និងកុម្ម៉ង់ពីទូរស័ព្ទ ដោយមិនចាំបាច់ដំឡើងកម្មវិធី។' : 'Your menu is a scan away. Guests browse, choose, and order from their own phone. No app to install.', tag: km ? 'សម្រាប់អតិថិជន' : 'For your guests', className: 'ms-benefit-featured' },
    { Icon: PencilLine, title: km ? 'ម៉ឺនុយដែលកែបានគ្រប់ពេល' : 'New price? A quick update.', body: km ? 'កែតម្លៃ បន្ថែមមុខម្ហូប ឬលាក់មុខម្ហូបដែលអស់ ពីផ្ទាំងគ្រប់គ្រង។' : 'Change a price, add a special, or mark an item unavailable from your dashboard.', tag: km ? 'ងាយគ្រប់គ្រង' : 'Easy to manage', className: '' },
    { Icon: ChefHat, title: km ? 'ផ្ទះបាយធ្វើការកាន់តែងាយ' : 'A clearer kitchen queue.', body: km ? 'ការកុម្ម៉ង់ និងកំណត់ចំណាំរបស់អតិថិជនត្រូវបានបង្ហាញឱ្យក្រុមផ្ទះបាយ។' : 'Orders and guest notes arrive together, ready for your team to prepare and update.', tag: km ? 'សម្រាប់ក្រុមការងារ' : 'For your team', className: '' },
    { Icon: ClipboardList, title: km ? 'មើលហាងពីកន្លែងតែមួយ' : 'Your everyday essentials. Together.', body: km ? 'គ្រប់គ្រងម៉ឺនុយ បុគ្គលិក ការកុម្ម៉ង់ និងរបាយការណ៍លក់ក្នុងប្រព័ន្ធតែមួយ។' : 'Keep your menu, staff access, orders, and sales reports in one familiar workspace.', tag: km ? 'សម្រាប់ម្ចាស់ហាង' : 'For the owner', className: 'ms-benefit-wide' },
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

  return <main className="ms-homepage">
    <section className="ms-hero">
      <div className="ms-hero-field" aria-hidden="true"><span className="ms-hero-field-ring" /><span className="ms-hero-field-ring ms-hero-field-ring-inner" /><span className="ms-hero-field-point" /></div>
      <div className="ms-container ms-hero-grid">
        <div className="ms-hero-copy">
          <p className="ms-hero-kicker"><span aria-hidden="true">00 /</span>{km ? 'ម៉ឺនុយ QR · កុម្ម៉ង់តាមតុ' : 'QR menu · table ordering'}</p>
          <p className="ms-hero-product"><span className="sr-only">{platformName}</span>{platformName.trim().split(/\s+/).map((word, index) => <span className="ms-hero-word" aria-hidden="true" key={`${word}-${index}`}><span className="ms-hero-word-inner">{word}</span></span>)}</p>
          <h1 className="ms-hero-title">{km ? <><span className="ms-hero-line"><span className="ms-hero-line-inner">ហាងតូចរបស់អ្នក។</span></span>{' '}<span className="ms-hero-line ms-hero-line-accent"><span className="ms-hero-line-inner"><em>ការកុម្ម៉ង់កាន់តែងាយ។</em></span></span></> : <><span className="ms-hero-line"><span className="ms-hero-line-inner">Big care for</span></span>{' '}<span className="ms-hero-line ms-hero-line-accent"><span className="ms-hero-line-inner">your <em>small shop.</em></span></span></>}</h1>
          <p className="ms-hero-description">{km ? `${platformName} ភ្ជាប់ម៉ឺនុយ អតិថិជន និងផ្ទះបាយរបស់អ្នក ដូច្នេះអ្នកអាចផ្តោតលើការបម្រើភ្ញៀវ។` : `${platformName} connects your menu, guests, and kitchen—giving you a little more room to do what you love.`}</p>
          <div className="ms-hero-actions"><Link href="#plans" scroll={false} className="ms-button ms-button-primary">{km ? 'រកគម្រោងសម្រាប់ហាង' : 'Find your shop’s plan'}<ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="#demo" scroll={false} className="ms-button ms-button-text"><span className="ms-play-dot"><ArrowRight size={15} aria-hidden="true" /></span>{km ? 'សាកល្បងមើល' : 'Take a quick tour'}</Link></div>
        </div>
        <div id="demo" className="ms-hero-visual">
          <div className="ms-visual-topline"><span className="ms-tiny-star" aria-hidden="true">✳</span><span>{km ? 'សាកល្បងទិដ្ឋភាពទាំងបីខាងក្រោម' : 'Three perspectives. One happy little shop.'}</span></div>
          <span className="ms-float-icon ms-float-icon-left" aria-hidden="true"><Coffee size={27} strokeWidth={1.8} /></span>
          <span className="ms-float-icon ms-float-icon-right" aria-hidden="true"><QrCode size={27} strokeWidth={1.8} /></span>
          <span className="ms-float-icon ms-float-icon-top" aria-hidden="true"><ChefHat size={25} strokeWidth={1.8} /></span>
          <ProductWalkthrough />
          <div className="ms-visual-caption"><span className="ms-mini-line" />{km ? 'ចុចលើផ្ទាំង ដើម្បីស្វែងយល់ពីលំហូរការងារ' : 'Switch views above to see how it all connects.'}</div>
        </div>
      </div>
      <a href="#benefits" className="ms-hero-scroll-cue"><span className="ms-hero-scroll-line" aria-hidden="true" /><span>{km ? 'រំកិលចុះដើម្បីស្វែងយល់' : 'Scroll to explore'}</span><ArrowRight size={15} aria-hidden="true" /></a>
    </section>

    <div className="ms-capability-band"><div className="ms-container">{[{ Icon: QrCode, text: km ? 'ម៉ឺនុយតាម QR' : 'QR menus' }, { Icon: Smartphone, text: km ? 'កុម្ម៉ង់តាមទូរស័ព្ទ' : 'Table ordering' }, { Icon: ChefHat, text: km ? 'ផ្ទាំងផ្ទះបាយ' : 'Kitchen display' }, { Icon: Globe2, text: km ? 'ខ្មែរ និងអង់គ្លេស' : 'Khmer & English' }].map(({ Icon, text }) => <span key={text}><Icon size={20} strokeWidth={1.6} aria-hidden="true" />{text}</span>)}</div></div>

    <section id="benefits" className="ms-container ms-section">
      <div className="ms-section-heading"><div><p className="ms-eyebrow">{km ? 'រៀបចំឱ្យថ្ងៃធ្វើការកាន់តែងាយ' : 'Built around your everyday'}</p><h2>{km ? <>តិចការរវល់។<br />ច្រើនពេលសម្រាប់ភ្ញៀវ។</> : <>Less juggling.<br /><span>More time for your guests.</span></>}</h2></div><p className="ms-section-intro">{km ? 'ឧបករណ៍ដែលអ្នកត្រូវការ សម្រាប់បម្រើអតិថិជន និងគ្រប់គ្រងហាងតូចរបស់អ្នក។' : 'Thoughtful tools for the way a small shop actually works. From the first scan to the last order of the day.'}</p></div>
      <div className="ms-benefits-grid">{benefits.map(({ Icon, title, body, tag, className }, index) => <div key={title} className={`ms-benefit-tilt hover-3d ${className}`}>
        <Card className="ms-benefit-card">
          <CardHeader><span className="ms-benefit-icon"><Icon size={25} strokeWidth={1.6} aria-hidden="true" /></span><span className="ms-benefit-tag">{tag}</span><span className="ms-benefit-index" aria-hidden="true">0{index + 1}</span><CardTitle>{title}</CardTitle></CardHeader>
          <CardContent><CardDescription>{body}</CardDescription>{className === 'ms-benefit-featured' && <div className="ms-benefit-flow" aria-hidden="true"><QrCode size={24} /><span /><Smartphone size={24} /><span /><Check size={24} /></div>}</CardContent>
        </Card>
        {Array.from({ length: 8 }, (_, index) => <div key={index} aria-hidden="true" />)}
      </div>)}</div>
    </section>

    <section id="how-it-works" className="ms-process-section"><div className="ms-container ms-section"><div className="ms-section-heading"><div><p className="ms-eyebrow">{km ? 'ងាយចាប់ផ្តើម ងាយប្រើ' : 'Simple from the very start'}</p><h2>{km ? 'ពីហាងរបស់អ្នក ទៅការកុម្ម៉ង់ដំបូង។' : 'From your shop to your first order.'}</h2></div><Link href="#demo" scroll={false} className="ms-inline-link">{km ? 'ស្វែងយល់តាមគំរូ' : 'Explore the preview'}<ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="ms-process-grid">{steps.map(({ Icon, title, body }, index) => <article key={title} className="ms-process-step"><div className="ms-step-top"><span className="ms-step-number">0{index + 1}</span><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>

    <OrderingStory />

    {children}

    <section id="faq" className="ms-container ms-section ms-faq-section"><div><p className="ms-eyebrow">{km ? 'ចម្លើយមុនចាប់ផ្តើម' : 'A few things you might be wondering'}</p><h2>{km ? 'មានសំណួរ?' : <>Good questions.<br />Clear answers.</>}</h2><p className="ms-section-intro">{km ? 'ចាប់ផ្តើមដោយយល់ច្បាស់អំពីប្រព័ន្ធ និងសេវាដែលអ្នកជ្រើសរើស។' : 'Start with a clear picture of what you’re getting and how we can help.'}</p><Link href="#contact" scroll={false} className="ms-inline-link">{km ? 'សួរយើងបន្ថែម' : 'Ask us anything else'}<ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="ms-faq-list">{questions.map(({ q, a }) => <details key={q} name="service-questions" className="ms-faq-item"><summary>{q}<Plus size={20} aria-hidden="true" /></summary><p>{a}</p></details>)}</div></section>

    <section id="contact" className="ms-container ms-contact-section"><div className="ms-contact-card"><div className="ms-contact-copy"><p className="ms-eyebrow"><Sprout size={17} aria-hidden="true" />{km ? 'ការចាប់ផ្តើមតូចមួយ ដ៏ល្អ' : 'Here’s to your next small beginning'}</p><h2>{km ? 'សាងសង់អ្វីដែលសមនឹងហាងរបស់អ្នក។' : 'Let’s make your shop’s day a little easier.'}</h2><p>{km ? 'ប្រាប់យើងអំពីហាង និងតម្រូវការរបស់អ្នក។ យើងនឹងជួយស្វែងរកការរៀបចំដែលសមស្រប។' : 'Tell us about your shop, your menu, and the way you work. We’ll figure out the right setup together.'}</p>{contactEmail ? <a href={`mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent('Shop ordering system enquiry')}`} className="ms-button ms-button-primary"><Mail size={18} aria-hidden="true" />{km ? 'និយាយអំពីហាងរបស់អ្នក' : 'Let’s talk about your shop'}<ArrowUpRight size={17} aria-hidden="true" /></a> : <Link href="#plans" scroll={false} className="ms-button ms-button-primary">{km ? 'ស្វែងយល់ពីគម្រោង' : 'Explore the plans'}<ArrowUpRight size={17} aria-hidden="true" /></Link>}</div><div className="ms-contact-art" aria-hidden="true"><span className="ms-contact-ring" /><span className="ms-contact-orbit-dot" />{Array.from({ length: 8 }, (_, index) => <span key={index} className={`ms-contact-planet-orbit ms-contact-planet-orbit-${index + 1}`}><span /></span>)}<span className="ms-contact-badge ms-contact-badge-qr"><QrCode size={18} strokeWidth={1.7} /></span><span className="ms-contact-badge ms-contact-badge-kitchen"><ChefHat size={19} strokeWidth={1.7} /></span><Coffee size={90} strokeWidth={1} /><span className="ms-contact-star" data-theme={theme}><span className="ms-contact-symbol ms-contact-symbol-sun"><Sun size={72} strokeWidth={1.4} /></span><span className="ms-contact-symbol ms-contact-symbol-moon"><Moon size={72} strokeWidth={1.4} /></span></span></div></div></section>
  </main>
}
