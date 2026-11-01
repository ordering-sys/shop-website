import { serverSecret } from '@/lib/server-secret'

/** All chats that should receive alerts (deduplicated). */
export function getTelegramAlertChatIds(): string[] {
  const ids = [
    process.env.TELEGRAM_CHAT_ID,
    process.env.TELEGRAM_ADMIN_CHAT_ID,
    process.env.TELEGRAM_KITCHEN_CHAT_ID,
  ].filter((id): id is string => Boolean(id?.trim()))

  return [...new Set(ids.map(id => id.trim()))]
}

async function sendTelegramToChat(
  botToken: string,
  chatId: string,
  message: string
) {
  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(10000),
    }
  )

  if (!res.ok) {
    console.error(`Telegram message failed (chat ${chatId}): HTTP ${res.status}`)
    return false
  }
  return true
}

/** Send the same message to admin, kitchen, and/or default staff chats. Returns true once at least one chat receives the text alert. */
export async function sendTelegram(message: string) {
  try {
    const botToken = serverSecret('TELEGRAM_BOT_TOKEN')
    const chatIds = getTelegramAlertChatIds()

    if (!botToken || chatIds.length === 0) {
      console.warn(
        'Telegram not configured (need TELEGRAM_BOT_TOKEN and at least one chat id)'
      )
      return false
    }

    const deliveries = await Promise.allSettled(
      chatIds.map(async (chatId) => {
        try { return await sendTelegramToChat(botToken, chatId, message) }
        catch {
          console.error(`Telegram alert could not be delivered (chat ${chatId})`)
          return false
        }
      })
    )
    return deliveries.some(result => result.status === 'fulfilled' && result.value)
  } catch {
    console.error('Telegram send failed')
    return false
  }
}
