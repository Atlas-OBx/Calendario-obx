import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import LoginPage from './LoginPage'
import ActionForm from '../components/admin/ActionForm'
import obxLogo from '/OBX_LOGO_OFICIAL.png'

const STATUS_COLORS = {
  confirmada:    { bg: '#e6f7ee', color: '#1a9a50' },
  realizada:     { bg: '#f0f0f0', color: '#666' },
  cancelada:     { bg: '#ffeaea', color: '#cc3333' },
  'em andamento':{ bg: '#fff0dc', color: '#c47700' },
  planejada:     { bg: '#e8f0fe', color: '#3366cc' },
}

function getStatusStyle(status) {
  const key = (status || '').toLowerCase()
  return STATUS_COLORS[key] || STATUS_COLORS['planejada']
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [acoes, setAcoes] = useState([])
  const [loadingAcoes, setLoadingAcoes] = useState(true)
  const [formMode, setFormMode] = useState(null) // null | 'create' | 'edit'
  const [editingAction, setEditingAction] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const fetchAcoes = useCallback(async () => {
    setLoadingAcoes(true)
    const { data, error: err } = await supabase
      .from('acoes')
      .select('*')
      .order('data', { ascending: true })
    if (err) {
      setError('Erro ao carregar ações: ' + err.message)
    } else {
      setAcoes(data || [])
    }
    setLoadingAcoes(false)
  }, [])

  useEffect(() => {
    if (user) fetchAcoes()
  }, [user, fetchAcoes])

  async function handleDelete(id) {
    if (!window.confirm('Deseja excluir esta ação? Esta operação não pode ser desfeita.')) return
    setDeletingId(id)
    const { error: err } = await supabase.from('acoes').delete().eq('id', id)
    if (err) {
      setError('Erro ao excluir: ' + err.message)
    } else {
      setAcoes(prev => prev.filter(a => a.id !== id))
    }
    setDeletingId(null)
  }

  function openCreate() {
    setEditingAction(null)
    setFormMode('create')
  }

  function openEdit(action) {
    setEditingAction(action)
    setFormMode('edit')
  }

  function closeForm() {
    setFormMode(null)
    setEditingAction(null)
  }

  function handleSaved() {
    closeForm()
    fetchAcoes()
  }

  // Sessão ainda carregando
  if (authLoading) {
    return (
      <div className="admin-loading">
        <span className="agenda__spinner" />
        <p>Verificando sessão…</p>
      </div>
    )
  }

  // Não autenticado → tela de login
  if (!user) return <LoginPage />

  // Autenticado → painel
  return (
    <div className="admin-page">
      {/* Header ADM */}
      <header className="admin-header">
        <div className="admin-header__inner">
          <img src={obxLogo} alt="OBX" className="admin-header__logo" />
          <div className="admin-header__right">
            <span className="admin-header__email">{user.email}</span>
            <button
              id="admin-signout"
              className="admin-btn admin-btn--outline"
              onClick={signOut}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Corpo */}
      <main className="admin-body">
        {/* Modal de formulário */}
        {formMode && (
          <div className="admin-modal-overlay" onClick={closeForm}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <ActionForm
                action={editingAction}
                onSaved={handleSaved}
                onCancel={closeForm}
              />
            </div>
          </div>
        )}

        {/* Voltar ao site */}
        <div className="admin-back-wrap">
          <a
            id="admin-back-to-site"
            href="/"
            className="admin-back-link"
            onClick={e => { e.preventDefault(); window.location.hash = '' }}
          >
            <ArrowLeftIcon /> Voltar ao site
          </a>
        </div>

        {/* Topo da listagem */}
        <div className="admin-body__top">
          <div>
            <h1 className="admin-body__title">Gerenciar ações</h1>
            <p className="admin-body__subtitle">
              {acoes.length} {acoes.length === 1 ? 'ação cadastrada' : 'ações cadastradas'}
            </p>
          </div>
          <button
            id="admin-nova-acao"
            className="admin-btn admin-btn--primary"
            onClick={openCreate}
          >
            <PlusIcon /> Nova ação
          </button>
        </div>

        {error && (
          <p className="admin-error" role="alert">{error}</p>
        )}

        {/* Tabela de ações */}
        {loadingAcoes ? (
          <div className="admin-state">
            <span className="agenda__spinner" />
            <p>Carregando ações…</p>
          </div>
        ) : acoes.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhuma ação cadastrada ainda.</p>
            <button className="admin-btn admin-btn--primary" onClick={openCreate}>
              Criar primeira ação
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Título</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {acoes.map(acao => {
                  const style = getStatusStyle(acao.status)
                  return (
                    <tr key={acao.id} className={deletingId === acao.id ? 'admin-table__row--deleting' : ''}>
                      <td className="admin-table__date">{formatDate(acao.data)}</td>
                      <td className="admin-table__titulo">
                        <span className="admin-table__titulo-text">{acao.titulo}</span>
                        {acao.horario && (
                          <span className="admin-table__horario">{acao.horario}</span>
                        )}
                      </td>
                      <td>{acao.cidade || '—'}</td>
                      <td>
                        <span
                          className="admin-badge"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {acao.status || 'Planejada'}
                        </span>
                      </td>
                      <td>{acao.responsavel || '—'}</td>
                      <td className="admin-table__actions">
                        <button
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                          onClick={() => openEdit(acao)}
                          aria-label={`Editar ${acao.titulo}`}
                        >
                          <EditIcon /> Editar
                        </button>
                        <button
                          className="admin-btn admin-btn--sm admin-btn--danger"
                          onClick={() => handleDelete(acao.id)}
                          disabled={deletingId === acao.id}
                          aria-label={`Excluir ${acao.titulo}`}
                        >
                          <TrashIcon />
                          {deletingId === acao.id ? '…' : 'Excluir'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export default AdminPage
