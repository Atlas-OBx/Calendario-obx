import { useState, useEffect } from 'react'
import obxLogo from '/OBX_LOGO_OFICIAL.png'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 60
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  // Fecha menu ao redimensionar para desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Trava scroll do body quando menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className="header">
      <div className="header__inner">
        <img src={obxLogo} alt="OBX — Observatório das Baixadas" className="header__logo" />

        {/* Nav desktop */}
        <nav className="header__nav" aria-label="Navegação principal">
          <a href="#agenda" onClick={e => { e.preventDefault(); scrollTo('agenda') }}>Agenda</a>
          <a href="#sobre"  onClick={e => { e.preventDefault(); scrollTo('sobre') }}>Sobre</a>
          <a href="#contato" onClick={e => { e.preventDefault(); scrollTo('contato') }}>Contato</a>
          <a
            href="#/admin"
            id="header-login-btn"
            className="header__login-btn"
            onClick={() => { window.location.hash = '/admin'; setMenuOpen(false) }}
          >
            Entrar
          </a>
        </nav>

        {/* Hambúrguer — só mobile */}
        <button
          id="header-menu-toggle"
          className={`header__hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Drawer mobile */}
      {menuOpen && (
        <nav className="header__drawer" aria-label="Menu mobile">
          <a href="#agenda" onClick={e => { e.preventDefault(); scrollTo('agenda') }}>Agenda</a>
          <a href="#sobre"  onClick={e => { e.preventDefault(); scrollTo('sobre') }}>Sobre</a>
          <a href="#contato" onClick={e => { e.preventDefault(); scrollTo('contato') }}>Contato</a>
          <a
            href="#/admin"
            className="header__drawer-login"
            onClick={() => { window.location.hash = '/admin'; setMenuOpen(false) }}
          >
            Entrar no painel
          </a>
        </nav>
      )}
    </header>
  )
}

export default Header
