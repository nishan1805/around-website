import { assets } from '../lib/assets.js'
import SocialLinks from './SocialLinks.jsx'
import WaitlistForm from './WaitlistForm.jsx'

function LaunchCTA({ mobile = false }) {
  return (
    <div className={`launch-cta ${mobile ? 'launch-cta--mobile' : ''}`}>
      <div className="launch-cta__content">
        <p className="launch-cta__eyebrow">Launching first in Raipur(C.G.)</p>
        <h2>
          Be among the first<br />
          to experience <span>around.</span>
        </h2>
        <div className="launch-cta__form" id={mobile ? 'mobile-waitlist' : 'desktop-waitlist'}>
          <WaitlistForm />
          <p className="launch-cta__privacy">
            <span className="launch-cta__privacy-icon" aria-hidden="true">
              <img src={assets.privacyShield} alt="" />
            </span>
            <span>No Spam. We respect your privacy.</span>
          </p>
        </div>
      </div>
      <SocialLinks />
    </div>
  )
}

export default LaunchCTA
