function InstagramIcon() {
  return (
    <svg className="footer__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="footer__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function Footer() {
  return (
    <footer id="contato" className="footer">
      <div className="footer__inner">
        <div className="footer__item">
          <InstagramIcon />
          <a
            href="https://www.instagram.com/observatoriodasbaixadas"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
            id="footer-instagram"
          >
            @observatoriodasbaixadas
          </a>
        </div>

        <div className="footer__item">
          <EmailIcon />
          <a
            href="mailto:administrativo@observatoriodasbaixadas.org.br"
            className="footer__link"
            id="footer-email"
          >
            administrativo@observatoriodasbaixadas.org.br
          </a>
        </div>

        <div className="footer__item">
          <span>© {new Date().getFullYear()} Observatório das Baixadas - Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
