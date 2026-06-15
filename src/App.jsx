import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Agenda from './components/Agenda'
import About from './components/About'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'

function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

function App() {
  const hash = useHash()

  // Rota /admin
  if (hash === '#/admin') {
    return <AdminPage />
  }

  // Site público
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 60
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      <Header />
      <main>
        <Hero onAgendaClick={() => scrollTo('agenda')} />
        <Agenda />
        <About />
      </main>
      <Footer />
    </>
  )
}

export default App
