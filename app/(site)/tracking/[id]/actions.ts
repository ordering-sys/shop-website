'use server'

import { sendTelegram } from '@/lib/telegram'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkTableAccess } from '@/lib/table-access'
import type { LocationFix } from '@/lib/location'

export async function sendWaiterAlert(orderId: string, access: { table: string; token: string; location: LocationFix }) {
  if (typeof orderId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(orderId)) {
    throw new Error('Invalid order')
  }
  if (!access || typeof access.table !== 'string' || typeof access.token !== 'string') throw new Error('Table access required')
  const tableAccess = await checkTableAccess(access.table, access.token, access.location)
  const supabase = createAdminClient()
  const { data: order, error } = await supabase.from('orders')
    .select('id, table_id, status').eq('id', orderId).single()
  if (error || !order || order.table_id !== tableAccess.number || !['preparing', 'ready'].includes(order.status)) {
    throw new Error('Order is unavailable for waiter calls')
  }
  const table = String(order.table_id).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!)
  const delivered = await sendTelegram(
    `🔔 <b>ហៅបុគ្គលិក / Waiter Called</b>\n\n` +
    `📋 Order #${order.id.slice(0, 8)}\n` +
    `🪑 តុ / Table: ${table}\n\n` +
    `Customer needs assistance at the table.`
  )
  if (!delivered) throw new Error('Staff notification could not be delivered. Please try again.')
}
