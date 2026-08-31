import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, ChevronDown, MapPin, Mail, Phone, Plus } from 'lucide-react'

const BASE = 'https://81673378.delivery.rocketcdn.me/wp-content'
const LOGO_URL = `${BASE}/themes/flipspaces_v2/assets/images/home/flipspaces-logo-black.png`
const HERO_VIDEO_URL = `${BASE}/uploads/2026/07/Flipspaces-mb.mp4`

const CLIENT_LOGOS = [
  { name: 'TCS', src: `${BASE}/uploads/2026/03/TCS.jpg` },
  { name: 'HCL', src: `${BASE}/uploads/2026/04/HCL.jpg` },
  { name: 'ICICI', src: `${BASE}/uploads/2026/04/ICICI.jpg` },
  { name: 'Adani', src: `${BASE}/uploads/2026/03/Adani.jpg` },
  { name: 'Emirates', src: `${BASE}/uploads/2026/03/Emirates.jpg` },
  { name: 'Puma', src: `${BASE}/uploads/2026/04/Puma.jpg` },
]

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Where We Build', href: '#coverage' },
  { label: 'Spaces', href: '#spaces' },
  { label: 'Insights', href: '#insights' },
  { label: 'FAQ', href: '#faq' },
]

const SERVICES = [
  {
    title: 'Strategy & Design',
    desc: 'Spatial strategy aligned to the outcomes your business actually needs — not just how a floor looks.',
    img: `${BASE}/uploads/2026/05/WhoWeAre_Thumbnail_Final.webp`,
  },
  {
    title: 'Product Supply',
    desc: 'Global sourcing connected directly to your design, drawing from a 200,000+ product catalogue.',
    img: `${BASE}/uploads/2026/02/Product-Supply-2-1.jpg`,
  },
  {
    title: 'Design & Build',
    desc: 'Turnkey execution — architecture, MEP, civil and finishes — delivered under one integrated contract.',
    img: `${BASE}/uploads/2026/02/Design-Build-1-1.jpg`,
  },
  {
    title: 'Project Management',
    desc: 'A structured delivery framework that keeps cost, quality and timeline in lockstep, site by site.',
    img: `${BASE}/uploads/2026/02/Project-Management-2-1.jpg`,
  },
]

const REGIONS = [
  { name: 'UAE', detail: 'Dubai HQ · Business Bay', email: 'uae@flipspaces.com', phone: '+971 50 301 1126' },
  { name: 'India', detail: '20+ cities served', email: 'contact@flipspaces.com', phone: '+91 730 450 3777' },
  { name: 'USA', detail: 'East & West coast projects', email: 'contact@flipspaces.com', phone: '+1 646 982 0586' },
]

const SPACES_FEATURED = [
  {
    name: 'Biophilic Offices',
    img: `${BASE}/uploads/2026/08/Biophilic-green-office-interior-in-India-with-daylight-planting-and-natural-materials-Flipspaces.jpg-1024x819.jpeg`,
  },
  {
    name: 'Modular, Reconfigurable Offices',
    img: `${BASE}/uploads/2026/08/Modular-adaptive-office-in-India-with-demountable-partitions-and-reconfigurable-zones-Flipspaces.jpg-1024x819.jpeg`,
  },
]

const SPACES_LIST = [
  'Coworking Spaces',
  'Hospitality & F&B',
  'Retail',
  'Multi-family Residential',
  'Warehouses & Factories',
  'Educational Institutions',
  'Showrooms',
]

const TESTIMONIALS = [
  {
    quote: 'The VR walkthrough meant there were no surprises on-site — what we approved is exactly what we got.',
    role: 'Workplace Lead, Enterprise IT Services',
  },
  {
    quote: 'Having one team accountable for design, build and furniture cut months off our usual timeline.',
    role: 'Head of Admin, Financial Services',
  },
  {
    quote: 'Cost transparency down to the per-sq-m level made budgeting across multiple sites straightforward.',
    role: 'Facilities Director, Retail Group',
  },
]

const INSIGHTS = [
  {
    title: 'The Evidence for Biophilic Office Design and Why Nature at Work Improves Output',
    href: 'https://flipspaces.com/biophilic-office-design-in-india-evidence/',
    img: `${BASE}/uploads/2026/08/Biophilic-green-office-interior-in-India-with-daylight-planting-and-natural-materials-Flipspaces.jpg-1024x819.jpeg`,
  },
  {
    title: 'Building Offices That Adapt: Modular and Future-Ready Design for Enterprises',
    href: 'https://flipspaces.com/modular-future-ready-office-design-india/',
    img: `${BASE}/uploads/2026/08/Modular-adaptive-office-in-India-with-demountable-partitions-and-reconfigurable-zones-Flipspaces.jpg-1024x819.jpeg`,
  },
  {
    title: 'What Is Turnkey Office Interior Design and Why It Lowers Project Risk',
    href: 'https://flipspaces.com/turnkey-office-interior-design/',
    img: `${BASE}/uploads/2026/02/Design-Build-1-1.jpg`,
  },
]

const FAQS = [
  {
    q: 'How fast can Flipspaces deliver my project?',
    a: 'Most projects run up to 30% faster than traditional design-build timelines. An exact schedule is confirmed once you sign off on your VR walkthrough.',
  },
  {
    q: 'What does the VR walkthrough actually show me?',
    a: 'A millimetre-accurate walkthrough of your finished space — layout, finishes and furniture — before any construction begins.',
  },
  {
    q: 'Is the pricing really all-inclusive?',
    a: 'Yes. Design, build, furniture and MEP coordination are combined into one transparent per-sq-m quote, with no separate vendor markups.',
  },
  {
    q: 'Which cities and countries do you operate in?',
    a: 'We deliver projects across the UAE, USA and India, spanning 20+ cities.',
  },
  {
    q: 'What happens after handover?',
    a: 'You get a move-in-ready space backed by warranty coverage and ongoing facility support.',
  },
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
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm text-brand-dark tracking-wide uppercase py-1 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-brand-dark after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#top" className="absolute left-1/2 -translate-x-1/2 flex items-center animate-fade-down stagger-2">
            <img src={LOGO_URL} alt="Flipspaces" className="h-6 w-auto" />
          </a>

          <a
            href="#cta"
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="text-3xl text-brand-dark tracking-tight"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
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
    <section id="top" className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream">
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
          href="#cta"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-dark/15 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors mb-5 md:mb-6 animate-fade-up stagger-3"
        >
          <span className="text-sm text-brand-dark">1,000+ projects delivered across UAE, USA &amp; India</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-dark" />
        </a>

        <h1 className="text-left text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-dark leading-[1.05] tracking-tight max-w-4xl font-display font-medium animate-fade-up stagger-4">
          One accountable team to design, build,
          <br className="hidden sm:block" /> and deliver your next workspace
        </h1>

        <TrustedBy />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-up stagger-6">
        <ChevronDown className="w-5 h-5 text-brand-dark/50 animate-bounce" />
      </div>
    </section>
  )
}

function SectionHead({
  n,
  eyebrow,
  title,
  dark,
}: {
  n: string
  eyebrow: string
  title: string
  dark?: boolean
}) {
  return (
    <div className="max-w-2xl mb-14 md:mb-16">
      <div className="flex items-center gap-3 mb-5">
        <span className={`text-xs font-medium ${dark ? 'text-brand-accent' : 'text-brand-dark/40'}`}>{n}</span>
        <span className={`h-px w-8 ${dark ? 'bg-brand-accent/50' : 'bg-brand-dark/20'}`} />
        <p className={`text-xs tracking-[0.25em] uppercase ${dark ? 'text-brand-accent' : 'text-brand-dark/50'}`}>
          {eyebrow}
        </p>
      </div>
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight font-display font-medium ${
          dark ? 'text-white' : 'text-brand-dark'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}

function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead n="01" eyebrow="What we do" title="Four disciplines, one accountable team" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {SERVICES.map((s) => (
            <div key={s.title} className="group">
              <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3] shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg text-brand-dark mb-2 font-display font-medium">{s.title}</h3>
              <p className="text-sm text-brand-dark/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Coverage() {
  return (
    <section id="coverage" className="py-24 md:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead n="02" eyebrow="Where we build" title="Delivery on the ground across three countries" dark />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 md:mb-20 pb-16 md:pb-20 border-b border-white/10">
          <div>
            <p className="text-3xl md:text-4xl text-brand-accent font-helvetica-neue">10M+</p>
            <p className="text-sm text-white/50 mt-1">Sq Ft Delivered</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl text-brand-accent font-helvetica-neue">1,000+</p>
            <p className="text-sm text-white/50 mt-1">Projects Executed</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl text-brand-accent font-helvetica-neue">20+</p>
            <p className="text-sm text-white/50 mt-1">Cities</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl text-brand-accent font-helvetica-neue">500+</p>
            <p className="text-sm text-white/50 mt-1">Professionals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {REGIONS.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-white/10 p-8 hover:border-brand-accent/40 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <h3 className="text-xl text-white font-display font-medium">{r.name}</h3>
              </div>
              <p className="text-sm text-white/50 mb-6">{r.detail}</p>
              <div className="space-y-2">
                <a href={`mailto:${r.email}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-brand-accent transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {r.email}
                </a>
                <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-brand-accent transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {r.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Spaces() {
  return (
    <section id="spaces" className="py-24 md:py-32 bg-brand-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead n="03" eyebrow="Spaces we build" title="Built for how your industry actually works" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
          {SPACES_FEATURED.map((s) => (
            <div key={s.name} className="relative rounded-2xl overflow-hidden aspect-[16/11] group">
              <img
                src={s.img}
                alt={s.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 text-white text-lg font-helvetica-neue">{s.name}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {SPACES_LIST.map((s) => (
            <span
              key={s}
              className="px-5 py-2.5 rounded-full border border-brand-dark/15 text-sm text-brand-dark"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead n="04" eyebrow="What clients say" title="Rated 4.5★ from 700+ Google reviews" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.role}
              className="rounded-2xl border border-brand-dark/10 p-8 hover:border-brand-accent/40 hover:shadow-lg transition-all duration-300"
            >
              <span className="block text-4xl text-brand-accent font-display leading-none mb-3">&ldquo;</span>
              <p className="text-brand-dark leading-relaxed mb-6">{t.quote}</p>
              <cite className="text-xs uppercase tracking-wide text-brand-dark/50 not-italic">{t.role}</cite>
            </blockquote>
          ))}
        </div>
        <p className="text-xs text-brand-dark/40 mt-10">Placeholder quotes — swap in verified client testimonials before launch.</p>
      </div>
    </section>
  )
}

function Insights() {
  return (
    <section id="insights" className="py-24 md:py-32 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHead n="05" eyebrow="From the journal" title="Perspectives on the modern workspace" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {INSIGHTS.map((post) => (
            <a key={post.href} href={post.href} target="_blank" rel="noreferrer" className="group block">
              <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base text-brand-dark leading-snug font-display font-medium">{post.title}</h3>
                <ArrowUpRight className="w-4 h-4 text-brand-dark/40 shrink-0 mt-1 group-hover:text-brand-accent transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <SectionHead n="06" eyebrow="Questions" title="Frequently asked questions" />
        <div className="divide-y divide-brand-dark/10">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-6 text-left group"
              >
                <span className="text-base md:text-lg text-brand-dark font-display font-medium group-hover:text-brand-accent transition-colors">
                  {item.q}
                </span>
                <Plus
                  className={`w-5 h-5 text-brand-dark shrink-0 transition-transform duration-300 ${
                    open === i ? 'rotate-45' : ''
                  }`}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '200px' : '0px' }}
              >
                <p className="text-sm text-brand-dark/60 leading-relaxed pb-6">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section id="cta" className="py-24 md:py-32 bg-brand-dark">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-brand-accent mb-4">Get started</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] tracking-tight font-display font-medium mb-10">
          Know your number before you commit
        </h2>

        {submitted ? (
          <p className="text-white/80">Thanks — a project lead will reach out within 24 hours.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
          >
            <input required placeholder="Full name" className="px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 sm:col-span-1" />
            <input required type="email" placeholder="Email" className="px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 sm:col-span-1" />
            <input required type="tel" placeholder="Phone" className="px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 sm:col-span-1" />
            <input placeholder="Carpet area (sq ft)" className="px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 sm:col-span-1" />
            <button
              type="submit"
              className="sm:col-span-2 mt-2 inline-flex items-center justify-center px-8 py-3.5 bg-brand-accent text-brand-dark text-sm tracking-wide uppercase rounded-full hover:bg-white transition-colors"
            >
              Get My Best Quote
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-brand-dark border-t-2 border-brand-accent py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
          <img src={LOGO_URL} alt="Flipspaces" className="h-6 w-auto" style={{ filter: 'invert(1) brightness(2)' }} />
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-white/60 hover:text-brand-accent transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-white/10 text-sm text-white/40">
          <p>Single Business Tower, Sheikh Zayed Rd, Business Bay, 35th Floor, Dubai, UAE</p>
          <p>© {new Date().getFullYear()} Flipspaces. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="font-helvetica-neue">
      <Navbar />
      <Hero />
      <Services />
      <Coverage />
      <Spaces />
      <Testimonials />
      <Insights />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
