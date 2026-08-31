import { useEffect, useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

const LOGO_URL =
  'https://81673378.delivery.rocketcdn.me/wp-content/themes/flipspaces_v2/assets/images/home/flipspaces-logo-black.png'
const HERO_VIDEO_URL =
  'https://81673378.delivery.rocketcdn.me/wp-content/uploads/2026/07/Flipspaces-mb.mp4'

const CLIENT_LOGOS = [
  { name: 'TCS', src: 'https://81673378.delivery.rocketcdn.me/wp-content/uploads/2026/03/TCS.jpg' },
  { name: 'HCL', src: 'https://81673378.delivery.rocketcdn.me/wp-content/uploads/2026/04/HCL.jpg' },
  { name: 'ICICI', src: 'https://81673378.delivery.rocketcdn.me/wp-content/uploads/2026/04/ICICI.jpg' },
  { name: 'Adani', src: 'https://81673378.delivery.rocketcdn.me/wp-content/uploads/2026/03/Adani.jpg' },
  { name: 'Emirates', src: 'https://81673378.delivery.rocketcdn.me/wp-content/uploads/2026/03/Emirates.jpg' },
  { name: 'Puma', src: 'https://81673378.delivery.rocketcdn.me/wp-content/uploads/2026/04/Puma.jpg' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex items-center h-16 md:h-20">
          <nav className="hidden md:flex items-center gap-8 animate-fade-down stagger-1">
            <button className="flex items-center gap-1 text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity">
              Services
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <a href="#" className="text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity">
              Process
            </a>
            <a href="#" className="text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity">
              Spaces
            </a>
          </nav>

          <a
            href="#top"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 md:gap-12 lg:gap-16 animate-fade-down stagger-2"
          >
            <img src={LOGO_URL} alt="Flipspaces" className="h-6 w-auto" />
          </a>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center ml-auto px-5 py-2.5 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-accent hover:text-brand-dark transition-colors animate-fade-down stagger-3"
          >
            Start Your Project
          </a>

          <button
            className="md:hidden ml-auto z-50 w-10 h-10 relative"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`absolute left-1/2 -translate-x-1/2 top-[6px] w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                menuOpen ? 'rotate-45 translate-y-[5px]' : ''
              }`}
            />
            <span
              className={`absolute left-1/2 -translate-x-1/2 top-[13px] w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                menuOpen ? '-rotate-45 -translate-y-[5px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-brand-cream z-40 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center h-full gap-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <a href="#" onClick={closeMenu} className="text-3xl text-brand-dark tracking-tight">
            Services
          </a>
          <a href="#" onClick={closeMenu} className="text-3xl text-brand-dark tracking-tight">
            Process
          </a>
          <a href="#" onClick={closeMenu} className="text-3xl text-brand-dark tracking-tight">
            Spaces
          </a>
          <a
            href="#contact"
            onClick={closeMenu}
            className="mt-4 inline-flex items-center px-8 py-3.5 bg-brand-dark text-white text-lg tracking-wide rounded-full"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </header>
  )
}

function TrustedBy() {
  return (
    <div className="w-full mt-8 md:mt-10 animate-fade-up stagger-5">
      <p className="text-left text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-6 md:mb-8 font-helvetica-neue">
        Trusted by teams at
      </p>
      <div className="flex flex-wrap items-center justify-start gap-6 md:gap-12 lg:gap-16 animate-fade-up stagger-6">
        {CLIENT_LOGOS.map((logo) => (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            className="h-6 md:h-7 lg:h-8 w-auto grayscale opacity-80"
          />
        ))}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section
      id="top"
      className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream"
    >
      <div className="absolute inset-0">
        <video
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      <div className="relative z-10 flex flex-col items-start max-w-7xl mx-auto pt-28 md:pt-36 px-6 lg:px-8">
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-dark/15 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors mb-5 md:mb-6 animate-fade-up stagger-3"
        >
          <span className="text-sm text-brand-dark">
            1,000+ projects delivered across UAE, USA &amp; India
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-dark" />
        </a>

        <h1 className="text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.05] tracking-tight max-w-4xl font-helvetica-neue animate-fade-up stagger-4">
          One accountable team to design, build,
          <br className="hidden sm:block" /> and deliver your next workspace
        </h1>

        <TrustedBy />
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="font-helvetica-neue">
      <Navbar />
      <Hero />
    </div>
  )
}
