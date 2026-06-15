import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { normalizeStatus } from '../utils'
import CalendarView from './CalendarView'
import EventRow from './ActionCard'
import ActionModal from './ActionModal'

const VIEWS = ['lista', 'calendario']

/**
 * Mapeia uma ação do Supabase para o formato esperado pelos componentes existentes
 * (ActionCard, ActionModal, CalendarView).
 */
function mapAcao(acao) {
  return {
    ...acao,
    // Campos que os componentes legados esperam
    'Ação':       acao.titulo,
    Data:         acao.data,
    'Horário':    acao.horario,
    Cidade:       acao.cidade,
    Local:        acao.local,
    Status:       acao.status,
    'Descrição':  acao.descricao,
    Responsável:  acao.responsavel,
  }
}

function Agenda() {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null)
  const [view, setView] = useState('lista')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')

  useEffect(() => {
    async function loadAcoes() {
      const { data, error: err } = await supabase
        .from('acoes')
        .select('*')
        .order('data', { ascending: true })

      if (err) {
        setError('Erro ao carregar agenda: ' + err.message)
      } else {
        setActions((data || []).map(mapAcao))
      }
      setLoading(false)
    }
    loadAcoes()
  }, [])

  const statusOptions = [
    'todos',
    ...Array.from(new Set(actions.map(a => normalizeStatus(a.Status)).filter(Boolean))),
  ]

  const filtered = actions.filter(a => {
    const nome   = (a['Ação'] || '').toLowerCase()
    const cidade = (a.Cidade || '').toLowerCase()
    const matchSearch = !search || nome.includes(search.toLowerCase()) || cidade.includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || normalizeStatus(a.Status) === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <section className="agenda" id="agenda" aria-label="Agenda de ações">
      <div className="agenda__header">
        <h2 className="agenda__title">Agenda de Ações</h2>
        <p className="agenda__subtitle">Confira a agenda de ações, eventos e atividades do Observatório das Baixadas nos territórios.</p>
      </div>

      <div className="agenda__controls">
        {/* Search */}
        <div className="agenda__search-wrap">
          <SearchIcon />
          <input
            id="agenda-search"
            className="agenda__search"
            type="search"
            placeholder="Buscar ação ou cidade…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar ações"
          />
        </div>

        {/* Status filter */}
        <select
          id="agenda-filter-status"
          className="agenda__select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          aria-label="Filtrar por status"
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>
              {s === 'todos' ? 'Todos os status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* View toggle */}
        <div className="agenda__view-toggle" role="group" aria-label="Alternar visualização">
          {VIEWS.map(v => (
            <button
              key={v}
              id={`agenda-view-${v}`}
              className={`agenda__view-btn ${view === v ? 'active' : ''}`}
              onClick={() => setView(v)}
              aria-pressed={view === v}
            >
              {v === 'lista' ? <ListIcon /> : <CalendarIcon />}
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="agenda__body">
        {loading && (
          <div className="agenda__state">
            <span className="agenda__spinner" aria-label="Carregando" />
            <p>Carregando agenda…</p>
          </div>
        )}

        {error && (
          <div className="agenda__state agenda__state--error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="agenda__state">
            <p>Nenhuma ação encontrada.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            {view === 'lista' && (
              <div className="agenda__list">
                {filtered.map((action, i) => (
                  <EventRow
                    key={action.id || i}
                    action={action}
                    onClick={() => setSelectedAction(action)}
                  />
                ))}
              </div>
            )}

            {view === 'calendario' && (
              <CalendarView
                actions={filtered}
                onEventClick={setSelectedAction}
              />
            )}
          </>
        )}
      </div>

      {selectedAction && (
        <ActionModal
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
        />
      )}
    </section>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export default Agenda
