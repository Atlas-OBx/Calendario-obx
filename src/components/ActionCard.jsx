const MONTHS_ABBR = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']

function parseDate(dateStr) {
  if (!dateStr) return null
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/')
    return { day: d, month: MONTHS_ABBR[parseInt(m, 10) - 1], year: y }
  }
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-')
    return { day: d, month: MONTHS_ABBR[parseInt(m, 10) - 1], year: y }
  }
  return null
}

function getBadgeClass(status) {
  if (!status) return 'badge--default'
  const s = status.toLowerCase()
  if (s.includes('confirm')) return 'badge--confirmado'
  if (s.includes('previst') || s.includes('program')) return 'badge--programado'
  if (s.includes('realiz')) return 'badge--realizado'
  if (s.includes('andamento') || s.includes('curso')) return 'badge--andamento'
  if (s.includes('cancel')) return 'badge--cancelado'
  return 'badge--default'
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function EventRow({ action, onClick }) {
  const dateStr = action.Data || action.data || ''
  const horario = action['Horário'] || action.Horario || action.horario || ''
  const nome = action['Ação'] || action.Acao || action['Nome da Ação'] || action.Nome || action.nome || 'Sem título'
  const cidade = action.Cidade || action.cidade || ''
  const local = action.Local || action.local || ''
  const status = action.Status || action.status || ''

  const parsed = parseDate(dateStr)
  const location = [cidade, local].filter(Boolean).join(' · ')

  return (
    <article
      className="event-row"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Date */}
      <div className="event-row__date">
        <span className="event-row__day">{parsed?.day ?? '—'}</span>
        <span className="event-row__month">{parsed?.month ?? ''}</span>
        <span className="event-row__year">{parsed?.year ?? ''}</span>
      </div>

      {/* Divider */}
      <div className="event-row__divider" />

      {/* Info */}
      <div className="event-row__info">
        {horario && <p className="event-row__time">{horario}</p>}
        <p className="event-row__name">{nome}</p>
        {location && (
          <p className="event-row__location">
            <PinIcon />
            {location}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="event-row__right">
        {status && <span className={`badge ${getBadgeClass(status)}`}>{status}</span>}
        <span className="event-row__chevron"><ChevronIcon /></span>
      </div>
    </article>
  )
}

export default EventRow
