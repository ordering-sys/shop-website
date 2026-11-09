'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { ArrowUpRight, Menu, Moon, QrCode, Sprout, Sun, X } from 'lucide-react'
import { LanguageDropdown } from '@/components/ui/LanguageDropdown'
import { MarketingMotion } from '@/components/marketing/MarketingMotion'
import { useTheme } from '@/lib/theme-context'

export function MarketingShell({ children }: { children: ReactNode }) {
  const { lang, theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const km = lang === 'km'
  const links = [
    { id: 'benefits', label: km ? 'អត្ថប្រយោជន៍' : 'Why us' },
    { id: 'how-it-works', label: km ? 'របៀបដំណើរការ' : 'How it works' },
    { id: 'plans', label: km ? 'គម្រោង និងតម្លៃ' : 'Plans & pricing' },
    { id: 'faq', label: km ? 'សំណួរ' : 'FAQs' },
  ]

  useEffect(() => {
    if (pathname !== '/' || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id) })
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 })
    for (const id of ['benefits', 'how-it-works', 'plans', 'faq']) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [pathname])

  return <div className="marketing-site">
    <MarketingMotion pathname={pathname} />
    <a href="#service-content" className="ms-skip">{km ? 'ទៅកាន់មាតិកា' : 'Skip to content'}</a>
    <header className="ms-header">
      <div className="ms-container ms-header-inner">
        <Link href="/" onClick={() => setMenuOpen(false)} className="ms-brand" aria-label={km ? 'កុម្ម៉ង់តាម QR ទំព័រដើម' : 'Table ordering home'}><span className="ms-brand-mark"><QrCode size={25} strokeWidth={1.8} aria-hidden="true" /></span><span>{km ? 'កុម្ម៉ង់តាម QR' : 'table ordering'}<small>{km ? 'សម្រាប់ហាងតូចរបស់អ្នក' : 'a little more connected'}</small></span></Link>
        <nav className="ms-desktop-nav" aria-label={km ? 'រុករកសេវាកម្ម' : 'Service navigation'}>{links.map(link => <Link key={link.id} href={`/#${link.id}`} scroll={pathname !== '/'} aria-current={pathname === '/' && activeSection === link.id ? 'location' : undefined}>{link.label}</Link>)}</nav>
        <div className="ms-header-actions">
          <LanguageDropdown />
          <button type="button" onClick={toggleTheme} className="ms-theme-toggle" data-theme={theme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <span className="ms-theme-icon ms-theme-icon-sun" aria-hidden="true"><Sun size={18} /></span>
            <span className="ms-theme-icon ms-theme-icon-moon" aria-hidden="true"><Moon size={18} /></span>
          </button>
          <Link href="/#contact" scroll={pathname !== '/'} className="ms-button ms-button-primary ms-header-cta">{km ? 'និយាយជាមួយយើង' : 'Let’s talk'}<ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button type="button" className="ms-menu-toggle" onClick={() => setMenuOpen(value => !value)} aria-label={km ? 'ម៉ឺនុយរុករក' : 'Navigation menu'} aria-expanded={menuOpen} aria-controls="service-mobile-nav">{menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
        </div>
      </div>
      <nav id="service-mobile-nav" hidden={!menuOpen} className="ms-mobile-nav" onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false) }} aria-label={km ? 'រុករកលើទូរស័ព្ទ' : 'Mobile service navigation'}>{links.map(link => <Link key={link.id} href={`/#${link.id}`} scroll={pathname !== '/'} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}<Link href="/#contact" scroll={pathname !== '/'} onClick={() => setMenuOpen(false)}>{km ? 'ទាក់ទងយើង' : 'Talk about your shop'}<ArrowUpRight size={16} aria-hidden="true" /></Link></nav>
      <div className="ms-scroll-progress" aria-hidden="true" />
    </header>
    <div id="service-content" tabIndex={-1}>{children}</div>
    <footer className="ms-footer"><div className="ms-container"><div className="ms-footer-top"><div><Link href="/" className="ms-brand"><span className="ms-brand-mark"><QrCode size={24} aria-hidden="true" /></span><span>{km ? 'កុម្ម៉ង់តាម QR' : 'table ordering'}</span></Link><p>{km ? 'រៀបចំការកុម្ម៉ង់ឱ្យងាយស្រួល សម្រាប់ហាងតូចៗនៅកម្ពុជា។' : 'A simpler ordering day for small shops in Cambodia.'}</p></div><nav aria-label={km ? 'តំណបន្ថែម' : 'Footer navigation'}><Link href="/#benefits" scroll={pathname !== '/'}>{km ? 'អត្ថប្រយោជន៍' : 'The benefits'}</Link><Link href="/pricing">{km ? 'គម្រោងទាំងអស់' : 'All plans & services'}</Link><Link href="/#contact" scroll={pathname !== '/'}>{km ? 'ទាក់ទងយើង' : 'Get in touch'}</Link></nav></div><div className="ms-footer-bottom"><span><Sprout size={15} aria-hidden="true" />{km ? 'បង្កើតសម្រាប់ការចាប់ផ្តើមតូចៗ' : 'Made for small beginnings.'}</span><span>{km ? 'ម៉ឺនុយ · ការកុម្ម៉ង់ · ផ្ទះបាយ' : 'Your menu. Your team. Connected.'}</span></div></div></footer>
  </div>
}
