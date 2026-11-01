import Link from 'next/link'

export function ShopMovedNotice() {
  return <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-5 px-6 py-12 text-center" style={{ color: 'var(--text-primary)' }}>
    <h1 className="text-3xl font-bold">Shop ordering has moved</h1>
    <p className="text-base leading-8" style={{ color: 'var(--text-secondary)' }}>Please scan the shop’s updated table QR or ask a staff member for the ordering link.</p>
    <p lang="km" className="text-base leading-8" style={{ color: 'var(--text-secondary)' }}>សូមស្កេន QR កូដថ្មីនៅតុ ឬស្នើសុំតំណកុម្ម៉ង់ពីបុគ្គលិក។</p>
    <Link href="/" className="btn-primary inline-flex min-h-12 items-center">Our service / សេវាកម្មរបស់យើង</Link>
  </main>
}
