'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { LoaderCircle, MapPin } from 'lucide-react'
import { getLocation } from '@/lib/location'
import { isTableVerified, rememberTableVerification } from '@/lib/table-verification'
import { useTheme } from '@/lib/theme-context'
import { verifyTableLocation } from '@/types/table-access-actions'

export function TableLocationGate({ children }: { children: ReactNode }) {
  const params = useSearchParams()
  const table = params.get('table')
  const token = params.get('token')
  const key = table && token ? JSON.stringify([table, token]) : ''
  const currentKey = useRef(key)
  const verifyButton = useRef<HTMLButtonElement>(null)
  const { lang } = useTheme()
  const [checkedKey, setCheckedKey] = useState('')
  const [verified, setVerified] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { currentKey.current = key }, [key])

  useEffect(() => {
    if (!table?.trim() || !token?.trim()) return
    let active = true
    queueMicrotask(() => {
      if (!active) return
      setVerified(isTableVerified(table, token))
      setCheckedKey(key)
      setError('')
    })
    return () => { active = false }
  }, [key, table, token])

  async function verify() {
    if (!table || !token || busy) return
    setBusy(true)
    setError('')
    try {
      const result = await verifyTableLocation(table, token, await getLocation())
      if (!result.success) throw new Error(result.error)
      rememberTableVerification(table, token)
      if (currentKey.current !== key) return
      setVerified(true)
    } catch (cause) {
      if (currentKey.current === key) setError(cause instanceof Error ? cause.message : 'Unable to verify location.')
    } finally {
      setBusy(false)
    }
  }

  const hasTableQr = Boolean(table?.trim() && token?.trim())
  const blocked = hasTableQr && (checkedKey !== key || !verified)

  return <>
    <div inert={blocked}>{children}</div>
    {hasTableQr && checkedKey === key && !verified && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="table-verify-title" onKeyDown={event => {
        if (event.key === 'Tab') {
          event.preventDefault()
          verifyButton.current?.focus()
        }
      }}>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(1px)' }} aria-hidden="true" />
        <div className="relative w-full max-w-md rounded-2xl border p-6 sm:p-8 text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)', boxShadow: 'var(--shadow-modal)' }}>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
            <MapPin className="size-6" aria-hidden="true" />
          </div>
          <h2 id="table-verify-title" className="serif text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {lang === 'km' ? 'ផ្ទៀងផ្ទាត់ទីតាំងតុ' : 'Verify your table location'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'km'
              ? `តុ ${table} · សូមផ្ទៀងផ្ទាត់ទីតាំងម្តងសម្រាប់ផ្ទាំងកម្មវិធីនេះ។ ពេលផ្ទុកទំព័រឡើងវិញ អ្នកមិនចាំបាច់ធ្វើម្តងទៀតទេ។`
              : `Table ${table} · Verify once in this browser tab. Refreshing the page will keep your access and cart.`}
          </p>
          {error && <p role="alert" className="mt-4 text-sm" style={{ color: 'var(--red-err)' }}>{error}</p>}
          <button ref={verifyButton} type="button" autoFocus onClick={() => void verify()} disabled={busy} className="btn-primary mt-6 w-full min-h-12 justify-center gap-2 cursor-pointer" aria-busy={busy}>
            {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {busy
              ? (lang === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់…' : 'Checking location…')
              : (lang === 'km' ? 'ផ្ទៀងផ្ទាត់ទីតាំង' : 'Verify location')}
          </button>
        </div>
      </div>
    )}
  </>
}
