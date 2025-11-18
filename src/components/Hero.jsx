import React from 'react'

export default function Hero({ onCreateDemo }) {
  return (
    <section className="relative overflow-hidden">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Live Classroom + Study Workspace</h1>
        <p className="mt-4 text-blue-200/80 text-lg max-w-2xl mx-auto">Run live sessions, collect anonymous feedback, and help students plan smarter with a personal workspace and study guide hub.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={onCreateDemo} className="px-5 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20 transition">
            Start a demo room
          </button>
          <a href="#hub" className="px-5 py-3 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-white font-semibold transition">Browse study guides</a>
        </div>
      </div>
    </section>
  )
}
