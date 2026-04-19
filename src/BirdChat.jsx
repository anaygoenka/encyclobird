import { useRef, useState } from 'react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function askGroq(messages) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/bird-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error('Request failed')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.reply
}

export default function BirdChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const reply = await askGroq(next)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oh dear, I seem to have lost my train of thought! Do give it another go in a moment."
      }])
    } finally {
      setLoading(false)
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        inputRef.current?.focus()
      }, 50)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chat-panel">
      <button className="chat-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="chat-toggle-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </span>
        <span>Ask Reggie — Your Bird Expert</span>
        <span className="chat-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {open && (
        <div className="chat-body">
          <div className="chat-intro">
            <p>Good day! I'm Reggie, your friendly garden bird expert. Ask me anything about the birds you see — identification, behaviour, feeding, you name it!</p>
          </div>

          {messages.length > 0 && (
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                  {m.role === 'assistant' && (
                    <span className="chat-avatar" aria-hidden>R</span>
                  )}
                  <div className="chat-bubble">{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="chat-msg chat-msg--assistant">
                  <span className="chat-avatar" aria-hidden>R</span>
                  <div className="chat-bubble chat-bubble--typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          <div className="chat-input-row">
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Ask about any bird…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="chat-send"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
