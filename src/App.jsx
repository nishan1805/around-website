import './styles/tokens.css'
import './styles/landing.css'
import AnimatedExperience from './components/AnimatedExperience.jsx'
import DesktopLanding from './sections/DesktopLanding.jsx'
import MobileLanding from './sections/MobileLanding.jsx'
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <main className="landing-page">
      <AnimatedExperience />
      <DesktopLanding />
      <MobileLanding />
      <Analytics />
    </main>
  )
}

export default App
