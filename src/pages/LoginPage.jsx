import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import obxLogo from '/OBX_LOGO_OFICIAL_-_Preto.png'

function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError('E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <img src={obxLogo} alt="OBX — Observatório das Baixadas" className="login-logo login-logo--lg" />

        {/* Títulos */}
        <h1 className="login-title">Área Administrativa</h1>
        <p className="login-subtitle">Acesse para gerenciar as ações do calendário.</p>

        {/* Formulário */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="login-error" role="alert">{error}</p>
          )}

          <button
            id="login-submit"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        {/* Voltar */}
        <a
          href="#"
          className="login-back"
          onClick={e => { e.preventDefault(); window.location.hash = '' }}
        >
          ← Voltar ao site
        </a>
      </div>
    </div>
  )
}

export default LoginPage
