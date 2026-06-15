
function Hero({ onAgendaClick }) {
  return (
    <section id="inicio" className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">
          Calendário de Ações <span>OBX</span>
        </h1>
        <p className="hero__subtitle">
          Acompanhe as atividades, encontros e agendas do Observatório das Baixadas.
        </p>
        <a
          href="#agenda"
          className="btn-primary"
          onClick={e => { e.preventDefault(); onAgendaClick() }}
          id="hero-agenda-btn"
        >
          Ver agenda
        </a>
      </div>
    </section>
  )
}

export default Hero
