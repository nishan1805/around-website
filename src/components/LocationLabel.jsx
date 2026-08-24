import { assets } from '../lib/assets.js'

function LocationLabel({ type, children, className = '', ...props }) {
  return (
    <div className={`location-label location-label--${type} ${className}`} {...props}>
      <img className="location-label__icon" src={assets.labels[type]} alt="" aria-hidden="true" />
      <span>{children}</span>
      <img className="location-label__arrow" src={assets.labels.arrow} alt="" aria-hidden="true" />
    </div>
  )
}

export default LocationLabel
