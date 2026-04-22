import { lazy, Suspense } from 'react'
import Navbar from '@components/Navbar'
import Hero from '@sections/Hero'
import FeaturedProjects from '@sections/FeaturedProjects'
import MobileCTA from '@components/MobileCTA'

const About       = lazy(() => import('@sections/About'))
const Services    = lazy(() => import('@sections/Services'))
const Process     = lazy(() => import('@sections/Process'))
const WhyUs       = lazy(() => import('@sections/WhyUs'))
const Showreel    = lazy(() => import('@sections/Showreel'))
const Contact     = lazy(() => import('@sections/Contact'))
const Footer      = lazy(() => import('@sections/Footer'))

export default function App() {
  return (
    <main className="bg-[var(--color-bg)] text-[var(--color-white)] min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <Suspense fallback={null}>
        <About />
        <Services />
        <Process />
        <WhyUs />
        <Showreel />
        <Contact />
        <Footer />
      </Suspense>
      <MobileCTA />
    </main>
  )
}
