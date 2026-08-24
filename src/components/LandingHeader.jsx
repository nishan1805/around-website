import { assets } from '../lib/assets.js'

function LandingHeader({ mobile = false }) {
  return (
    <header className={`landing-header ${mobile ? 'landing-header--mobile' : ''}`}>
      <img className="landing-header__logo" src={assets.logo} alt="around" />
      <a className="landing-header__cta" href={mobile ? '#mobile-waitlist' : '#desktop-waitlist'}>
        <span>Join Waitlist</span>
        <img src={assets.arrowRight} alt="" aria-hidden="true" />
      </a>
    </header>
  )
}

export default LandingHeader
