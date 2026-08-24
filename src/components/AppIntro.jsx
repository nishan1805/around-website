import { assets } from '../lib/assets.js'
import DeviceFrame from './DeviceFrame.jsx'

function AppIntro({ mobile = false }) {
  return (
    <div className={`app-intro ${mobile ? 'app-intro--mobile' : ''}`}>
      <div className="app-intro__copy">
        <h2>Your city. One app.</h2>
        <p>One place to discover everything happening around you.</p>
      </div>
      {mobile ? (
        <span className="app-intro__icon">
          <img src={assets.appIcon} alt="Around app icon" />
        </span>
      ) : (
        <DeviceFrame className="app-intro__device" screen="app" />
      )}
    </div>
  )
}

export default AppIntro
