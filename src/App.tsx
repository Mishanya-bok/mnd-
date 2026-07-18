import Nav from '@components/Nav'
import Hero from '@sections/Hero'
import SelectedWork from '@sections/SelectedWork'
import Studio from '@sections/Studio'
import Contact from '@sections/Contact'
import Footer from '@components/Footer'
import MobileCTA from '@components/MobileCTA'

export default function App() {
  return (
    <main className="bg-[color:var(--color-crimson)] text-[color:var(--color-bone)] min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <SelectedWork />
      <Studio />
      <Contact />
      <Footer />
      <MobileCTA />
    </main>
  )
}
