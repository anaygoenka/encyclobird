import { useMemo, useState } from 'react'
import { birds } from './birds.js'
import BirdChat from './BirdChat.jsx'

export default function App() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return birds
    return birds.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.latin.toLowerCase().includes(q) ||
      b.blurb.toLowerCase().includes(q) ||
      b.habitat.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden>🪶</span>
            <span className="brand-name">EncycloBird</span>
          </div>
          <h1 className="hero-title">A Field Guide to <em>UK Garden Birds</em></h1>
          <p className="hero-sub">
            Eighteen of the most-seen birds in British gardens — from the bold robin
            on the fencepost to the goldcrest in the conifer.
          </p>
          <div className="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, latin, or habitat…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="chat-section">
        <div className="chat-section-inner">
          <BirdChat />
        </div>
      </div>

      <main className="container">
        <div className="meta-row">
          <span>{filtered.length} {filtered.length === 1 ? 'species' : 'species'}</span>
          <span className="dot">·</span>
          <span>Hand-picked for British gardens</span>
        </div>

        <section className="grid">
          {filtered.map(bird => (
            <article key={bird.id} className="card">
              <div className="card-image-wrap">
                <img
                  className="card-image"
                  src={bird.image}
                  alt={bird.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="card-body">
                <div className="card-header">
                  <h2 className="card-title">{bird.name}</h2>
                  <span className="card-size">{bird.size}</span>
                </div>
                <p className="card-latin">{bird.latin}</p>
                <p className="card-blurb">{bird.blurb}</p>
                <div className="card-tag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" stroke="currentColor" strokeWidth="1.6"/>
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                  {bird.habitat}
                </div>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="empty">
            No birds match “{query}”. Try a colour, a habitat, or a name.
          </div>
        )}
      </main>

      <footer className="footer">
        <p>EncycloBird · A small love letter to the birds in our hedges.</p>
        <p className="muted">Photography via Wikimedia Commons.</p>
      </footer>
    </div>
  )
}
