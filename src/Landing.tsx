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

const IconVoice = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
)
const IconBrain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 017 7c0 3-1.5 5-3 6.5V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3.5C6.5 14 5 12 5 9a7 7 0 017-7z"/><line x1="9" y1="22" x2="15" y2="22"/>
  </svg>
)
const IconExport = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function FAQ({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="faq-chevron">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div className="faq-a">{children}</div>
    </div>
  )
}

export default function Landing(){
  const [email,setEmail]=useState('')
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle')

  const submit=async(e:any)=>{
    e?.preventDefault()
    if(!email.match(/@/)){ setStatus('error'); return }
    setStatus('loading')
    try{
      const res = await fetch(WAITLIST_ENDPOINT || '/api/waitlist', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email})
      })
      if(res.ok){ setStatus('success'); setEmail('') } else setStatus('error')
    }catch(err){ setStatus('error') }
  }

  return (
    <div className="landing-root">
      <nav className="nav">
        <a className="nav-brand" href="/">Winnow<span>.</span></a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#compare">Compare</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </nav>

      <header className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Founding member spots open</div>
          <h1>Your thoughts are lying to you. Here's how to fight back.</h1>
          <p className="sub">You know CBT works. But existing apps are clunky, the AI feels scripted, and you quit after a week. Winnow is the first CBT tool built for how your brain actually works — fast capture, real reframes, zero friction.</p>

          <form className="cta-form" onSubmit={submit}>
            <div className="cta-input-row">
              <input aria-label="email" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
              <button className="primary" type="submit" disabled={status==='loading'}>
                {status==='loading' ? 'Joining...' : 'Join the waitlist'}
              </button>
            </div>
            {status==='success' && <p className="success">You're in! Check your inbox for your free CBT starter kit.</p>}
            {status==='error' && <p className="error">Something went wrong. Try again.</p>}
            <div className="cta-meta">
              <span className="incentive">Founding members: ${PRICE}/yr locked forever (first 500 only)</span>
              <span className="privacy-note"><IconLock /> Your data stays yours. Always.</span>
            </div>
          </form>
        </div>
        <div className="hero-mock">
          <div className="mock-card">
            <div className="mock-label">Thought Record</div>
            <div className="thought">"I always mess up interviews — I'll never get hired."</div>
            <div className="reframe">
              <div className="reframe-label">AI Reframe</div>
              You've been hired before. You prepared thoroughly. The distortion here is <em>overgeneralization</em>. A more balanced thought: <em>"I can learn from each interview and improve."</em>
            </div>
          </div>
        </div>
      </header>

      <RevealSection className="trust-row">
        <div className="trust-badges">
          <span><IconShield /> End-to-end encrypted</span>
          <span>Gold-standard CBT protocols</span>
          <span>Not a replacement for therapy</span>
        </div>
      </RevealSection>

      <RevealSection className="pain-section">
        <h2>Sound familiar?</h2>
        <div className="pain-grid">
          <div className="pain-card">
            <div className="pain-quote">"I downloaded 3 CBT apps and quit them all within a week."</div>
            <div className="pain-why">Too many taps, too much friction. By the time you open the thought diary, the moment has passed.</div>
          </div>
          <div className="pain-card">
            <div className="pain-quote">"The AI just repeats the same generic advice."</div>
            <div className="pain-why">Scripted chatbots don't understand context. They can't help you find YOUR balanced thought.</div>
          </div>
          <div className="pain-card">
            <div className="pain-quote">"My therapist asked for my thought records and I had nothing useful to show."</div>
            <div className="pain-why">Most apps export messy data. Your therapist can't use a wall of text in a 50-minute session.</div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="how-section" id="how">
        <h2>How Winnow works</h2>
        <p className="section-sub">From spiraling to structured in under 30 seconds.</p>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon"><IconVoice /></div>
            <h3>Capture it fast</h3>
            <p>Voice, text, or quick-tap. Get the thought out of your head before it spirals. Auto-saves everything — you'll never lose an entry.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon"><IconBrain /></div>
            <h3>Winnow with AI</h3>
            <p>Winnow identifies cognitive distortions and walks you through evidence-based restructuring. Not a script — a real reframe that feels like yours.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon"><IconExport /></div>
            <h3>Share with your therapist</h3>
            <p>One-click clinical-grade PDF exports with distortion patterns, mood trends, and PHQ-9/GAD-7 scores. Your therapist will actually thank you.</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="built-for" id="built-for">
        <h2>Built for brains that don't sit still</h2>
        <div className="built-grid">
          <div className="built-card">
            <div className="built-tag anxiety">Anxiety</div>
            <h4>Stop the spiral before it starts</h4>
            <p>One-tap "Emergency Reframe" when your thoughts are racing at 2am. No menus, no friction — just instant structured support.</p>
          </div>
          <div className="built-card">
            <div className="built-tag adhd">ADHD</div>
            <h4>5-second entries, zero lost drafts</h4>
            <p>Voice-to-thought-record, auto-save on every keystroke, smart reminders that adapt to your schedule. Built for brains that forget.</p>
          </div>
          <div className="built-card">
            <div className="built-tag trauma">Trauma</div>
            <h4>A safe space when you're not ready to reframe</h4>
            <p>Grounding exercises and a safety-first flow for when you just need to feel safe. Reframing is optional — stability comes first.</p>
          </div>
          <div className="built-card">
            <div className="built-tag mood">Mood tracking</div>
            <h4>See the patterns your brain hides from you</h4>
            <p>Weekly mood trends, distortion frequency maps, and progress charts. Real data that shows CBT is working — even when it doesn't feel like it.</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="compare-section" id="compare">
        <h2>How Winnow compares</h2>
        <p className="section-sub">We built what we wished existed.</p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                <th className="highlight">Winnow</th>
                <th>Woebot</th>
                <th>CBT Thought Diary</th>
                <th>MoodKit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Voice / quick capture</td>
                <td className="highlight"><IconCheck /></td>
                <td><IconX /></td>
                <td><IconX /></td>
                <td><IconX /></td>
              </tr>
              <tr>
                <td>AI-powered reframes</td>
                <td className="highlight"><IconCheck /></td>
                <td>Scripted</td>
                <td><IconX /></td>
                <td><IconX /></td>
              </tr>
              <tr>
                <td>Auto-save / never lose entries</td>
                <td className="highlight"><IconCheck /></td>
                <td><IconCheck /></td>
                <td><IconX /></td>
                <td><IconX /></td>
              </tr>
              <tr>
                <td>Therapist-ready PDF export</td>
                <td className="highlight"><IconCheck /></td>
                <td><IconX /></td>
                <td>Basic</td>
                <td><IconX /></td>
              </tr>
              <tr>
                <td>ADHD-friendly design</td>
                <td className="highlight"><IconCheck /></td>
                <td><IconX /></td>
                <td><IconX /></td>
                <td><IconX /></td>
              </tr>
              <tr>
                <td>Trauma-safe grounding mode</td>
                <td className="highlight"><IconCheck /></td>
                <td><IconX /></td>
                <td><IconX /></td>
                <td><IconX /></td>
              </tr>
              <tr>
                <td>End-to-end encryption</td>
                <td className="highlight"><IconCheck /></td>
                <td><IconX /></td>
                <td><IconX /></td>
                <td><IconCheck /></td>
              </tr>
              <tr>
                <td>PHQ-9 / GAD-7 tracking</td>
                <td className="highlight"><IconCheck /></td>
                <td><IconX /></td>
                <td><IconCheck /></td>
                <td><IconCheck /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </RevealSection>

      <RevealSection className="pricing" id="pricing">
        <div className="pricing-inner">
          <h2>Simple, honest pricing</h2>
          <div className="pricing-grid">
            <div className="plan">
              <div className="name">Free</div>
              <div className="plan-price">$0</div>
              <div className="desc">Daily journaling, basic thought records, and guided prompts. No credit card required.</div>
            </div>
            <div className="plan premium">
              <div className="founding-badge">Founding Price</div>
              <div className="name">Premium</div>
              <div className="plan-price">${PRICE}<span>/yr</span></div>
              <div className="desc">AI reframes, voice capture, therapist exports, advanced analytics, and priority support. Price locked forever for founding members.</div>
              <div className="plan-note">First 500 members only</div>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="faq-section" id="faq">
        <h2>Questions</h2>
        <div className="faq-list">
          <FAQ q="Is this a replacement for therapy?">
            <p>No. Winnow is a tool to support your CBT practice between sessions. It's designed to work alongside therapy, not replace it. If you're in crisis, please contact emergency services or a crisis hotline.</p>
          </FAQ>
          <FAQ q="Where is my data stored?">
            <p>Your thought records are end-to-end encrypted. We cannot read your entries. You can export or delete all your data at any time. We will never sell your data or use it to train AI models without explicit opt-in.</p>
          </FAQ>
          <FAQ q="What if I have ADHD and forget to use it?">
            <p>We built Winnow specifically for this. Smart reminders that adapt to your patterns, voice capture so you don't need to type, auto-save so you never lose a draft, and 5-second quick entries for when you just need to get a thought out fast.</p>
          </FAQ>
          <FAQ q="How is the AI different from Woebot or Wysa?">
            <p>Woebot and Wysa use scripted conversation trees. Winnow uses contextual AI that actually reads your thought record, identifies specific distortions, and generates a reframe that feels authentic to your situation — not a generic platitude.</p>
          </FAQ>
          <FAQ q="What platforms will Winnow be available on?">
            <p>We're launching on web first, with iOS and Android apps following shortly after. Your account syncs across all platforms.</p>
          </FAQ>
          <FAQ q="What do I get by joining the waitlist?">
            <p>Early access when we launch, the founding member price (${PRICE}/yr locked forever), and a free CBT starter kit with worksheets you can use right now.</p>
          </FAQ>
        </div>
      </RevealSection>

      <RevealSection className="final-cta">
        <h2>Ready to stop spiraling?</h2>
        <p>Join the founding members building a better way to do CBT.</p>
        <form className="cta-form bottom-cta" onSubmit={submit}>
          <div className="cta-input-row">
            <input aria-label="email" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <button className="primary" type="submit" disabled={status==='loading'}>
              {status==='loading' ? 'Joining...' : 'Join the waitlist'}
            </button>
          </div>
          {status==='success' && <p className="success">You're in! Check your inbox for your free CBT starter kit.</p>}
          {status==='error' && <p className="error">Something went wrong. Try again.</p>}
          <span className="incentive">${PRICE}/yr founding price — first 500 members only</span>
        </form>
      </RevealSection>

      <footer className="site-footer">
        <div className="links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="disclaimer">Not a replacement for therapy. If in crisis, contact emergency services. Your data is end-to-end encrypted. You own your data — export or delete anytime.</div>
      </footer>
    </div>
  )
}
