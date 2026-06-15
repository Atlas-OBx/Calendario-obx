import * as XLSX from 'xlsx'

/**
 * Parses a date value (string DD/MM/YYYY, YYYY-MM-DD or Excel serial number) into a JS Date.
 * XLSX.SSF.parse_date_code returns { y, m, d, H, M, S, u }
 */
export function parseDate(dateStr) {
  if (!dateStr && dateStr !== 0) return null
  if (typeof dateStr === 'number') {
    const dt = XLSX.SSF.parse_date_code(dateStr)
    if (!dt) return null
    return new Date(dt.y, dt.m - 1, dt.d, dt.H || 0, dt.M || 0, dt.S || 0)
  }
  const str = String(dateStr).trim()
  if (!str) return null
  if (str.includes('/')) {
    const parts = str.split('/')
    if (parts.length === 3) {
      const [d, m, y] = parts
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10))
    }
  }
  if (str.includes('-')) {
    const parts = str.split('-')
    if (parts.length === 3) {
      const [y, m, d] = parts
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10))
    }
  }
  return null
}

/**
 * Normalizes a status string into a CSS-safe slug.
 */
export function normalizeStatus(status) {
  if (!status) return 'planejada'
  const s = String(status).toLowerCase()
  if (s.includes('confirm')) return 'confirmada'
  if (s.includes('realiz')) return 'realizada'
  if (s.includes('cancel')) return 'cancelada'
  if (s.includes('andamento') || s.includes('curso')) return 'andamento'
  return 'planejada'
}
