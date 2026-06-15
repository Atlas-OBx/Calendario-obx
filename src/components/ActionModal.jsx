import { useEffect } from 'react'

function ActionModal({ action, onClose }) {
  const data = action.Data || action.data || '—'
  const horario = action['Horário'] || action.Horario || action.horario || ''
  const nome = action['Ação'] || action.Acao || action['Nome da Ação'] || action.Nome || action.nome || 'Sem título'
  const cidade = action.Cidade || action.cidade || '—'
  const local = action.Local || action.local || '—'
  const status = action.Status || action.status || '—'
  const descricao = action['Descrição'] || action.Descricao || action.descricao || ''
  const responsavel = action['Responsável'] || action.Responsavel || action.responsavel || ''

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>

        <p className="modal__date">{data}{horario ? ` · ${horario}` : ''}</p>
        <h2 className="modal__name">{nome}</h2>

        <div className="modal__fields">
          <div className="modal__field">
            <label>Cidade</label>
            <span>{cidade}</span>
          </div>
          <div className="modal__field">
            <label>Local</label>
            <span>{local}</span>
          </div>
          <div className="modal__field">
            <label>Status</label>
            <span>{status}</span>
          </div>
          {responsavel && (
            <div className="modal__field">
              <label>Responsável</label>
              <span>{responsavel}</span>
            </div>
          )}
          {descricao && (
            <div className="modal__field">
              <label>Descrição</label>
              <span>{descricao}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActionModal
