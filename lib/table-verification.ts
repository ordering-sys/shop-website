function verificationKey(table: string, token: string) {
  return `verified-table:${JSON.stringify([table, token])}`
}

// This only remembers the UI check for the current browser tab. Server actions
// validate the QR code and a fresh location again before protected operations.
export function isTableVerified(table: string, token: string) {
  try {
    return sessionStorage.getItem(verificationKey(table, token)) === '1'
  } catch {
    return false
  }
}

export function rememberTableVerification(table: string, token: string) {
  try {
    sessionStorage.setItem(verificationKey(table, token), '1')
  } catch {
    // A blocked storage API should not prevent this visit from continuing.
  }
}
