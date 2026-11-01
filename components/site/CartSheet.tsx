'use client'

import { useEffect, useRef } from 'react'
import { FileText, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { cartItemKey } from '@/lib/sugar'
import { MAX_CART_QUANTITY, MAX_LINE_QUANTITY } from '@/lib/cart-limits'
import { t, type Lang } from '@/lib/i18n'
import type { CartItem } from '@/lib/types'
import { MenuImage } from './MenuImage'

type CartSheetProps = {
  cart: CartItem[]
  lang: Lang
  table: string | null
  cartTotal: number
  cartCount: number
  open: boolean
  submitting: boolean
  error: string
  onOpen: () => void
  onClose: () => void
  onUpdateQty: (key: string, delta: number) => void
  onRemove: (key: string) => void
  onSubmit: () => void
}

export function CartSheet({ cart, lang, table, cartTotal, cartCount, open, submitting, error, onOpen, onClose, onUpdateQty, onRemove, onSubmit }: CartSheetProps) {
  const closeButton = useRef<HTMLButtonElement>(null)
  const submittingRef = useRef(submitting)

  useEffect(() => { submittingRef.current = submitting }, [submitting])

  useEffect(() => {
    if (!open) return
    const oldOverflow = document.body.style.overflow
    const oldFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submittingRef.current) onClose()
    }
    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', onEscape)
      oldFocus?.focus()
    }
  }, [open, onClose])

  return <>
    {cartCount > 0 && !open && (
      <button type="button" onClick={onOpen} className="cart-trigger fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:right-6 md:bottom-6 z-40 flex items-center justify-center rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-primary)', color: 'var(--text-invert)' }} aria-label={`${t('viewCart', lang)}: ${cartCount} ${t('items', lang)}, $${cartTotal.toFixed(2)}`}>
        <span className="relative" aria-hidden="true">
          <ShoppingCart className="size-6" />
          <span className="absolute -top-3 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold" style={{ background: 'var(--bg-base)', color: 'var(--primary)' }}>{cartCount}</span>
        </span>
      </button>
    )}
    {open && (
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('cartTitle', lang)} aria-busy={submitting}>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(1px)' }} onClick={submitting ? undefined : onClose} aria-hidden="true" />
        <div className="cart-drawer absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col" style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--bg-border)', boxShadow: 'var(--shadow-modal)' }}>
          <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6" style={{ borderColor: 'var(--bg-border)' }}>
            <div>
              <h2 className="serif text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t('cartTitle', lang)}</h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cartCount} {cartCount === 1 ? t('item', lang) : t('items', lang)}</p>
            </div>
            <button ref={closeButton} type="button" onClick={onClose} disabled={submitting} className="btn-icon cursor-pointer" aria-label={lang === 'km' ? 'បិទកន្ត្រក' : 'Close cart'}><X className="size-5" /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {cart.length === 0 && <p className="py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{lang === 'km' ? 'កន្ត្រករបស់អ្នកទទេ។' : 'Your cart is empty.'}</p>}
            <div className="flex flex-col gap-3">
              {cart.map(item => {
                const key = cartItemKey(item)
                return <div key={key} className="rounded-xl border p-3" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}>
                  <div className="flex items-start gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                      <MenuImage src={item.image_url} alt={lang === 'km' ? item.name_km : item.name_en} className="size-full object-cover"><div className="flex size-full items-center justify-center"><ShoppingCart className="size-5" aria-hidden="true" /></div></MenuImage>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{lang === 'km' ? item.name_km : item.name_en}</p>
                      <p className="truncate text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'km' ? item.name_en : item.name_km}</p>
                      {item.sugar_level !== undefined && <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{t('sugarLevel', lang)}: {item.sugar_level}%</p>}
                      <p className="mt-1 text-sm font-bold" style={{ color: 'var(--primary)' }}>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  {item.notes && <p className="mt-2 flex items-start gap-1.5 border-t pt-2 text-xs" style={{ borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}><FileText className="mt-0.5 size-3 shrink-0" aria-hidden="true" /><span>{item.notes}</span></p>}
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <div className="qty-stepper qty-stepper-lg" role="group" aria-label={`${item.name_en} quantity`}>
                      <button type="button" onClick={() => onUpdateQty(key, -1)} disabled={submitting} aria-label={`Decrease ${item.name_en}`}><Minus className="size-4" /></button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => onUpdateQty(key, 1)} disabled={submitting || item.quantity >= MAX_LINE_QUANTITY || cartCount >= MAX_CART_QUANTITY} aria-label={`Increase ${item.name_en}`}><Plus className="size-4" /></button>
                    </div>
                    <button type="button" onClick={() => onRemove(key)} disabled={submitting} className="flex size-11 items-center justify-center rounded-lg border cursor-pointer" style={{ borderColor: 'var(--bg-border)', color: 'var(--red-err)' }} aria-label={`Remove ${item.name_en}`}><Trash2 className="size-4" /></button>
                  </div>
                </div>
              })}
            </div>
          </div>
          <div className="border-t px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:px-6" style={{ borderColor: 'var(--bg-border)' }}>
            <div className="mb-4 flex items-center justify-between"><span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{t('total', lang)}</span><span className="serif text-2xl font-bold" style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span></div>
            {error && <p role="alert" className="mb-3 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--red-err)', color: 'var(--red-err)' }}>{error}</p>}
            <button type="button" onClick={onSubmit} disabled={submitting || cartCount === 0} className="btn-primary w-full justify-center py-4 text-base cursor-pointer" aria-busy={submitting}>{submitting ? t('placingOrder', lang) : t('placeOrder', lang)}</button>
            <p className="mt-3 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>{t('tableLabel', lang)} {table}</p>
          </div>
        </div>
      </div>
    )}
  </>
}
