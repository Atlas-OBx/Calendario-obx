import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const STATUS_OPTIONS = [
  'Planejada',
  'Confirmada',
  'Em andamento',
  'Realizada',
  'Cancelada',
]

const CIDADE_OPTIONS = [
  'Belém/PA',
  'Ananindeua/PA',
  'Marituba/PA',
  'Castanhal/PA',
  'Marabá/PA',
  'Santarém/PA',
  'Altamira/PA',
  'Parauapebas/PA',
  'Barcarena/PA',
  'Abaetetuba/PA',
  'Manaus/AM',
  'São Paulo/SP',
  'Rio de Janeiro/RJ',
  'Brasília/DF',
  'Salvador/BA',
  'Fortaleza/CE',
  'Recife/PE',
  'Porto Alegre/RS',
  'Belo Horizonte/MG',
  'Curitiba/PR',
  'Online / Remoto',
  'Outra cidade…',
]

const EMPTY_FORM = {
  titulo: '',
  data: '',
  horario: '',
  cidade: '',
  local: '',
  status: 'Planejada',
  descricao: '',
  responsavel: '',
}

function ActionForm({ action, onSaved, onCancel }) {
  const isEditing = !!action

  const initCidade = action?.cidade || ''
  const cidadeInList = CIDADE_OPTIONS.includes(initCidade) || initCidade === ''
  const [cidadeOther, setCidadeOther] = useState(!cidadeInList)

  const [form, setForm] = useState(isEditing ? {
    titulo:      action.titulo      || '',
    data:        action.data        || '',
    horario:     action.horario     || '',
    cidade:      initCidade,
    local:       action.local       || '',
    status:      action.status      || 'Planejada',
    descricao:   action.descricao   || '',
    responsavel: action.responsavel || '',
  } : EMPTY_FORM)

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleCidadeSelect(e) {
    const value = e.target.value
    if (value === 'Outra cidade…') {
      setCidadeOther(true)
      setForm(prev => ({ ...prev, cidade: '' }))
    } else {
      setCidadeOther(false)
      setForm(prev => ({ ...prev, cidade: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.titulo.trim()) { setError('O título é obrigatório.'); return }
    setError('')
    setLoading(true)
    try {
      if (isEditing) {
        const { error: err } = await supabase.from('acoes').update(form).eq('id', action.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('acoes').insert([form])
        if (err) throw err
      }
      onSaved()
    } catch (err) {
      setError(`Erro ao salvar: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <h3 className="admin-form__title">
        {isEditing ? 'Editar ação' : 'Nova ação'}
      </h3>

      <div className="admin-form__grid">

        {/* Título — linha inteira */}
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="af-titulo">Título *</label>
          <input
            id="af-titulo" name="titulo" type="text"
            placeholder="Nome da ação"
            value={form.titulo} onChange={handleChange}
            required disabled={loading}
          />
        </div>

        {/* Data */}
        <div className="admin-form__field">
          <label htmlFor="af-data">Data</label>
          <input
            id="af-data" name="data" type="date"
            value={form.data} onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Horário — texto livre */}
        <div className="admin-form__field">
          <label htmlFor="af-horario">Horário</label>
          <input
            id="af-horario" name="horario" type="text"
            placeholder="Ex: 14h00"
            value={form.horario} onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Cidade — select */}
        <div className="admin-form__field">
          <label htmlFor="af-cidade">Cidade</label>
          {!cidadeOther ? (
            <select
              id="af-cidade"
              value={form.cidade}
              onChange={handleCidadeSelect}
              disabled={loading}
            >
              <option value="">— Selecionar —</option>
              {CIDADE_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : (
            <div className="admin-form__other-wrap">
              <input
                id="af-cidade" name="cidade" type="text"
                placeholder="Digite a cidade"
                value={form.cidade} onChange={handleChange}
                disabled={loading} autoFocus
              />
              <button
                type="button" className="admin-form__other-back"
                onClick={() => { setCidadeOther(false); setForm(prev => ({ ...prev, cidade: '' })) }}
              >← lista</button>
            </div>
          )}
        </div>

        {/* Local */}
        <div className="admin-form__field">
          <label htmlFor="af-local">Local</label>
          <input
            id="af-local" name="local" type="text"
            placeholder="Ex: Centro Cultural"
            value={form.local} onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Status */}
        <div className="admin-form__field">
          <label htmlFor="af-status">Status</label>
          <select
            id="af-status" name="status"
            value={form.status} onChange={handleChange}
            disabled={loading}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Responsável — coluna 2, abaixo de Local */}
        <div className="admin-form__field">
          <label htmlFor="af-responsavel">Responsável</label>
          <input
            id="af-responsavel" name="responsavel" type="text"
            placeholder="Nome ou equipe"
            value={form.responsavel} onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Descrição — linha inteira */}
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="af-descricao">Descrição</label>
          <textarea
            id="af-descricao" name="descricao" rows={3}
            placeholder="Detalhes sobre a ação…"
            value={form.descricao} onChange={handleChange}
            disabled={loading}
          />
        </div>

      </div>

      {error && <p className="admin-form__error" role="alert">{error}</p>}

      <div className="admin-form__actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button id="af-submit" type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

export default ActionForm
