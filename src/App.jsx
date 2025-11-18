import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { useInView } from 'react-intersection-observer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import Lenis from 'lenis'
import { ArrowDown, Stars, ChevronRight, Mail, Github, Linkedin } from 'lucide-react'

// Register GSAP plugins
if (typeof window !== 'undefined' && gsap) {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
}

const ChapterTitle = ({ index, title, subtitle }) => (
  <div className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 bg-slate-900/70 border-b border-white/5">
    <div className="max-w-6xl mx-auto py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold shadow-lg shadow-fuchsia-500/20">{index}</div>
        <div>
          <p className="text-slate-300 text-xs uppercase tracking-widest">Chapter {index}</p>
          <h3 className="text-white font-semibold leading-tight">{title}</h3>
        </div>
      </div>
      <p className="text-slate-400 text-sm hidden sm:block">{subtitle}</p>
    </div>
  </div>
)

const ProgressNav = () => {
  const sections = [
    { id: 'hero', label: 'The Beginning' },
    { id: 'skills', label: 'The Learning' },
    { id: 'projects', label: 'The Creating' },
    { id: 'contact', label: 'The Future' }
  ]

  const [active, setActive] = useState('hero')

  useEffect(() => {
    sections.forEach(s => {
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => {
          if (self.isActive) setActive(s.id)
        }
      })
    })
  }, [])

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => {
            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className={`group relative flex items-center gap-3`}
          aria-label={s.label}
        >
          <div className={`h-10 w-1 rounded-full transition-all ${active === s.id ? 'bg-fuchsia-400' : 'bg-slate-600/40'}`}></div>
          <span className={`pointer-events-none absolute right-5 whitespace-nowrap rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200 opacity-0 shadow-lg shadow-fuchsia-500/10 transition group-hover:opacity-100`}>{s.label}</span>
        </button>
      ))}
    </div>
  )
}

const MagneticButton = ({ children, className = '', ...props }) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const strength = 40
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate(${x / strength}px, ${y / strength}px)`
    }
    const reset = () => {
      el.style.transform = 'translate(0, 0)'
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', reset)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', reset)
    }
  }, [])

  return (
    <button ref={ref} className={`relative inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 px-6 py-3 text-white shadow-xl shadow-fuchsia-500/30 transition will-change-transform ${className}`} {...props}>
      {children}
    </button>
  )
}

const Hero = () => {
  useLenis()
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.hero-title', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1 className="hero-title text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Atharva Joshi
        </motion.h1>
        <motion.p className="hero-subtitle mt-4 text-lg md:text-2xl text-slate-200/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          Building cinematic web experiences that tell a story
        </motion.p>
        <div className="hero-cta mt-10 flex items-center gap-4">
          <MagneticButton onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore the journey <ChevronRight size={18} />
          </MagneticButton>
          <a href="#projects" className="text-slate-300 hover:text-white inline-flex items-center gap-2">
            <ArrowDown size={18} /> Scroll
          </a>
        </div>
      </div>
    </section>
  )
}

const ChapterDivider = ({ text }) => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%'
        }
      })
    })
    return () => ctx.revert()
  }, [])
  return (
    <div className="py-16">
      <div ref={ref} className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-4 text-center text-slate-200 shadow-lg shadow-fuchsia-500/10">
        {text}
      </div>
    </div>
  )
}

const ParallaxImage = ({ src, depth = 10, className = '' }) => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width - 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `translate3d(${relX * depth}px, ${relY * depth}px, 0)`
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [depth])
  return <img ref={ref} src={src} alt="" className={`will-change-transform ${className}`} />
}

const Skills = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  const skills = [
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'GSAP', level: 88 },
    { name: 'Three.js', level: 75 },
    { name: 'Framer Motion', level: 92 },
    { name: 'Node.js', level: 80 }
  ]

  return (
    <section id="skills" className="relative bg-slate-950 py-28">
      <ChapterTitle index={2} title="The Learning" subtitle="Crafting skills through curiosity and grit" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Skills that orbit my craft</h2>
            <p className="mt-4 text-slate-300">Each orb carries a story — lessons learned, bugs conquered, late-night breakthroughs.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              {skills.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 120 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 backdrop-blur hover:border-fuchsia-400/40 hover:shadow-fuchsia-500/20 shadow-lg"
                >
                  <div className="text-white font-semibold">{s.name}</div>
                  <div className="mt-2 h-2 w-48 rounded-full bg-slate-700/60">
                    <motion.div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500" initial={{ width: 0 }} animate={inView ? { width: `${s.level}%` } : {}} transition={{ duration: 1.2, delay: i * 0.12 }} />
                  </div>
                  <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition pointer-events-none" style={{ background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(168,85,247,0.2), transparent 40%)' }}></div>
                </motion.div>
              ))}
            </div>
          </div>
          <div ref={ref} className="relative">
            <div className="aspect-video w-full rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-900/30 to-indigo-900/30 p-6 shadow-xl">
              <p className="text-slate-300">Interactive constellation coming soon — nodes connect as you hover and drag.</p>
            </div>
          </div>
        </div>
      </div>
      <ChapterDivider text="Every line of code is a frame in the film of a product." />
    </section>
  )
}

const Projects = () => {
  const cards = [
    { title: 'Cinematic Portfolio', desc: 'A narrative-driven web experience with GSAP + Three.js', tag: 'Featured' },
    { title: 'Realtime Visualizer', desc: 'Audio-reactive shaders and particles', tag: 'WebGL' },
    { title: 'Design System', desc: 'Accessible, animated components for the modern web', tag: 'UI/UX' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 60%'
        }
      })
      tl.from('.project-card', { y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" className="relative bg-slate-950 py-28">
      <ChapterTitle index={3} title="The Creating" subtitle="Selected works and experiments" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="project-card group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur transition hover:border-fuchsia-400/40 hover:shadow-fuchsia-500/20">
              <div className="text-xs text-fuchsia-300/80">{c.tag}</div>
              <h3 className="mt-2 text-xl font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-slate-300">{c.desc}</p>
              <div className="mt-6 h-40 rounded-2xl bg-gradient-to-br from-fuchsia-900/30 to-indigo-900/30" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at var(--x) var(--y), rgba(168,85,247,0.15), transparent 40%)' }}></div>
            </div>
          ))}
        </div>
      </div>
      <ChapterDivider text="Creation is a loop — imagine, build, refine, repeat." />
    </section>
  )
}

const Contact = () => {
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="relative bg-slate-950 py-28">
      <ChapterTitle index={4} title="The Future" subtitle="Let’s collaborate on something remarkable" />
      <div className="mx-auto max-w-3xl px-6">
        <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
          <div className="grid gap-4">
            <input className="rounded-xl bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-fuchsia-500/50" placeholder="Your name" required />
            <input className="rounded-xl bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-fuchsia-500/50" placeholder="Email" type="email" required />
            <textarea className="min-h-[140px] rounded-xl bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-fuchsia-500/50" placeholder="Tell me about your idea" />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <MagneticButton type="submit">Send Message</MagneticButton>
            <div className="flex gap-3 text-slate-300">
              <a className="hover:text-white" href="mailto:hello@example.com" aria-label="Email"><Mail size={20} /></a>
              <a className="hover:text-white" href="#" aria-label="GitHub"><Github size={20} /></a>
              <a className="hover:text-white" href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>
          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-fuchsia-300">
                Thanks! Your message is taking off.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
      <div className="mt-12 text-center text-slate-500">© {new Date().getFullYear()} Atharva Joshi</div>
    </section>
  )
}

function App() {
  useLenis()
  useEffect(() => {
    const handleMove = (e) => {
      document.querySelectorAll('.group').forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        card.style.setProperty('--x', `${x}px`)
        card.style.setProperty('--y', `${y}px`)
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className="bg-slate-950 text-slate-100 selection:bg-fuchsia-500/40 selection:text-white">
      <ProgressNav />
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </div>
  )
}

export default App
