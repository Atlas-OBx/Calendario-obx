import { useState } from 'react'
import { parseDate, normalizeStatus } from '../utils'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function CalendarView({ actions, onEventClick }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  // Build calendar days
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  // Map actions to date strings "YYYY-MM-DD"
  const actionsByDate = {}
  actions.forEach(action => {
    const d = parseDate(action.Data)
    if (!d) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!actionsByDate[key]) actionsByDate[key] = []
    actionsByDate[key].push(action)
  })

  // Build cells array
  const cells = []

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, month: viewMonth - 1, year: viewMonth === 0 ? viewYear - 1 : viewYear, isCurrentMonth: false })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true })
  }

  // Next month leading days (fill to complete rows)
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, month: viewMonth + 1, year: viewMonth === 11 ? viewYear + 1 : viewYear, isCurrentMonth: false })
  }

  const isToday = (cell) =>
    cell.isCurrentMonth &&
    cell.day === today.getDate() &&
    cell.month === today.getMonth() &&
    cell.year === today.getFullYear()

  const getDateKey = (cell) => {
    const m = cell.isCurrentMonth ? cell.month : (cell.month < 0 ? 11 : cell.month > 11 ? 0 : cell.month)
    const y = cell.year
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
  }

  return (
    <div className="calendar" role="region" aria-label="Calendário de ações">
      {/* Nav */}
      <div className="calendar__nav">
        <button className="calendar__nav-btn" onClick={prevMonth} aria-label="Mês anterior">
          <ChevronLeftIcon />
        </button>
        <span className="calendar__month-title">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button className="calendar__nav-btn" onClick={nextMonth} aria-label="Próximo mês">
          <ChevronRightIcon />
        </button>
      </div>

      {/* Grid */}
      <div className="calendar__grid">
        {/* Weekdays header */}
        <div className="calendar__weekdays" role="row">
          {WEEKDAYS.map(d => (
            <div key={d} className="calendar__weekday" role="columnheader">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="calendar__days" role="grid">
          {cells.map((cell, i) => {
            const key = getDateKey(cell)
            const dayActions = actionsByDate[key] || []
            return (
              <div
                key={i}
                className={`calendar__day ${!cell.isCurrentMonth ? 'other-month' : ''} ${isToday(cell) ? 'today' : ''}`}
                role="gridcell"
                aria-label={`${cell.day} de ${MONTH_NAMES[cell.month % 12]}`}
              >
                <span className="calendar__day-num">{cell.day}</span>
                {dayActions.slice(0, 3).map((action, j) => {
                  const statusKey = normalizeStatus(action.Status)
                  const title = action.Ação || action['Acao'] || 'Ação'
                  return (
                    <button
                      key={j}
                      className={`calendar__event status-${statusKey}`}
                      onClick={() => onEventClick(action)}
                      title={title}
                      aria-label={`Ação: ${title}`}
                    >
                      {title}
                    </button>
                  )
                })}
                {dayActions.length > 3 && (
                  <span
                    className="calendar__event status-planejada"
                    style={{ cursor: 'default' }}
                  >
                    +{dayActions.length - 3} mais
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default CalendarView
