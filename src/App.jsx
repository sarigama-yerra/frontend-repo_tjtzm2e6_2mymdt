import React, { useState } from 'react'
import Hero from './components/Hero'
import LiveClassroom from './components/LiveClassroom'
import GuidesHub from './components/GuidesHub'
import TimeManager from './components/TimeManager'

function App() {
  const [_, setDemo] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Hero onCreateDemo={() => setDemo(true)} />
        <LiveClassroom />
        <GuidesHub />
        <TimeManager />
        <footer className="mt-16 text-center text-blue-300/60 text-sm">Built with a lightweight demo of your classroom platform. Expand from here.</footer>
      </div>
    </div>
  )
}

export default App