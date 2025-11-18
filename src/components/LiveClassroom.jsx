import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function LiveClassroom() {
  const [code, setCode] = useState('')
  const [room, setRoom] = useState(null)
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState([])
  const [notes, setNotes] = useState('')
  const [userId] = useState(() => Math.random().toString(36).slice(2))

  const fetchRoom = async (c) => {
    const res = await fetch(`${API}/rooms/${c}`)
    if (res.ok) {
      const data = await res.json()
      setRoom(data)
    }
  }
  const fetchQuestions = async (c) => {
    const res = await fetch(`${API}/rooms/${c}/questions`)
    if (res.ok) setQuestions(await res.json())
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (room?.code) fetchQuestions(room.code)
    }, 3000)
    return () => clearInterval(interval)
  }, [room?.code])

  const createDemo = async () => {
    const c = Math.random().toString(36).slice(2, 6).toUpperCase()
    const res = await fetch(`${API}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: c, title: 'Demo Session' })
    })
    if (res.ok) {
      setCode(c)
      await fetchRoom(c)
    }
  }

  const join = async () => {
    await fetchRoom(code)
    await fetchQuestions(code)
  }

  const ask = async () => {
    if (!room) return
    const res = await fetch(`${API}/rooms/${room.code}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: question, anonymous: true })
    })
    if (res.ok) {
      setQuestion('')
      fetchQuestions(room.code)
    }
  }

  const saveNotes = async () => {
    if (!room) return
    await fetch(`${API}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, content: notes, room_code: room.code })
    })
  }

  const confused = async () => {
    if (!room) return
    await fetch(`${API}/rooms/${room.code}/confused`, { method: 'POST' })
  }

  return (
    <section className="mt-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <div className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Room code" className="flex-1 bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-blue-100 outline-none" />
          <button onClick={join} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Join</button>
          <button onClick={createDemo} className="px-4 py-2 rounded-lg bg-slate-700 text-white">Create demo</button>
        </div>

        {room && (
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">{room.title || 'Live Session'} • {room.code}</h3>
              <button onClick={confused} className="text-sm px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">I'm confused</button>
            </div>

            <div className="mt-4 h-56 bg-slate-900/60 rounded-lg border border-slate-700 flex items-center justify-center text-blue-300">
              {room.broadcast_type === 'video' && room.video_url ? (
                <span>Video: {room.video_url}</span>
              ) : room.broadcast_type === 'slides' && room.slide_urls?.length ? (
                <img src={room.slide_urls[room.current_slide||0]} alt="slide" className="max-h-52 object-contain" />
              ) : (
                <span>Waiting for the teacher to broadcast…</span>
              )}
            </div>

            <div className="mt-5">
              <h4 className="text-blue-200 font-medium mb-2">Anonymous Q&A</h4>
              <div className="flex gap-2 mb-3">
                <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask a question" className="flex-1 bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-blue-100" />
                <button onClick={ask} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Post</button>
              </div>
              <div className="space-y-2 max-h-40 overflow-auto pr-2">
                {questions.map(q => (
                  <div key={q._id} className="p-2 rounded bg-slate-900/50 border border-slate-700 text-blue-100">
                    {q.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <h4 className="text-white font-semibold">Notes</h4>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Write notes here…" className="mt-3 w-full h-56 bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-blue-100" />
        <div className="mt-2 flex justify-end">
          <button onClick={saveNotes} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Save</button>
        </div>
      </div>
    </section>
  )
}
