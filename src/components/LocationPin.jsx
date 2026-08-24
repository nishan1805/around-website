import { assets } from '../lib/assets.js'

function LocationPin({ className = '', ...props }) {
  return (
    <div className={`location-pin ${className}`} aria-hidden="true" {...props}>
      <div className="location-pin__ripple">
        <div className="location-pin__ripple-pulse">
          <img className="location-pin__ripple-outer" src={assets.pin.rippleOuter} alt="" />
          <img className="location-pin__ripple-mid" src={assets.pin.rippleMid} alt="" />
          <img className="location-pin__ripple-inner" src={assets.pin.rippleInner} alt="" />
          <img className="location-pin__ripple-core" src={assets.pin.rippleCore} alt="" />
        </div>
      </div>
      <div className="location-pin__glyph">
        <img className="location-pin__body" src={assets.pin.body} alt="" />
        <img className="location-pin__hole-outer" src={assets.pin.holeOuter} alt="" />
        <img className="location-pin__hole-inner" src={assets.pin.holeInner} alt="" />
      </div>
    </div>
  )
}

export default LocationPin
