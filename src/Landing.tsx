import React, { useState } from 'react'

const PRICE = process.env.VITE_FOUNDING_PRICE || '59'
const WAITLIST_ENDPOINT = process.env.VITE_WAITLIST_ENDPOINT || ''

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
      <header className="hero">
        <div className="hero-inner">
          <h1>Turn racing thoughts into calm, actionable reframes</h1>
          <p className="sub">Structured thought records · Warm AI reframes · Therapist-ready summaries · Privacy-first</p>

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
              <button className="primary">Join early access</button>
              <a className="secondary" href="#how">See how it works</a>
            </div>
            <p className="incentive">Free 30-day premium + founding price ${PRICE}/yr (locked)</p>
            {status==='success' && <p className="success">Thanks — check your inbox</p>}
            {status==='error' && <p className="error">Something went wrong. Try again.</p>}
          </form>
        </div>
        <div className="hero-mock">
          <div className="mock-card">
            <div className="thought">I always mess up interviews</div>
            <div className="reframe">AI: What evidence? Alternative thought: I prepared and can learn.</div>
          </div>
        </div>
      </header>

      <section className="trust-row">
        <div className="advisor">Clinical advisor: Dr. Placeholder</div>
        <div className="badges">
          <span>Privacy-first</span>
          <span>Not a replacement for therapy</span>
          <a href="#hipaa">HIPAA-aligned*</a>
        </div>
        <div className="waitlist">Waitlist: <span id="count">—</span></div>
      </section>

      <section className="diffs">
        <h3>Designed for measurable CBT work</h3>
        <ul>
          <li><strong>Structured thought records</strong> with distortions + reframes</li>
          <li><strong>Weekly summaries</strong> + optional PHQ-9/GAD-7 trends</li>
          <li><strong>ADHD-friendly capture</strong> (voice→text, 30s entries, reminders)</li>
          <li><strong>Therapist collaboration</strong> (weekly PDF, revocable share)</li>
          <li><strong>Trauma-safe grounding</strong> mode</li>
        </ul>
      </section>

      <section id="how" className="features">
        <div className="col">
          <h4>Thought records</h4>
          <p>Teaching cards that walk you through evidence, automatic distortions detection, and warm AI reframes.</p>
        </div>
        <div className="col">
          <h4>Progress & exports</h4>
          <p>Weekly insights, PHQ-9/GAD-7 trends, and easy PDF exports for therapists.</p>
        </div>
        <div className="col">
          <h4>Safety & privacy</h4>
          <p>End-to-end encryption, no model training without opt-in, and a local-only toggle option.</p>
        </div>
        <div className="col">
          <h4>Grounding</h4>
          <p>Trauma-sensitive grounding exercises and quick-capture safety flow.</p>
        </div>
      </section>

      <section className="pricing">
        <h3>Pricing</h3>
        <div className="plan">
          <div className="name">Free</div>
          <div className="desc">Daily journaling + basic prompts</div>
        </div>
        <div className="plan premium">
          <div className="name">Founding Premium</div>
          <div className="desc">${PRICE}/yr — AI reframes, advanced CBT flows, weekly summaries, therapist export</div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="disclaimer">Not a replacement for therapy. If in crisis, contact emergency services. HIPAA/PHIPA note (placeholder). You own your data; opt-out available.</div>
      </footer>

      <style>{`/* Minimal landing styles to match clawcontrol site */
      .landing-root{font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#e6eef8; background:#06080a; min-height:100vh}
      .hero{display:flex;justify-content:space-between;padding:60px}
      .hero-inner{max-width:560px}
      h1{font-size:36px;margin:0 0 12px}
      .sub{opacity:0.8}
      .cta-form{margin-top:18px}
      input{padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);width:100%;margin-bottom:8px;background:transparent;color:inherit}
      .chips{display:flex;gap:8px;margin-bottom:8px}
      select{padding:8px;border-radius:8px;background:#0b0d0f;color:inherit}
      .cta-row{display:flex;gap:12px;align-items:center}
      .primary{background:#58a6ff;border:none;padding:10px 16px;border-radius:8px;color:#04111a}
      .secondary{color:#58a6ff}
      .incentive{margin-top:8px;opacity:0.85}
      .hero-mock{width:360px}
      .mock-card{background:#071018;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.03)}
      .thought{opacity:0.9}
      .reframe{margin-top:8px;background:#0b2a3a;padding:8px;border-radius:8px}
      .trust-row{display:flex;justify-content:space-between;padding:18px 60px;border-top:1px solid rgba(255,255,255,0.02)}
      .diffs{padding:36px 60px}
      .features{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:18px 60px}
      .pricing{padding:24px 60px}
      .site-footer{padding:18px 60px;border-top:1px solid rgba(255,255,255,0.02);opacity:0.85}
      `}</style>
    </div>
  )
}
