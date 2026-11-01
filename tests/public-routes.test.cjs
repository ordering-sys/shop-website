const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(file, mocks = {}) {
  const { outputText } = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  })
  const loaded = { exports: {} }
  new Function('require', 'module', 'exports', outputText)(name => {
    if (name === 'react/jsx-runtime') return require('react/jsx-runtime')
    if (!(name in mocks)) throw new Error('Unexpected import: ' + name)
    return mocks[name]
  }, loaded, loaded.exports)
  return loaded.exports
}
const routes = load('lib/public-routes.ts')
const owner = 'https://orders.example.com'
const service = 'https://service.example.com'

test('legacy shop routes forward credentials only to the configured owner website', () => {
  const table = 'តុ 1 & 2', token = 'abc+/?#&='
  const url = new URL(routes.ownerPageHref(['order'], { table, token, next: 'https://other.example' }, owner, service))
  assert.equal(url.origin, owner)
  assert.equal(url.pathname, '/order')
  assert.equal(url.searchParams.get('table'), table)
  assert.equal(url.searchParams.get('token'), token)
  assert.equal(url.searchParams.has('next'), false)
  const tracking = new URL(routes.ownerPageHref(['tracking', 'order-id'], { table: ['T1','T2'], token: ['a','b'] }, owner, service))
  assert.equal(tracking.pathname, '/tracking/order-id')
  assert.equal(tracking.search, '?table=T1&token=a')
})

test('missing, unsafe, or same-origin owner configuration never redirects or creates a loop', () => {
  for (const base of [undefined, '', 'javascript:alert(1)', 'https://user:password@orders.example.com', service]) {
    assert.equal(routes.ownerPageHref(['order'], { token: 'secret' }, base, service), null)
  }
  for (const route of [['pricing'], ['unknown'], ['tracking','..'], ['tracking','a/b'], ['//other.example']]) {
    assert.equal(routes.ownerPageHref(route, {}, owner, service), null)
    assert.equal(routes.isLegacyShopPath(route), false)
  }
})

test('homepage QR visits leave the service site before any public pricing read', async () => {
  let reads = 0
  const previousOwner = process.env.NEXT_PUBLIC_OWNER_SITE_URL
  const previousService = process.env.NEXT_PUBLIC_SITE_URL
  process.env.NEXT_PUBLIC_OWNER_SITE_URL = owner
  process.env.NEXT_PUBLIC_SITE_URL = service
  try {
    const Page = load('app/(site)/page.tsx', {
      'next/navigation': { redirect: url => { throw new Error('REDIRECT ' + url) } },
      '@/lib/public-pricing': { getPublicPricing: async () => { reads++; return { plans: [], platformName: 'Service', contactEmail: null } } },
      '@/lib/public-routes': routes,
      '@/components/marketing/ServiceProduct': { ServiceProduct: 'ServiceProduct' },
      '@/components/marketing/PricingContent': { PricingContent: 'PricingContent' },
      '@/components/marketing/ShopMovedNotice': { ShopMovedNotice: 'ShopMovedNotice' },
    }).default
    await assert.rejects(() => Page({ searchParams: Promise.resolve({ table: 'T1', token: 'secret' }) }), error => error.message === 'REDIRECT https://orders.example.com/order?table=T1&token=secret')
    assert.equal(reads, 0)
    delete process.env.NEXT_PUBLIC_OWNER_SITE_URL
    assert.equal((await Page({ searchParams: Promise.resolve({ token: 'secret' }) })).type, 'ShopMovedNotice')
    assert.equal(reads, 0)
    const page = await Page({ searchParams: Promise.resolve({}) })
    assert.equal(page.type, 'ServiceProduct')
    assert.equal(page.props.children.type, 'PricingContent')
    assert.equal(page.props.children.props.embedded, true)
    assert.equal(reads, 1)
  } finally {
    if (previousOwner === undefined) delete process.env.NEXT_PUBLIC_OWNER_SITE_URL
    else process.env.NEXT_PUBLIC_OWNER_SITE_URL = previousOwner
    if (previousService === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = previousService
  }
})

test('general website layout always renders service navigation without customer providers', () => {
  const Layout = load('app/(site)/layout.tsx', { '@/components/marketing/MarketingShell': { MarketingShell: 'MarketingShell' } }).default
  const result = Layout({ children: 'Public content' })
  assert.equal(result.type, 'MarketingShell')
  assert.equal(result.props.children, 'Public content')
})
