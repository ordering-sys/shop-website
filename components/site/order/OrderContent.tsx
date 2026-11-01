'use client'

import { cartItemKey, isSugarSchemaUnavailable } from '@/lib/sugar'
import { remainingQuantity } from '@/lib/cart-limits'
import { MenuImage } from '@/components/site/MenuImage'
import { ProductDetailModal } from '@/components/site/ProductDetailModal'
import { useTableCart } from '@/components/site/TableCartProvider'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Minus, FileText, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { MenuItem } from '@/lib/types'
import { useTheme } from '@/lib/theme-context'
import { t } from '@/lib/i18n'

export default function OrderContent() {
  const searchParams = useSearchParams()
  const table        = searchParams.get('table')
  const token        = searchParams.get('token')
  const canOrder     = Boolean(table?.trim() && token?.trim())
  const { lang }     = useTheme()
  const { cart, addItem, updateQty } = useTableCart()

  const [menuItems,         setMenuItems]         = useState<MenuItem[]>([])
  const [loading,           setLoading]           = useState(true)
  const [menuError, setMenuError] = useState(false)
  const [sugarSetupNeeded, setSugarSetupNeeded] = useState(false)
  const [selectedCategory,  setSelectedCategory]  = useState<string>('all')
  const [detailItem,        setDetailItem]        = useState<MenuItem | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadMenu()
    window.addEventListener('focus', loadMenu)
    return () => window.removeEventListener('focus', loadMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadMenu() {
    try {
      let { data, error } = await supabase
        .from('menu_items')
        .select('id, name_km, name_en, description, price, category, image_url, available, sugar_levels, default_sugar_level')
        .eq('available', true)
        .order('category', { ascending: true })
      if (isSugarSchemaUnavailable(error)) {
        console.warn('Sugar-level columns are missing; loading the menu without sugar options. Run SUGAR-LEVEL-SETUP.sql to enable them.')
        setSugarSetupNeeded(true)
        const legacyResult = await supabase
          .from('menu_items')
          .select('id, name_km, name_en, description, price, category, image_url, available')
          .eq('available', true)
          .order('category', { ascending: true })
        data = legacyResult.data?.map(item => ({ ...item, sugar_levels: [], default_sugar_level: null })) ?? null
        error = legacyResult.error
      } else {
        setSugarSetupNeeded(false)
      }
      if (error) throw error
      setMenuItems(data || [])
      setMenuError(false)
    } catch (err) {
      console.error('Failed to load menu:', err)
      setMenuError(true)
    } finally {
      setLoading(false)
    }
  }

  const addToCartWithNotes = (item: MenuItem, qty: number, notes: string, sugarLevel?: number) => {
    if (!canOrder) return
    addItem(item, qty, notes, sugarLevel)
  }

  const categories   = ['all', ...new Set(menuItems.map(i => i.category))]
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(i => i.category === selectedCategory)

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="flex gap-2">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-10 w-24 rounded-full" />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton h-60 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32">
      {!canOrder && (
        <div role="status" className="mx-auto max-w-6xl px-6 pt-6">
          <p className="rounded-xl border px-4 py-3 text-center font-semibold" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--bg-border)' }}>
            {t('mustScanInShop', lang)}
          </p>
        </div>
      )}

      {/* ── Page hero banner ── */}
      <div className="page-banner">
        <div className="hero-grain" aria-hidden="true" />
        <div className="relative z-10">
          <div className="table-chip mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--fresh)' }} aria-hidden="true" />
            {t('tableLabel', lang)} {table ?? '—'}
          </div>
          <h1 className="serif font-bold mb-2" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#edf0f4', lineHeight: 1.2 }}>
            {t('menuTitle', lang)}
          </h1>
          <p style={{ color: 'rgba(237,240,244,0.58)', fontSize: '0.9rem' }}>
            {t('menuSubtitle', lang)}
          </p>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-7">

        {/* Category pills */}
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6"
          role="tablist"
          aria-label="Menu categories"
        >
          {categories.map(cat => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 min-h-11 px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={
                  active
                    ? { background: 'var(--primary)', color: 'var(--text-invert)', boxShadow: 'var(--shadow-primary)' }
                    : { background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)' }
                }
              >
                {cat === 'all' ? t('allCategories', lang) : cat}
              </button>
            )
          })}
        </div>

        {sugarSetupNeeded && <p role="status" className="mb-4 rounded-lg border px-3 py-2 text-xs leading-relaxed" style={{ borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}>{lang === 'km' ? 'ម៉ឺនុយបានផ្ទុក ប៉ុន្តែមិនទាន់មានជម្រើសកម្រិតជាតិស្ករទេ។' : 'Menu loaded. Sugar customization is unavailable until the database migration is applied.'}</p>}
        {menuError && <p role="alert" className="mb-4">{lang === 'km' ? 'មិនអាចទាញយកមុខម្ហូបបានទេ។ សូមព្យាយាមម្តងទៀត។' : 'Could not load the menu.'} <button onClick={() => void loadMenu()} className="underline">{lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try again'}</button></p>}
        {/* Menu grid */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {filteredItems.map(item => {
            const inCart  = cart.find(c => c.id === item.id)
            const inQty   = cart.filter(line => line.id === item.id).reduce((sum, line) => sum + line.quantity, 0)
            const addRemaining = remainingQuantity(cart, item, inCart?.notes ?? '', inCart?.sugar_level)


            return (
              <div
                key={item.id}
                className="hover-3d group w-full h-full cursor-pointer"
                onClick={() => setDetailItem(item)}
              >
                <article className="card flex flex-col h-full overflow-hidden" style={{ zIndex: 2, pointerEvents: 'none' }}>
                  {/* ── Image — tap opens detail ── */}
                  <div
                    className="relative w-full overflow-hidden flex-shrink-0"
                    style={{ height: 150, background: 'var(--bg-elevated)' }}
                    onClick={() => setDetailItem(item)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${lang === 'km' ? item.name_km : item.name_en} — ${t('tapForDetail', lang)}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setDetailItem(item)
                      }
                    }}
                  >
                    <MenuImage src={item.image_url}
                        alt={lang === 'km' ? item.name_km : item.name_en}
                        className="w-full h-full object-cover"
                        loading="lazy">
                      <div className="w-full h-full dish-ph flex items-center justify-center" style={{ color: 'var(--primary)', opacity: 0.5 }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                        </svg>
                      </div>
                    </MenuImage>

                    {/* Category tag */}
                    <span
                      className="tag-fresh absolute top-2 left-2"
                      style={{ backdropFilter: 'blur(6px)' }}
                    >
                      {item.category}
                    </span>

                    {/* In-cart badge */}
                    {inQty > 0 && (
                      <span
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ background: 'var(--primary)', color: 'var(--text-invert)', boxShadow: 'var(--shadow-primary)' }}
                        aria-label={`${inQty} in cart`}
                      >
                        {inQty}
                      </span>
                    )}

                    {/* "Tap for detail" hint overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                      aria-hidden="true"
                    >
                      <ChevronRight className="w-3 h-3" style={{ color: 'var(--fresh-light)' }} />
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--fresh-light)' }}>
                        {t('tapForDetail', lang)}
                      </span>
                    </div>
                  </div>

                  {/* ── Info row ── */}
                  <div
                    className="p-3 flex flex-col gap-1.5 flex-1"
                    onClick={() => setDetailItem(item)}
                  >
                    <p className="font-semibold text-sm leading-snug line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                      {lang === 'km' ? item.name_km : item.name_en}
                    </p>
                    <p className="text-[11px] line-clamp-1" style={{ color: 'var(--text-dim)' }}>
                      {lang === 'km' ? item.name_en : item.name_km}
                    </p>

                    {/* Notes indicator */}
                    {inCart?.notes && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--fresh)' }} aria-hidden="true" />
                        <p className="text-[10px] truncate italic" style={{ color: 'var(--fresh)' }}>
                          {inCart.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── Price + quick-add row ── */}
                  <div
                    className="px-3 pb-3 flex flex-col items-stretch gap-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                      ${item.price.toFixed(2)}
                    </span>

                    {!canOrder ? (
                      <span className="text-xs font-semibold text-right" style={{ color: 'var(--text-secondary)' }}>
                        {t('mustScanInShop', lang)}
                      </span>
                    ) : inQty > 0 && !item.sugar_levels?.length ? (
                      /* Inline stepper when already in cart */
                      <div className="qty-stepper self-end" role="group" aria-label={`Quantity of ${item.name_en}`}>
                        <button
                          onClick={() => inCart && updateQty(cartItemKey(inCart), -1)}
                          aria-label="Remove one"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span aria-live="polite">{inQty}</span>
                        <button
                          onClick={() => addToCartWithNotes(item, 1, inCart?.notes ?? '', inCart?.sugar_level)}
                          disabled={addRemaining === 0}
                          aria-label="Add one more"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Add button → opens detail modal */
                      <button
                        onClick={() => setDetailItem(item)}
                        className="size-11 self-end flex items-center justify-center rounded-lg transition-all active:scale-90"
                        style={{
                          background: 'var(--primary)',
                          color: 'var(--text-invert)',
                          boxShadow: 'var(--shadow-primary)',
                          pointerEvents: 'auto',
                        }}
                        aria-label={`${t('addToCart', lang)} ${lang === 'km' ? item.name_km : item.name_en}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </article>
                {Array.from({ length: 8 }, (_, zone) => <div key={zone} aria-hidden="true" />)}
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PRODUCT DETAIL MODAL
          ══════════════════════════════════════════════ */}
      {detailItem && (
        <ProductDetailModal
          key={detailItem.id}
          item={detailItem}
          canOrder={canOrder}
          lang={lang}
          cartQty={cart.filter(c => c.id === detailItem.id).reduce((sum, line) => sum + line.quantity, 0)}
          cart={cart}
          onClose={() => setDetailItem(null)}
          onAdd={(item, qty, notes, sugarLevel) => {
            addToCartWithNotes(item, qty, notes, sugarLevel)
            /* Keep modal open so user can see confirmation */
          }}
        />
      )}

    </div>
  )
}
