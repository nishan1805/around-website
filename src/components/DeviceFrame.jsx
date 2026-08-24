import { assets } from '../lib/assets.js'
import LocationLabel from './LocationLabel.jsx'
import LocationPin from './LocationPin.jsx'
import WaitlistForm from './WaitlistForm.jsx'

function DeviceMapDetails() {
  return (
    <div className="device-map-details">
      <LocationPin className="device-pin device-pin--cafe" />
      <LocationPin className="device-pin device-pin--job" />
      <LocationPin className="device-pin device-pin--shopping" />
      <LocationPin className="device-pin device-pin--community" />
      <LocationLabel type="cafe" className="device-label device-label--cafe">Unknown Cafe</LocationLabel>
      <LocationLabel type="job" className="device-label device-label--job">Job Opening</LocationLabel>
      <LocationLabel type="shopping" className="device-label device-label--shopping">Shopping Offers</LocationLabel>
      <LocationLabel type="community" className="device-label device-label--community">Community Meetup</LocationLabel>
      <WaitlistForm compact className="device-waitlist" />
    </div>
  )
}

function DeviceFrame({ className = '', orientation = 'portrait', screen = 'city', showDetails = false }) {
  return (
    <div className={`device-frame device-frame--${orientation} ${className}`}>
      <span className="device-frame__button device-frame__button--top" aria-hidden="true" />
      <span className="device-frame__button device-frame__button--middle" aria-hidden="true" />
      <span className="device-frame__button device-frame__button--bottom" aria-hidden="true" />
      <div className={`device-frame__screen device-frame__screen--${screen}`}>
        {screen === 'city' && <img className="device-frame__city" src={assets.city} alt="" />}
        {screen === 'app' && <img className="device-frame__app" src={assets.appIcon} alt="Around app icon" />}
        {showDetails && <DeviceMapDetails />}
      </div>
      <img className="device-frame__island" src={assets.dynamicIsland} alt="" aria-hidden="true" />
    </div>
  )
}

export default DeviceFrame
