import React, { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function TimeManager() {
  const [userId] = useState(() => Math.random().toString(36).slice(2))
  const [priority, setPriority] = useState('medium')
  const [taskTitle, setTaskTitle] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const createTask = async () => {
    if (!taskTitle) return
    await fetch(`${API}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, title: taskTitle, priority })})
    setTaskTitle('')
  }

  const generate = async () => {
    const res = await fetch(`${API}/suggestions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, horizon_days: 5 })})
    if (res.ok) setSuggestions(await res.json())
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-white">Time Manager</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <div className="text-white font-semibold">Add a task</div>
          <input value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} placeholder="Task title" className="mt-2 w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-blue-100" />
          <select value={priority} onChange={e=>setPriority(e.target.value)} className="mt-2 w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-blue-100">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button onClick={createTask} className="mt-3 w-full px-4 py-2 rounded-lg bg-blue-500 text-white">Save Task</button>
          <button onClick={generate} className="mt-3 w-full px-4 py-2 rounded-lg bg-slate-700 text-white">Suggest Times</button>
        </div>
        <div className="md:col-span-2 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <div className="text-white font-semibold">Suggested sessions</div>
          <div className="mt-3 space-y-2 max-h-64 overflow-auto pr-2">
            {suggestions.map((s, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-100">
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-blue-300/70">{new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
