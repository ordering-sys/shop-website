'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  MapPin,
  UtensilsCrossed,
  Layers,
  Sparkles,
  ExternalLink,
  Phone,
  Clock,
  ShoppingBag,
  Coffee,
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { tableQs } from '@/lib/table-qs'

interface TableData {
  id: string
  number: string
  name_en: string
  name_km: string
  seats: number
  section_en: string
  section_km: string
  shape: 'circle' | 'rect' | 'booth'
  x: number // percentage
  y: number // percentage
}

const CAFE_TABLES: TableData[] = [
  { id: 't1', number: 'T1', name_en: 'Window Table 1', name_km: 'តុបង្អួច ១', seats: 2, section_en: 'Sunlit Window', section_km: 'ក្បែរបង្អួច', shape: 'rect', x: 22, y: 28 },
  { id: 't2', number: 'T2', name_en: 'Center Lounge 2', name_km: 'តុបន្ទប់កណ្ដាល ២', seats: 4, section_en: 'Main Dining', section_km: 'សាលធំ', shape: 'rect', x: 50, y: 32 },
  { id: 't3', number: 'T3', name_en: 'Garden View 3', name_km: 'តុសួនច្បារ ៣', seats: 4, section_en: 'Main Dining', section_km: 'សាលធំ', shape: 'rect', x: 78, y: 28 },
  { id: 't4', number: 'T4', name_en: 'Cozy Corner 4', name_km: 'តុកាច់ជ្រុង ៤', seats: 2, section_en: 'Quiet Nook', section_km: 'ជ្រុងស្ងាត់', shape: 'circle', x: 25, y: 65 },
  { id: 'vip', number: 'VIP', name_en: 'Executive Lounge', name_km: 'បន្ទប់ពិសេស VIP', seats: 6, section_en: 'Private Suite', section_km: 'បន្ទប់ VIP', shape: 'booth', x: 75, y: 65 },
]

function MapContent() {
  const { lang } = useTheme()
  const searchParams = useSearchParams()
  const currentTable = searchParams.get('table')
  const currentToken = searchParams.get('token')
  const orderQs = tableQs(currentTable, currentToken)
  const tabParam = searchParams.get('tab')
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
  const [selectedTable, setSelectedTable] = useState<TableData | null>(
    CAFE_TABLES.find((t) => t.number.toLowerCase() === currentTable?.toLowerCase()) || CAFE_TABLES[0]
  )
  const [activeTab, setActiveTab] = useState<'floor' | 'location'>(
    tabParam === 'location' ? 'location' : 'floor'
  )

  return (
    <div className="min-h-screen pb-24">
      {/* ── Page Banner ── */}
      <div className="page-banner relative overflow-hidden text-center py-12 px-4 sm:px-6">
        <div className="hero-grain" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(240,167,66,0.14)',
              border: '1px solid rgba(240,167,66,0.35)',
              color: 'var(--primary-light)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ផែនទី 3D អន្តរកម្ម' : '3D Virtual Experience'}</span>
          </div>

          <h1 className="serif font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3" style={{ color: '#edf0f4' }}>
            {lang === 'km' ? 'ប្លង់ និងទីតាំងហាងកាហ្វេ' : 'Cafe Floor Plan & Location'}
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'km'
              ? 'រុករកប្លង់តុ 3D អន្តរកម្ម និងស្វែងរកទីតាំងហាងកាហ្វេ។'
              : 'Explore our interactive 3D floor plan and find the cafe location.'}
          </p>

          {/* Seated Table Beacon Notification */}
          {currentTable && (
            <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl animate-bounce-slight"
              style={{
                background: 'rgba(48,201,160,0.16)',
                border: '1px solid rgba(48,201,160,0.4)',
                color: 'var(--fresh-light)',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: 'var(--fresh)' }} />
              <span className="text-xs sm:text-sm font-bold">
                {lang === 'km' ? `អ្នកកំពុងអង្គុយនៅតុ: ${currentTable}` : `You are currently seated at: Table ${currentTable}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl max-w-md mx-auto mb-8 border"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}
        >
          <button
            onClick={() => setActiveTab('floor')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'floor'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'km' ? 'ប្លង់ 3D' : '3D Floor Plan'}</span>
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'location'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{lang === 'km' ? 'ទីតាំងហាង' : 'Location'}</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════
            TAB 1: 3D INTERACTIVE FLOOR PLAN
            ══════════════════════════════════════════════════════ */}
        {activeTab === 'floor' && (
          <div className="space-y-6 animate-fade">
            {/* View Controls & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
            >
              <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: 'var(--fresh)' }} />
                  <span>{lang === 'km' ? 'ទីតាំងតុ' : 'Table location'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: 'var(--primary)' }} />
                  <span>{lang === 'km' ? 'តុអ្នកកំពុងអង្គុយ' : 'Your Table'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md border" style={{ background: 'rgba(99,102,241,0.2)', borderColor: 'rgb(99,102,241)' }} />
                  <span>{lang === 'km' ? 'បន្ទប់ VIP' : 'VIP Lounge'}</span>
                </div>
              </div>

              {/* 3D / 2D Perspective Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl border"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}
              >
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === '3d'
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {lang === 'km' ? 'ទិដ្ឋភាព 3D' : '3D Perspective'}
                </button>
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === '2d'
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {lang === 'km' ? 'ប្លង់លើមេឃ 2D' : '2D Blueprint'}
                </button>
              </div>
            </div>

            {/* ── 3D Visual Stage ── */}
            <div className="relative w-full rounded-3xl p-4 sm:p-8 overflow-hidden border shadow-2xl flex items-center justify-center min-h-[480px] sm:min-h-[560px]"
              style={{
                background: 'linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-card) 60%, var(--bg-base) 100%)',
                borderColor: 'var(--bg-border)',
                perspective: '1200px',
              }}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-15 pointer-events-none filter blur-3xl"
                style={{ background: 'var(--primary)' }}
              />
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-10 pointer-events-none filter blur-3xl"
                style={{ background: 'var(--fresh)' }}
              />

              {/* 3D Rotatable Board */}
              <div
                className={`relative w-full max-w-2xl aspect-[4/3] rounded-3xl p-6 transition-all duration-700 select-none ${
                  viewMode === '3d' ? 'transform-gpu rotate-x-[26deg] -rotate-z-[8deg] scale-95 shadow-2xl' : 'scale-100'
                }`}
                style={{
                  background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
                  border: '2px solid var(--bg-border)',
                  boxShadow: viewMode === '3d'
                    ? '0 30px 60px -12px rgba(0,0,0,0.7), 0 18px 36px -18px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : 'var(--shadow-md)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* ── Floor Grid Lines ── */}
                <div className="absolute inset-0 opacity-10 rounded-3xl"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-secondary) 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                  }}
                  aria-hidden="true"
                />

                {/* ── Entrance & Terrace (Top Left) ── */}
                <div className="absolute top-3 left-4 px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'var(--bg-border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>🚪</span>
                  <span>{lang === 'km' ? 'ច្រកចូលធំ' : 'Main Entrance'}</span>
                </div>

                {/* ── Espresso Bar & Counter (Center Top) ── */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 sm:w-60 p-2.5 rounded-2xl border text-center shadow-lg transition-transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(145deg, #2a2015, #1c140c)',
                    borderColor: 'rgba(240,167,66,0.4)',
                    color: '#edf0f4',
                    transform: viewMode === '3d' ? 'translateZ(20px)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Coffee className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="font-bold text-xs sm:text-sm text-amber-300">
                      {lang === 'km' ? 'បារកាហ្វេ Espresso Bar' : 'Espresso Bar & Pastry'}
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-200/70">
                    {lang === 'km' ? 'កន្លែងឆុងកាហ្វេ និងនំស្រស់' : 'Handcrafted Brews & Bakery'}
                  </p>
                </div>

                {/* ── Order Pickup Counter (Top Right) ── */}
                <div className="absolute top-3 right-4 px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'var(--bg-border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'km' ? 'បញ្ជរទទួលកុម្ម៉ង់' : 'Order Pickup'}</span>
                </div>

                {/* ── Cafe Tables ── */}
                {CAFE_TABLES.map((table) => {
                  const isUserTable = currentTable?.toUpperCase() === table.number.toUpperCase()
                  const isSelected = selectedTable?.id === table.id

                  return (
                    <div
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      className={`absolute cursor-pointer transition-all duration-300 group ${
                        viewMode === '3d' ? 'hover:-translate-y-2' : 'hover:scale-110'
                      }`}
                      style={{
                        top: `${table.y}%`,
                        left: `${table.x}%`,
                        transform: viewMode === '3d'
                          ? `translate(-50%, -50%) translateZ(${isUserTable || isSelected ? '35px' : '15px'})`
                          : 'translate(-50%, -50%)',
                      }}
                    >
                      {/* 3D Pulsing beacon for current customer's table */}
                      {isUserTable && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                          <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-[9px] font-extrabold whitespace-nowrap px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-md mt-0.5">
                            {lang === 'km' ? 'តុអ្នក' : 'YOU'}
                          </span>
                        </div>
                      )}

                      {/* Table 3D Block */}
                      <div
                        className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all shadow-lg ${
                          table.shape === 'booth'
                            ? 'w-24 sm:w-28 h-16 sm:h-20 rounded-3xl'
                            : table.shape === 'circle'
                            ? 'w-14 sm:w-16 h-14 sm:h-16 rounded-full'
                            : 'w-16 sm:w-20 h-14 sm:h-16 rounded-2xl'
                        }`}
                        style={{
                          background: isUserTable
                            ? 'linear-gradient(145deg, #d97706, #92400e)'
                            : isSelected
                            ? 'linear-gradient(145deg, #2563eb, #1d4ed8)'
                            : 'var(--bg-card)',
                          borderColor: isUserTable
                            ? '#fbbf24'
                            : isSelected
                            ? '#60a5fa'
                            : 'var(--bg-border)',
                          color: isUserTable || isSelected ? '#ffffff' : 'var(--text-primary)',
                          boxShadow: isUserTable
                            ? '0 8px 24px rgba(217,119,6,0.6)'
                            : isSelected
                            ? '0 8px 24px rgba(37,99,235,0.5)'
                            : 'var(--shadow-sm)',
                        }}
                      >
                        <span className="font-extrabold text-xs sm:text-sm tracking-tight">{table.number}</span>
                        <span className="text-[9px] sm:text-[10px] opacity-80 whitespace-nowrap">
                          {table.seats} {lang === 'km' ? 'កៅអី' : 'seats'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Selected Table Interactive Card ── */}
            {selectedTable && (
              <div className="p-6 rounded-2xl border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
              >
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xl font-bold serif text-amber-500">
                      {lang === 'km' ? selectedTable.name_km : selectedTable.name_en}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border" style={{ color: 'var(--text-secondary)', borderColor: 'var(--bg-border)' }}>
                      {lang === 'km' ? 'មិនបង្ហាញស្ថានភាពតុ' : 'Status unavailable'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    {lang === 'km'
                      ? `ផ្នែក: ${selectedTable.section_km} · ចំណុះ: ${selectedTable.seats} កៅអី`
                      : `Zone: ${selectedTable.section_en} · Capacity: ${selectedTable.seats} Guests`}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {orderQs && selectedTable.number.toLowerCase() === currentTable?.toLowerCase() ? (
                    <Link
                      href={`/order${orderQs}`}
                      className="btn-primary flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm shadow-md"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>{lang === 'km' ? `កុម្ម៉ង់នៅតុ ${selectedTable.number}` : `Order from Table ${selectedTable.number}`}</span>
                    </Link>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'km' ? 'សូមស្កេន QR នៅតុនេះ ដើម្បីកុម្ម៉ង់។' : 'Scan the QR code at this table to order.'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2: PHNOM PENH LOCATION & HOURS
            ══════════════════════════════════════════════════════ */}
        {activeTab === 'location' && (
          <div className="space-y-6 animate-fade">
            <div className="card p-6 sm:p-10 rounded-3xl border shadow-xl"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Information Column (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <span className="label-overline mb-2 inline-flex items-center gap-1.5" style={{ color: 'var(--primary)' }}>
                      <MapPin className="w-3.5 h-3.5" />
                      {lang === 'km' ? 'ទីតាំងកណ្ដាលរាជធានីភ្នំពេញ' : 'Heart of Phnom Penh, Cambodia'}
                    </span>
                    <h2 className="serif text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                      The Bean Haven Cafe
                    </h2>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'km'
                        ? 'មានទីតាំងស្ថិតនៅចំកណ្ដាលបឹងកេងកង ១ ព័ទ្ធជុំវិញដោយបរិយាកាសស្ងប់ស្ងាត់ ម្លប់ត្រឈឹងត្រឈៃ និងកាហ្វេឆ្ងាញ់ប្រណីត។ អញ្ជើញមកទទួលទានដោយផ្ទាល់ ឬកុម្ម៉ង់រហ័សតាម QR កូដ។'
                        : 'Nestled on historic Street 240 in BKK1, Phnom Penh, shaded under lush tropical greenery with signature craft coffee and fresh bakery.'}
                    </p>
                  </div>

                  {/* Details List */}
                  <div className="space-y-3.5">
                    {/* Address */}
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl border"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(240,167,66,0.15)', color: 'var(--primary)' }}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                          {lang === 'km' ? 'អាសយដ្ឋាន' : 'Address'}
                        </p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {lang === 'km' ? 'ផ្លូវ ២៤០, សង្កាត់បឹងកេងកង ១, រាជធានីភ្នំពេញ' : 'Street 240, Sangkat BKK1, Khan Chamkarmon, Phnom Penh'}
                        </p>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl border"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(48,201,160,0.15)', color: 'var(--fresh)' }}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                          {lang === 'km' ? 'ម៉ោងបើកបម្រើ' : 'Opening Hours'}
                        </p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {lang === 'km' ? 'ច័ន្ទ – អាទិត្យ: ៧:០០ ព្រឹក – ១០:០០ យប់' : 'Monday – Sunday: 7:00 AM – 10:00 PM'}
                        </p>
                        <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{lang === 'km' ? 'កំពុងបើកបម្រើជូនអតិថិជន' : 'Open Now · Dine-in & Takeaway'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Direct Contact Phone */}
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl border"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(99,102,241,0.15)', color: 'rgb(99,102,241)' }}
                      >
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                          {lang === 'km' ? 'លេខទូរស័ព្ទហាង' : 'Cafe Contact'}
                        </p>
                        <a href="tel:+85512345678" className="text-sm font-semibold hover:underline" style={{ color: 'var(--text-primary)' }}>
                          +855 12 345 678 / +855 23 888 999
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Highlights / Amenities */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}
                    >
                      <span className="text-base">📶</span>
                      <span>{lang === 'km' ? 'Wi-Fi លឿន 500M' : 'High-Speed Wi-Fi'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}
                    >
                      <span className="text-base">🌿</span>
                      <span>{lang === 'km' ? 'សួនធម្មជាតិ' : 'Garden Patio'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}
                    >
                      <span className="text-base">❄️</span>
                      <span>{lang === 'km' ? 'ម៉ាស៊ីនត្រជាក់ស្ងាត់' : 'Quiet AC Lounge'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}
                    >
                      <span className="text-base">🅿️</span>
                      <span>{lang === 'km' ? 'កន្លែងចតម៉ូតូ/ឡាន' : 'Parking Area'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Street+240+BKK1+Phnom+Penh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{lang === 'km' ? 'នាំផ្លូវលើ Google Maps' : 'Get Directions'}</span>
                    </a>

                    <a
                      href="tel:+85512345678"
                      className="btn-outline flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Phone className="w-4 h-4" />
                      <span>{lang === 'km' ? 'ទូរស័ព្ទមកកាន់ហាង' : 'Call Cafe'}</span>
                    </a>
                  </div>
                </div>

                {/* Real Interactive Google Map Column (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border shadow-xl"
                    style={{ borderColor: 'var(--bg-border)', background: 'var(--bg-base)' }}
                  >
                    {/* Real Google Maps iframe embed */}
                    <iframe
                      title="The Bean Haven Cafe Phnom Penh Location"
                      src="https://maps.google.com/maps?q=Street+240,+BKK1,+Phnom+Penh,+Cambodia&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    />

                    {/* Floating live indicator badge */}
                    <div
                      className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-md border backdrop-blur-md pointer-events-none"
                      style={{
                        background: 'rgba(20, 16, 12, 0.88)',
                        borderColor: 'rgba(240, 167, 66, 0.4)',
                        color: '#edf0f4',
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-bold">
                        {lang === 'km' ? 'ផែនទីផ្ទាល់ (Street 240, ភ្នំពេញ)' : 'Live Map (Street 240, Phnom Penh)'}
                      </span>
                    </div>

                    {/* Floating Direct Directions Button */}
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Street+240+BKK1+Phnom+Penh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--text-invert)',
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'ពង្រីកផែនទី' : 'Open Full Map'}</span>
                    </a>
                  </div>

                  {/* Caption under map */}
                  <div className="flex items-center justify-between text-[11px] px-1" style={{ color: 'var(--text-dim)' }}>
                    <span>📍 11.5564° N, 104.9282° E · BKK1, Phnom Penh</span>
                    <a
                      href="https://maps.google.com/?q=Street+240+Phnom+Penh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-[var(--primary)]"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading map...</div>}>
      <MapContent />
    </Suspense>
  )
}
