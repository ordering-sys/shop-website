'use client'

import { useState } from 'react'
import { ArrowRight, Check, ChefHat, Coffee, LayoutDashboard, RotateCcw, Smartphone, Sparkles, UtensilsCrossed } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

type View = 'guest' | 'kitchen' | 'owner'
type Status = 'idle' | 'received' | 'preparing' | 'ready'

/** Local sample data only; this preview never reads a shop or submits an order. */
export function ProductWalkthrough() {
  const { lang } = useTheme()
  const km = lang === 'km'
  const [view, setView] = useState<View>('guest')
  const [status, setStatus] = useState<Status>('idle')
  const views = [
    { id: 'guest' as const, icon: Smartphone, label: km ? 'អតិថិជន' : 'Guest' },
    { id: 'kitchen' as const, icon: ChefHat, label: km ? 'ផ្ទះបាយ' : 'Kitchen' },
    { id: 'owner' as const, icon: LayoutDashboard, label: km ? 'ម្ចាស់ហាង' : 'Owner' },
  ]
  const labels = {
    idle: km ? 'រួចរាល់សម្រាប់សាកល្បង' : 'Ready to explore',
    received: km ? 'បានទទួលការកុម្ម៉ង់គំរូ' : 'Sample order received',
    preparing: km ? 'កំពុងរៀបចំការកុម្ម៉ង់គំរូ' : 'Sample order preparing',
    ready: km ? 'ការកុម្ម៉ង់គំរូរួចរាល់' : 'Sample order ready',
  }
  function startSample() {
    setStatus('received')
    setView('kitchen')
  }

  return <div className="ms-preview">
    <div className="ms-preview-toolbar">
      <span className="ms-preview-label"><span className="ms-live-dot" />{km ? 'សាកល្បងបទពិសោធន៍' : 'Take a little tour'}</span>
      <button type="button" className="ms-reset" onClick={() => { setStatus('idle'); setView('guest') }} aria-label={km ? 'ចាប់ផ្តើមគំរូឡើងវិញ' : 'Reset the interactive preview'}><RotateCcw size={15} aria-hidden="true" /></button>
    </div>
    <div className="ms-role-switch" role="group" aria-label={km ? 'ជ្រើសរើសទិដ្ឋភាពគំរូ' : 'Choose a preview perspective'}>
      {views.map(({ id, icon: Icon, label }) => <button key={id} id={`preview-${id}`} type="button" aria-pressed={view === id} aria-controls="product-preview" onClick={() => setView(id)}><Icon size={16} aria-hidden="true" />{label}</button>)}
    </div>

    <div id="product-preview" className="ms-preview-stage" role="region" aria-labelledby={`preview-${view}`}>
      {view === 'guest' && <div className="ms-phone">
        <div className="ms-phone-speaker" aria-hidden="true" />
        <div className="ms-phone-top"><span><Coffee size={16} aria-hidden="true" />{km ? 'ហាងកាហ្វេគំរូ' : 'A little café'}</span><span className="ms-tiny-tag">{km ? 'តុ' : 'Table'} 04</span></div>
        <p className="ms-demo-greeting">{km ? 'អ្វីដែលអ្នកចង់ញ៉ាំថ្ងៃនេះ?' : 'What sounds good today?'}</p>
        <div className="ms-menu-example"><div className="ms-coffee-art" aria-hidden="true"><Coffee size={47} strokeWidth={1.3} /></div><div><strong>{km ? 'ឡាតេទឹកកក' : 'Iced latte'}</strong><span>{km ? 'កាហ្វេមួយកែវសម្រាប់ថ្ងៃល្អ' : 'A little pick-me-up'}</span></div><span className="ms-example-price">$2.50</span></div>
        <div className="ms-menu-example"><div className="ms-tea-art" aria-hidden="true"><UtensilsCrossed size={35} strokeWidth={1.4} /></div><div><strong>{km ? 'អាហារសម្រន់' : 'Something to snack on'}</strong><span>{km ? 'ជ្រើសរើសតាមចំណូលចិត្ត' : 'Made for a coffee break'}</span></div></div>
        {status === 'idle' ? <button type="button" className="ms-demo-action" onClick={startSample}>{km ? 'សាកល្បងការកុម្ម៉ង់គំរូ' : 'Try a sample order'}<ArrowRight size={17} aria-hidden="true" /></button> : <div className={`ms-sample-status ${status === 'ready' ? 'is-ready' : ''}`}><Check size={18} aria-hidden="true" /><div><strong>{labels[status]}</strong><span>{km ? 'អតិថិជនអាចតាមដានស្ថានភាពនៅទីនេះ។' : 'Your guest sees the status here.'}</span></div></div>}
      </div>}

      {view === 'kitchen' && <div className="ms-kitchen-demo">
        <div className="ms-demo-panel-heading"><span className="ms-demo-icon"><ChefHat size={22} aria-hidden="true" /></span><div><strong>{km ? 'នៅក្នុងផ្ទះបាយ' : 'On the kitchen counter'}</strong><span>{km ? 'ការកុម្ម៉ង់ត្រូវបានរៀបចំតាមលំដាប់' : 'A clear queue for your team'}</span></div></div>
        <div className="ms-ticket"><div className="ms-ticket-top"><strong>{km ? 'តុ' : 'Table'} 04</strong><span className="ms-tiny-tag">{km ? 'គំរូ' : 'Sample'}</span></div><div className="ms-ticket-item"><span className="ms-ticket-qty">1×</span><strong>{km ? 'ឡាតេទឹកកក' : 'Iced latte'}</strong><Coffee size={20} aria-hidden="true" /></div><p className="ms-ticket-note">{km ? 'ស្ករតិច · កំណត់ចំណាំរបស់អតិថិជន' : 'Less sugar · Guest notes stay with the order'}</p><div className="ms-ticket-divider" /><p className="ms-ticket-state">{labels[status]}</p></div>
        {status === 'idle' && <button type="button" className="ms-demo-action" onClick={startSample}>{km ? 'បង្កើតការកុម្ម៉ង់គំរូ' : 'Create a sample order'}<ArrowRight size={17} aria-hidden="true" /></button>}
        {status === 'received' && <button type="button" className="ms-demo-action" onClick={() => setStatus('preparing')}>{km ? 'ចាប់ផ្តើមរៀបចំគំរូ' : 'Start preparing sample'}<ChefHat size={17} aria-hidden="true" /></button>}
        {status === 'preparing' && <button type="button" className="ms-demo-action" onClick={() => setStatus('ready')}>{km ? 'សម្គាល់គំរូថារួចរាល់' : 'Mark sample ready'}<Check size={17} aria-hidden="true" /></button>}
        {status === 'ready' && <button type="button" className="ms-demo-action" onClick={() => setView('guest')}>{km ? 'មើលទិដ្ឋភាពអតិថិជន' : 'See the guest’s update'}<Smartphone size={17} aria-hidden="true" /></button>}
      </div>}

      {view === 'owner' && <div className="ms-owner-demo">
        <div className="ms-demo-panel-heading"><span className="ms-demo-icon"><LayoutDashboard size={22} aria-hidden="true" /></span><div><strong>{km ? 'ហាងរបស់អ្នក មើលបានច្បាស់' : 'Your shop at a glance'}</strong><span>{km ? 'គំរូផ្ទាំងគ្រប់គ្រង' : 'An example of your workspace'}</span></div></div>
        <div className="ms-demo-metrics"><div><span>{km ? 'ការកុម្ម៉ង់គំរូ' : 'Sample orders'}</span><strong>{status === 'idle' ? '0' : '1'}</strong></div><div><span>{km ? 'តុក្នុងគំរូ' : 'Table in this preview'}</span><strong>04</strong></div></div>
        <div className="ms-demo-order-row"><span className="ms-demo-icon"><Coffee size={22} aria-hidden="true" /></span><div><strong>{km ? 'ឡាតេទឹកកក' : 'Iced latte'}</strong><span>{labels[status]}</span></div><span className="ms-example-price">{status === 'idle' ? '—' : '$2.50'}</span></div>
        <p className="ms-owner-note">{km ? 'គ្រប់គ្រងម៉ឺនុយ បុគ្គលិក និងការកុម្ម៉ង់ពីកន្លែងតែមួយ។' : 'A home for your menu, staff, and everyday orders.'}</p>
        <button type="button" className="ms-demo-action" onClick={() => setView(status === 'idle' ? 'guest' : 'kitchen')}>{km ? 'ស្វែងយល់ពីលំហូរការកុម្ម៉ង់' : 'Follow the ordering flow'}<ArrowRight size={17} aria-hidden="true" /></button>
      </div>}
    </div>
    <div className="ms-preview-foot"><Sparkles size={14} aria-hidden="true" /><span>{km ? 'គំរូអន្តរកម្ម · ទិន្នន័យគំរូប៉ុណ្ណោះ' : 'Interactive preview · Sample data only'}</span></div>
    <span className="sr-only" role="status">{labels[status]}</span>
  </div>
}
