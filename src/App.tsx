import Nav from '@components/Nav'
import Hero from '@sections/Hero'
import SelectedWork from '@sections/SelectedWork'
import Achievements from '@sections/Achievements'
import Contact from '@sections/Contact'
import Footer from '@components/Footer'
import MobileCTA from '@components/MobileCTA'

export default function App() {
  return (
    <main className="text-[color:var(--color-bone)] min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <SelectedWork />
      <Achievements />
      <Contact />
      <Footer />
      <MobileCTA />
    </main>
  )
}
