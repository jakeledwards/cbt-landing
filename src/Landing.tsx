import React, { useState, useEffect, useRef } from 'react'

const PRICE = import.meta.env.VITE_FOUNDING_PRICE || '59'
const WAITLIST_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT || ''

function useReveal() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el) } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function RevealSection({ className, id, children }: { className?: string; id?: string; children: React.ReactNode }) {
  const ref = useReveal()
  return <section ref={ref} className={`reveal ${className || ''}`} id={id}>{children}</section>
}

const IconPen = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)
const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34"/><path d="M20.54 5.46A19.92 19.92 0 003.82 21.34"/><path d="M21 3c-3 0-7.5 1.5-10 4.5S7 16 7 16"/>
  </svg>
)

export default function Landing(){
  const [email,setEmail]=useState('')
  const [goal,setGoal]=useState('Anxiety')
  const [platform,setPlatform]=useState('Web')
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle')

  const submit=async(e:any)=>{
    e?.preventDefault()
    if(!email.match(/@/)){ setStatus('error'); return }
    setStatus('loading')
    try{
      const res = await fetch(WAITLIST_ENDPOINT || '/api/waitlist', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,goal,platform})
      })
      if(res.ok){ setStatus('success'); setEmail('') } else setStatus('error')
    }catch(err){ setStatus('error') }
  }

  return (
    <div className="landing-root">
      <nav className="nav">
        <a className="nav-brand" href="/">Reframe<span>.</span></a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#hipaa">Privacy</a></li>
        </ul>
      </nav>

      <header className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Early Access Open</div>
          <h1>Turn racing thoughts into calm, actionable reframes</h1>
          <p className="sub">Structured thought records. Warm AI reframes. Therapist-ready summaries. Privacy-first.</p>

          <form className="cta-form" onSubmit={submit}>
            <input aria-label="email" placeholder="you@domain.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <div className="chips">
              <select value={goal} onChange={e=>setGoal(e.target.value)}>
                <option>Anxiety</option>
                <option>ADHD</option>
                <option>Trauma</option>
                <option>Mood</option>
              </select>
              <select value={platform} onChange={e=>setPlatform(e.target.value)}>
                <option>iOS</option>
                <option>Android</option>
                <option>Web</option>
              </select>
            </div>
            <div className="cta-row">
              <button className="primary" type="submit">Join early access</button>
              <a className="secondary" href="#how">See how it works</a>
            </div>
            <p className="incentive">Free 30-day premium + founding price ${PRICE}/yr (locked)</p>
            {status==='success' && <p className="success">Thanks — check your inbox!</p>}
            {status==='error' && <p className="error">Something went wrong. Try again.</p>}
          </form>
        </div>
        <div className="hero-mock">
          <div className="mock-card">
            <div className="mock-label">Thought Record</div>
            <div className="thought">"I always mess up interviews — I'll never get hired."</div>
            <div className="reframe">
              <div className="reframe-label">AI Reframe</div>
              What evidence supports this? You prepared thoroughly and have been hired before. Alternative thought: <em>"I can learn from each interview and improve."</em>
            </div>
          </div>
        </div>
      </header>

      <RevealSection className="trust-row">
        <div className="advisor">Clinical advisor: Dr. Placeholder</div>
        <div className="badges">
          <span>Privacy-first</span>
          <span>Not a replacement for therapy</span>
          <a href="#hipaa">HIPAA-aligned*</a>
        </div>
        <div className="waitlist">Waitlist: <span id="count">--</span></div>
      </RevealSection>

      <RevealSection className="diffs">
        <h3>Designed for measurable CBT work</h3>
        <ul>
          <li><strong>Structured thought records</strong> with distortions + reframes</li>
          <li><strong>Weekly summaries</strong> + optional PHQ-9/GAD-7 trends</li>
          <li><strong>ADHD-friendly capture</strong> (voice-to-text, 30s entries, reminders)</li>
          <li><strong>Therapist collaboration</strong> (weekly PDF, revocable share)</li>
          <li><strong>Trauma-safe grounding</strong> mode</li>
        </ul>
      </RevealSection>

      <RevealSection className="features" id="how">
        <div className="col">
          <div className="icon"><IconPen /></div>
          <h4>Thought records</h4>
          <p>Teaching cards that walk you through evidence, automatic distortions detection, and warm AI reframes.</p>
        </div>
        <div className="col">
          <div className="icon"><IconChart /></div>
          <h4>Progress & exports</h4>
          <p>Weekly insights, PHQ-9/GAD-7 trends, and easy PDF exports for therapists.</p>
        </div>
        <div className="col">
          <div className="icon"><IconShield /></div>
          <h4>Safety & privacy</h4>
          <p>End-to-end encryption, no model training without opt-in, and a local-only toggle option.</p>
        </div>
        <div className="col">
          <div className="icon"><IconLeaf /></div>
          <h4>Grounding</h4>
          <p>Trauma-sensitive grounding exercises and quick-capture safety flow.</p>
        </div>
      </RevealSection>

      <RevealSection className="pricing" id="pricing">
        <h3>Pricing</h3>
        <div className="pricing-grid">
          <div className="plan">
            <div className="name">Free</div>
            <div className="desc">Daily journaling + basic prompts. Everything you need to get started with structured CBT work.</div>
          </div>
          <div className="plan premium">
            <div className="name">Founding Premium</div>
            <div className="desc">${PRICE}/yr — AI reframes, advanced CBT flows, weekly summaries, therapist export. Price locked forever for early members.</div>
          </div>
        </div>
      </RevealSection>

      <footer className="site-footer">
        <div className="links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="disclaimer">Not a replacement for therapy. If in crisis, contact emergency services. HIPAA/PHIPA note (placeholder). You own your data; opt-out available.</div>
      </footer>
    </div>
  )
}
