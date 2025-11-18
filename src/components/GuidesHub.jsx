import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function GuidesHub() {
  const [guides, setGuides] = useState([])
  const [q, setQ] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const load = async () => {
    const res = await fetch(`${API}/guides?q=${encodeURIComponent(q)}`)
    if (res.ok) setGuides(await res.json())
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!title || !content) return
    const res = await fetch(`${API}/guides`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content_markdown: content })
    })
    if (res.ok) {
      setTitle(''); setContent(''); load()
    }
  }

  return (
    <section id="hub" className="mt-16">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Community Study Guides</h2>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search guides" className="bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-blue-100" />
          <button onClick={load} className="px-4 py-2 rounded-lg bg-slate-700 text-white">Search</button>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {guides.map(g => (
          <div key={g._id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="text-white font-semibold">{g.title}</div>
            <div className="text-blue-300/70 text-sm mt-1 line-clamp-3">{g.description || g.content_markdown?.slice(0,140)}</div>
            <div className="mt-3 text-sm text-blue-300/60">Votes: {g.votes || 0}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <h3 className="text-white font-semibold">Quick upload</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-blue-100" />
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Paste Markdown content" className="bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-blue-100 h-32" />
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={create} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Publish</button>
        </div>
      </div>
    </section>
  )
}
