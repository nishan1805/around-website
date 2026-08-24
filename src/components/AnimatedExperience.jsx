import AppIntro from './AppIntro.jsx'
import LandingHeader from './LandingHeader.jsx'
import LaunchCTA from './LaunchCTA.jsx'
import LocationLabel from './LocationLabel.jsx'
import LocationPin from './LocationPin.jsx'
import WaitlistForm from './WaitlistForm.jsx'
import { useAnimatedExperience } from '../hooks/useAnimatedExperience.js'
import { assets } from '../lib/assets.js'

const DESKTOP_UNIT = 14.4
const MOBILE_UNIT = 4.12

const initialCityClouds = [
  { nodeId: '1200:104929', depth: 'mid', asset: 'cityTopLeft', x: 891, y: 568, width: 558, height: 302, exitX: 430, exitY: 230 },
  { nodeId: '1200:104930', depth: 'back', asset: 'cityTop', x: 278, y: 577, width: 439, height: 314, exitX: -170, exitY: 260 },
  { nodeId: '1200:104931', depth: 'mid', asset: 'cityTop', x: -74, y: 33, width: 314, height: 439, innerWidth: 439, innerHeight: 314, rotation: 90, exitX: -330, exitY: -40 },
  { nodeId: '1200:104932', depth: 'front', asset: 'cityRight', x: -76, y: -18, width: 493.63, height: 794, innerWidth: 794, innerHeight: 493.63, rotation: 90, exitX: -390, exitY: -90 },
  { nodeId: '1200:104933', depth: 'mid', asset: 'cityRight', x: -110, y: -97, width: 817, height: 508, rotation: 180, exitX: -230, exitY: -260 },
  { nodeId: '1200:104934', depth: 'front', asset: 'cityBottomLeft', x: 390, y: 541, width: 823, height: 428, exitX: 0, exitY: 330 },
  { nodeId: '1200:104935', depth: 'back', asset: 'cityBottomLeft', x: 450, y: -57, width: 823, height: 428, rotation: 180, exitX: 0, exitY: -300 },
  { nodeId: '1200:104936', depth: 'front', asset: 'cityBottom', x: -349, y: 330, width: 958, height: 695, exitX: -390, exitY: 240 },
  { nodeId: '1200:104937', depth: 'mid', asset: 'cityBottom', x: 971, y: -353, width: 695, height: 958, innerWidth: 958, innerHeight: 695, rotation: -90, exitX: 410, exitY: -240 },
  { nodeId: '1200:104938', depth: 'back', asset: 'cityTop', x: 1031, y: 126, width: 363.349, height: 508, innerWidth: 508, innerHeight: 363.349, rotation: -90, exitX: 330, exitY: -30 },
  { nodeId: '1200:104939', depth: 'front', asset: 'cityRight', x: 879, y: 491, width: 787, height: 489, exitX: 390, exitY: 260 },
  { nodeId: '1200:104940', depth: 'front', asset: 'cityBottom', x: 971, y: 168, width: 632, height: 873, innerWidth: 873, innerHeight: 632, rotation: -90, exitX: 430, exitY: 160 },
]

const zoomCityClouds = [
  { nodeId: '1200:104952', depth: 'mid', asset: 'cityRight', x: -110, y: -85, width: 559.755, height: 348, rotation: 180, enterX: 100, enterY: 70, exitX: -260, exitY: -170 },
  { nodeId: '1200:104953', depth: 'front', asset: 'cityBottomLeft', x: 390, y: 553, width: 823, height: 428, enterX: 0, enterY: -130, exitX: 0, exitY: 310 },
  { nodeId: '1200:104954', depth: 'back', asset: 'cityBottomLeft', x: 356, y: -102, width: 542.514, height: 282, rotation: 180, enterX: 0, enterY: 90, exitX: 0, exitY: -230 },
  { nodeId: '1200:104955', depth: 'mid', asset: 'cityBottom', x: -349, y: 526, width: 705, height: 511, enterX: 110, enterY: -80, exitX: -290, exitY: 230 },
  { nodeId: '1200:104956', depth: 'back', asset: 'cityBottom', x: 1118, y: -263, width: 438, height: 604, innerWidth: 604, innerHeight: 438, rotation: -90, enterX: -110, enterY: 60, exitX: 290, exitY: -210 },
  { nodeId: '1200:104957', depth: 'front', asset: 'cityBottom', x: 1142, y: 435, width: 445, height: 613, innerWidth: 613, innerHeight: 445, rotation: -90, enterX: -110, enterY: -80, exitX: 300, exitY: 230 },
  { nodeId: '1200:104958', depth: 'mid', asset: 'cityBottom', x: -656, y: 101, width: 958, height: 695, enterX: 120, enterY: 0, exitX: -340, exitY: 0 },
  { nodeId: '1200:104959', depth: 'back', asset: 'cityRight', x: -76, y: -21, width: 353, height: 568, innerWidth: 568, innerHeight: 353, rotation: 90, enterX: 100, enterY: 20, exitX: -260, exitY: -110 },
  { nodeId: '1200:104960', depth: 'mid', asset: 'cityBottom', x: 1124, y: 100, width: 538, height: 742, innerWidth: 742, innerHeight: 538, rotation: -90, enterX: -120, enterY: 0, exitX: 320, exitY: 20 },
]

const CLOUD_DEPTHS = ['back', 'mid', 'front']

const desktopPins = [
  { type: 'shopping', x: 165.66, y: 309.93, finalX: 5.01, finalY: 1.4 },
  { type: 'cafe', x: 321.36, y: 129.26, finalX: 5.97, finalY: 0.07 },
  { type: 'job', x: 714.99, y: 72.71, finalX: 1.68, finalY: 3.96 },
  { type: 'community', x: 614.42, y: 397.33, finalX: 6.91, finalY: 0.67 },
]

const desktopLabels = [
  { type: 'cafe', text: 'Unknown Cafe', x: 314.667, y: 74.667 },
  { type: 'job', text: 'Job Opening', x: 708.667, y: 22 },
  { type: 'community', text: 'Community Meetup', x: 597.333, y: 343.333 },
  { type: 'shopping', text: 'Shopping Offers', x: 150.667, y: 256.667 },
]

const mobilePins = [
  { type: 'shopping', x: 118.58, y: 227.72, finalX: 29.95, finalY: 5.96 },
  { type: 'cafe', x: 235.8, y: 93.65, finalX: 20.25, finalY: 3.76 },
]

const mobileLabels = [
  { type: 'shopping', text: 'Shopping Offers', x: 135.21, y: 190.04 },
  { type: 'cafe', text: 'Unknown Cafe', x: 245.93, y: 53.76 },
]

function toSceneStyle({ x, y, width, height }, unit) {
  const style = {
    left: `${x / unit}cqw`,
    top: `${y / unit}cqw`,
  }

  if (width !== undefined) style.width = `${width / unit}cqw`
  if (height !== undefined) style.height = `${height / unit}cqw`
  return style
}

function DesktopHeroClouds() {
  const clouds = [
    { asset: 'heroLeftMid', className: 'hero-cloud--left-mid', depth: 'back', exitX: -220, exitY: 190 },
    { asset: 'heroLeft', className: 'hero-cloud--left', depth: 'mid', exitX: -460, exitY: 90 },
    { asset: 'heroRightMid', className: 'hero-cloud--right-mid', depth: 'back', exitX: 260, exitY: 170 },
    { asset: 'heroRight', className: 'hero-cloud--right', depth: 'mid', exitX: 470, exitY: 80 },
    { asset: 'heroCenter', className: 'hero-cloud--center', depth: 'front', exitX: 20, exitY: 330 },
  ]

  return (
    <div className="cloud-layer animated-clouds animated-clouds--hero" aria-hidden="true">
      {CLOUD_DEPTHS.map((depth) => (
        <div className={`cloud-depth cloud-depth--${depth}`} key={depth}>
          {clouds.filter((cloud) => cloud.depth === depth).map((cloud) => (
            <img
              key={cloud.asset}
              className={`hero-cloud ${cloud.className}`}
              src={assets.clouds[cloud.asset]}
              alt=""
              decoding="async"
              fetchPriority={cloud.asset === 'heroCenter' ? 'high' : 'auto'}
              data-cloud-depth={cloud.depth}
              data-cloud-exit-x={cloud.exitX}
              data-cloud-exit-y={cloud.exitY}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function FigmaCloud({ cloud }) {
  const {
    nodeId,
    asset,
    x,
    y,
    width,
    height,
    innerWidth = width,
    innerHeight = height,
    rotation = 0,
    enterX = 0,
    enterY = 0,
    exitX,
    exitY,
  } = cloud

  const style = {
    '--cloud-x': `${x / DESKTOP_UNIT}cqw`,
    '--cloud-y': `${y / DESKTOP_UNIT}cqw`,
    '--cloud-width': `${width / DESKTOP_UNIT}cqw`,
    '--cloud-height': `${height / DESKTOP_UNIT}cqw`,
    '--cloud-inner-width': `${innerWidth / DESKTOP_UNIT}cqw`,
    '--cloud-inner-height': `${innerHeight / DESKTOP_UNIT}cqw`,
    '--cloud-rotation': `${rotation}deg`,
  }

  return (
    <span
      className="figma-cloud"
      style={style}
      data-node-id={nodeId}
      data-cloud-depth={cloud.depth}
      data-cloud-enter-x={enterX}
      data-cloud-enter-y={enterY}
      data-cloud-exit-x={exitX}
      data-cloud-exit-y={exitY}
    >
      <span className="figma-cloud__rotation">
        <img src={assets.clouds[asset]} alt="" decoding="async" />
      </span>
    </span>
  )
}

function DesktopCityClouds({ zoom = false }) {
  const clouds = zoom ? zoomCityClouds : initialCityClouds

  return (
    <>
      {CLOUD_DEPTHS.map((depth) => (
        <div
          className={`cloud-layer cloud-depth-scene cloud-depth-scene--${depth} animated-clouds ${zoom ? 'animated-clouds--zoom' : 'animated-clouds--initial'}`}
          key={depth}
          aria-hidden="true"
        >
          {clouds.filter((cloud) => cloud.depth === depth).map((cloud) => (
            <FigmaCloud key={cloud.nodeId} cloud={cloud} />
          ))}
        </div>
      ))}
    </>
  )
}

function MobileClouds({ city = false }) {
  const clouds = [
    { asset: 'mobileLeft', className: 'mobile-cloud--left', depth: 'mid', exitX: -250, exitY: 130 },
    { asset: 'mobileRightMid', className: 'mobile-cloud--right-mid', depth: 'back', exitX: 160, exitY: 120 },
    { asset: 'mobileRight', className: 'mobile-cloud--right', depth: 'mid', exitX: 230, exitY: 40 },
    { asset: 'mobileCenter', className: 'mobile-cloud--center', depth: 'front', exitX: 15, exitY: 210 },
    { asset: 'mobileBottom', className: 'mobile-cloud--bottom', depth: 'front', exitX: -60, exitY: 250 },
  ]

  const renderDepth = (depth) => clouds.filter((cloud) => cloud.depth === depth).map((cloud) => (
    <img
      key={cloud.asset}
      className={`mobile-cloud ${cloud.className}`}
      src={assets.clouds[cloud.asset]}
      alt=""
      decoding="async"
      fetchPriority={cloud.asset === 'mobileCenter' ? 'high' : 'auto'}
      data-cloud-depth={cloud.depth}
      data-cloud-exit-x={cloud.exitX}
      data-cloud-exit-y={cloud.exitY}
    />
  ))

  if (!city) {
    return (
      <div className="mobile-clouds animated-mobile-clouds animated-mobile-clouds--hero" aria-hidden="true">
        {CLOUD_DEPTHS.map((depth) => (
          <div className={`cloud-depth cloud-depth--${depth}`} key={depth}>{renderDepth(depth)}</div>
        ))}
      </div>
    )
  }

  return CLOUD_DEPTHS.map((depth) => (
    <div
      className={`mobile-clouds mobile-clouds--city cloud-depth-scene cloud-depth-scene--${depth} animated-mobile-clouds animated-mobile-clouds--city`}
      key={depth}
      aria-hidden="true"
    >
      {renderDepth(depth)}
    </div>
  ))
}

function DesktopCityScene() {
  return (
    <div className="animated-city-layer animated-city-layer--desktop">
      <img
        className="animated-city-layer__image"
        src={assets.city}
        alt="A city with places to discover"
        decoding="async"
        fetchPriority="high"
      />
      {desktopPins.map((pin) => (
        <LocationPin
          key={pin.type}
          className={`animated-pin animated-pin--desktop animated-pin--${pin.type}`}
          style={toSceneStyle({ ...pin, width: 82.21, height: 60.7 }, DESKTOP_UNIT)}
          data-final-x={pin.finalX}
          data-final-y={pin.finalY}
          data-final-scale="0.9077"
        />
      ))}
      {desktopLabels.map((label) => (
        <LocationLabel
          key={label.type}
          type={label.type}
          className={`animated-label animated-label--desktop animated-label--${label.type}`}
          style={toSceneStyle(label, DESKTOP_UNIT)}
          data-final-scale="0.666667"
        >
          {label.text}
        </LocationLabel>
      ))}
    </div>
  )
}

function MorphingDesktopDevice() {
  return (
    <div className="animated-device-stage">
      <div className="animated-device" data-node-id="1200:105011">
        <div className="animated-device__hardware" aria-hidden="true">
          <div className="animated-device__body" />
          <div className="animated-device__screen-frame" />
          <span className="animated-device__button animated-device__button--action" />
          <span className="animated-device__button animated-device__button--volume-up" />
          <span className="animated-device__button animated-device__button--volume-down" />
          <span className="animated-device__button animated-device__button--power" />
        </div>
        <div className="animated-device__screen">
          <div className="animated-device__city-content">
            <DesktopCityScene />
          </div>
          <div className="animated-device__white-screen" aria-hidden="true" />
          <div className="animated-device__app-layer">
            <span className="animated-app-icon">
              <img src={assets.appIcon} alt="Around app icon" decoding="async" />
            </span>
          </div>
        </div>
        <span className="animated-device__island" aria-hidden="true">
          <img src={assets.dynamicIsland} alt="" />
        </span>
      </div>
    </div>
  )
}

function MobileCityScene() {
  return (
    <div className="animated-city-layer animated-city-layer--mobile">
      <img
        className="animated-city-layer__image"
        src={assets.city}
        alt="A city with places to discover"
        decoding="async"
        fetchPriority="high"
      />
      {mobilePins.map((pin) => (
        <LocationPin
          key={pin.type}
          className={`animated-pin animated-pin--mobile animated-pin--${pin.type}`}
          style={toSceneStyle({ ...pin, width: 57.27, height: 42.45 }, MOBILE_UNIT)}
          data-final-x={pin.finalX}
          data-final-y={pin.finalY}
          data-final-scale="0.7901"
        />
      ))}
      {mobileLabels.map((label) => (
        <LocationLabel
          key={label.type}
          type={label.type}
          className={`mobile-label animated-label animated-label--mobile animated-label--${label.type}`}
          style={toSceneStyle(label, MOBILE_UNIT)}
          data-final-scale="0.5323"
        >
          {label.text}
        </LocationLabel>
      ))}
    </div>
  )
}

function DesktopAnimatedScene() {
  return (
    <div className="animated-experience__desktop">
      <section className="animated-scene animated-scene--desktop" data-animation-scene="desktop" data-node-id="1200:104894">
        <div className="animated-scene__sky" aria-hidden="true" />
        <div className="animated-scene__device-backdrop" aria-hidden="true" />
        <div className="animated-final-background" aria-hidden="true">
          <img src={assets.finalCity} alt="" decoding="async" fetchPriority="low" />
          <span />
        </div>
        <div className="animated-scene__desktop-stage">
          <LandingHeader />
          <div className="desktop-hero__copy animated-scene__hero-copy">
            <h1>Your city,<br />like never before</h1>
            <p>
              Real places, real people, real moments.<br />
              Everything happening <strong>around</strong> you.
            </p>
          </div>
          <div className="animated-city-reveal animated-city-reveal--desktop">
            <MorphingDesktopDevice />
          </div>
          <DesktopHeroClouds />
          <DesktopCityClouds />
          <DesktopCityClouds zoom />
          <div className="scroll-cue animated-scene__scroll-cue" aria-hidden="true">
            <span>Scroll to explore</span>
            <span className="scroll-cue__mouse"><img src={assets.scrollDot} alt="" /></span>
          </div>
          <div className="animated-device-intro">
            <h2>Your city. One app.</h2>
            <p>One place to discover everything happening around you.</p>
          </div>
          <div className="animated-final-cta" data-node-id="1200:105453">
            <LaunchCTA />
          </div>
          <WaitlistForm className="desktop-state__form animated-scene__form" />
        </div>
      </section>
    </div>
  )
}

function MobileAnimatedScene() {
  return (
    <div className="animated-experience__mobile">
      <section className="animated-scene animated-scene--mobile" data-animation-scene="mobile" data-node-id="1235:4724">
        <div className="animated-scene__sky" aria-hidden="true" />
        <LandingHeader mobile />
        <div className="mobile-hero__copy animated-scene__hero-copy">
          <h1>Your city,<br />like never<br />before</h1>
          <p>
            Real places, real people, real moments.<br />
            Everything happening <strong>around</strong> you.
          </p>
        </div>
        <div className="animated-mobile-city-stage">
          <div className="animated-city-reveal animated-city-reveal--mobile">
            <MobileCityScene />
          </div>
        </div>
        <MobileClouds />
        <MobileClouds city />
        <div className="mobile-scroll-cue animated-scene__scroll-cue" aria-hidden="true">
          <span>Scroll to explore</span>
          <span className="mobile-scroll-cue__mouse"><img src={assets.scrollDot} alt="" /></span>
        </div>
        <div className="animated-scene__white-veil" aria-hidden="true" />
        <div className="animated-mobile-final-layer animated-mobile-launch-layer mobile-launch-state">
          <LaunchCTA mobile />
        </div>
        <div className="animated-mobile-final-layer animated-mobile-app-layer mobile-app-state">
          <AppIntro mobile />
        </div>
        <WaitlistForm className="mobile-state__form animated-scene__form" />
      </section>
    </div>
  )
}

function AnimatedExperience() {
  const root = useAnimatedExperience()

  return (
    <div className="animated-experience" ref={root}>
      <DesktopAnimatedScene />
      <MobileAnimatedScene />
    </div>
  )
}

export default AnimatedExperience
