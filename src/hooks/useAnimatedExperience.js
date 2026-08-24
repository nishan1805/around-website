import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const DESKTOP_CITY_ZOOM_SCALE = 1.36159
const DESKTOP_CITY_FINAL_SCALE = 1.5
const MOBILE_CITY_PIN_SCALE = 1.48431
const MOBILE_CITY_FINAL_SCALE = 1.93494
const DESKTOP_PIN_DISTANCE = 10.7
const MOBILE_PIN_DISTANCE = 7.2

const MASK_CLOSED = {
  '--city-mask-main-x': '0.01%',
  '--city-mask-main-y': '0.01%',
  '--city-mask-side': '0.01%',
  '--city-mask-top-x': '0.01%',
  '--city-mask-top-y': '0.01%',
  '--city-mask-bottom-x': '0.01%',
  '--city-mask-bottom-y': '0.01%',
}

const DESKTOP_MASK_CORE = {
  '--city-mask-main-x': '28%',
  '--city-mask-main-y': '26%',
}

const DESKTOP_MASK_LOBES = {
  '--city-mask-side': '12%',
  '--city-mask-top-x': '18%',
  '--city-mask-top-y': '12%',
  '--city-mask-bottom-x': '22%',
  '--city-mask-bottom-y': '14%',
}

const MOBILE_MASK_CORE = {
  '--city-mask-main-x': '43%',
  '--city-mask-main-y': '20%',
}

const MOBILE_MASK_LOBES = {
  '--city-mask-side': '17%',
  '--city-mask-top-x': '25%',
  '--city-mask-top-y': '11%',
  '--city-mask-bottom-x': '28%',
  '--city-mask-bottom-y': '13%',
}

const MASK_ZOOMED = {
  '--city-mask-main-x': '76%',
  '--city-mask-main-y': '74%',
  '--city-mask-side': '34%',
  '--city-mask-top-x': '48%',
  '--city-mask-top-y': '42%',
  '--city-mask-bottom-x': '52%',
  '--city-mask-bottom-y': '44%',
}

const MASK_OPEN = {
  '--city-mask-main-x': '125%',
  '--city-mask-main-y': '125%',
  '--city-mask-side': '62%',
  '--city-mask-top-x': '88%',
  '--city-mask-top-y': '76%',
  '--city-mask-bottom-x': '92%',
  '--city-mask-bottom-y': '78%',
}

const CLOUD_DEPTH_MOTION = {
  back: { distance: 0.62, duration: 1.2, scale: 1.012, ease: 'none' },
  mid: { distance: 0.94, duration: 1, scale: 1.036, ease: 'none' },
  front: { distance: 1.18, duration: 0.86, scale: 1.065, ease: 'none' },
}

function scaled(scene, designWidth, value) {
  return () => value * (scene.clientWidth / designWidth)
}

function elements(scene, selector) {
  return gsap.utils.toArray(selector, scene)
}

function orderedLabels(scene) {
  return ['shopping', 'cafe', 'job', 'community']
    .map((type) => scene.querySelector(`.animated-label--${type}`))
    .filter(Boolean)
}

function animateCloudVectors(timeline, clouds, scene, designWidth, position, duration, options = {}) {
  const { distanceScale = 1, opacity = 0, varyDuration = true } = options

  clouds.forEach((cloud, index) => {
    const depth = CLOUD_DEPTH_MOTION[cloud.dataset.cloudDepth] || CLOUD_DEPTH_MOTION.mid
    const targetOpacity = typeof opacity === 'function' ? opacity(cloud, depth) : opacity

    timeline.to(cloud, {
      x: scaled(scene, designWidth, Number(cloud.dataset.cloudExitX || 0) * depth.distance * distanceScale),
      y: scaled(scene, designWidth, Number(cloud.dataset.cloudExitY || 0) * depth.distance * distanceScale),
      scale: depth.scale,
      opacity: targetOpacity,
      duration: duration * (varyDuration ? depth.duration : 1),
      ease: depth.ease,
    }, position + index * 0.018)
  })
}

function createPinIdleLoops(scene, designWidth, duration, times, pinDisplayScale) {
  const loops = []
  let active = false

  elements(scene, '.animated-pin').forEach((pin, index) => {
    const glyph = pin.querySelector('.location-pin__glyph')
    const ripple = pin.querySelector('.location-pin__ripple-pulse')
    const lift = -15 / pinDisplayScale
    const firstDuration = duration * (times[1] - times[0])
    const secondDuration = duration * (times[2] - times[1])
    const holdDuration = duration * (times[3] - times[2])

    const bounce = gsap.timeline({
      repeat: -1,
      delay: index * 0.11,
      repeatRefresh: true,
      paused: true,
    })

    bounce
      .set(glyph, { y: scaled(scene, designWidth, lift) })
      .to(glyph, { y: 0, duration: firstDuration, ease: 'power2.out' })
      .to(glyph, { y: scaled(scene, designWidth, lift), duration: secondDuration, ease: 'power2.out' })
      .to(glyph, { y: scaled(scene, designWidth, lift), duration: holdDuration, ease: 'none' })

    const rippleLoop = gsap.fromTo(ripple, {
      scale: 0.97,
      opacity: 0.72,
    }, {
      scale: 1.07,
      opacity: 0.38,
      duration: duration / 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: index * 0.11 + 0.08,
      paused: true,
    })

    loops.push(bounce, rippleLoop)
  })

  return {
    setActive(nextActive) {
      if (nextActive === active) return
      active = nextActive
      loops.forEach((loop) => (active ? loop.play() : loop.pause()))
    },
    kill() {
      loops.forEach((loop) => loop.kill())
    },
  }
}

function createScrollCueLoop(mouse, scene, designWidth) {
  let active = false
  const loop = gsap.to(mouse, {
    y: scaled(scene, designWidth, -6),
    duration: 0.78,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    paused: true,
  })

  return {
    setActive(nextActive) {
      if (nextActive === active) return
      active = nextActive
      if (active) loop.play()
      else loop.pause()
    },
    kill() {
      loop.kill()
    },
  }
}

function setZoomCloudEntrance(scene, designWidth, zoomClouds) {
  gsap.set(zoomClouds, {
    opacity: 0,
    x: (index, cloud) => Number(cloud.dataset.cloudEnterX || 0) * (scene.clientWidth / designWidth),
    y: (index, cloud) => Number(cloud.dataset.cloudEnterY || 0) * (scene.clientWidth / designWidth),
  })
}

function setPinFinalState(scene, designWidth, pins) {
  gsap.set(pins, {
    opacity: 1,
    x: (index, pin) => Number(pin.dataset.finalX || 0) * (scene.clientWidth / designWidth),
    y: (index, pin) => Number(pin.dataset.finalY || 0) * (scene.clientWidth / designWidth),
    scale: (index, pin) => Number(pin.dataset.finalScale || 1),
  })
}

function setLabelFinalState(labels) {
  gsap.set(labels, {
    opacity: 1,
    y: 0,
    scale: (index, label) => Number(label.dataset.finalScale || 1),
  })
}

function setupDesktopTimeline(scene) {
  const cityReveal = scene.querySelector('.animated-city-reveal')
  const city = scene.querySelector('.animated-city-layer')
  const copy = scene.querySelector('.animated-scene__hero-copy')
  const header = scene.querySelector('.landing-header')
  const cue = scene.querySelector('.animated-scene__scroll-cue')
  const form = scene.querySelector('.animated-scene__form')
  const heroClouds = elements(scene, '.animated-clouds--hero img')
  const initialClouds = elements(scene, '.animated-clouds--initial .figma-cloud')
  const zoomClouds = elements(scene, '.animated-clouds--zoom .figma-cloud')
  const pins = elements(scene, '.animated-pin')
  const labels = orderedLabels(scene)
  const deviceBackdrop = scene.querySelector('.animated-scene__device-backdrop')
  const device = scene.querySelector('.animated-device')
  const deviceHardware = scene.querySelector('.animated-device__hardware')
  const deviceIsland = scene.querySelector('.animated-device__island')
  const deviceScreen = scene.querySelector('.animated-device__screen')
  const deviceCity = scene.querySelector('.animated-device__city-content')
  const deviceWhite = scene.querySelector('.animated-device__white-screen')
  const deviceApp = scene.querySelector('.animated-device__app-layer')
  const deviceAppIcon = deviceApp.querySelector('.animated-app-icon')
  const deviceIntro = scene.querySelector('.animated-device-intro')
  const finalBackground = scene.querySelector('.animated-final-background')
  const finalBackgroundImage = finalBackground.querySelector('img')
  const finalCta = scene.querySelector('.animated-final-cta')
  const finalEyebrow = finalCta.querySelector('.launch-cta__eyebrow')
  const finalHeadline = finalCta.querySelector('.launch-cta h2')
  const finalForm = finalCta.querySelector('.launch-cta__form .waitlist-form')
  const finalPrivacy = finalCta.querySelector('.launch-cta__privacy')
  const finalSocials = elements(finalCta, '.social-links a')
  const headerCta = header.querySelector('.landing-header__cta')
  const cueMouse = cue.querySelector('.scroll-cue__mouse')
  gsap.set(cityReveal, MASK_CLOSED)
  gsap.set(cityReveal, { opacity: 0 })
  gsap.set(city, {
    '--city-edge-feather': '2.75%',
    opacity: 1,
    x: scaled(scene, 1440, 28),
    y: scaled(scene, 1440, 18),
    scale: 0.95,
    borderRadius: scaled(scene, 1440, 56),
    transformOrigin: '0 0',
  })
  gsap.set(initialClouds, { opacity: 0, x: 0, y: 0 })
  setZoomCloudEntrance(scene, 1440, zoomClouds)
  gsap.set(pins, { opacity: 0, scale: 0.72, x: 0, y: 0, transformOrigin: '50% 100%' })
  gsap.set(labels, { opacity: 0, y: scaled(scene, 1440, 14), scale: 0.61, transformOrigin: '0 0' })
  gsap.set(form, { autoAlpha: 0, y: scaled(scene, 1440, 18) })
  gsap.set(deviceBackdrop, { opacity: 0 })
  gsap.set(device, { x: 0, y: 0, scale: 1, rotation: 0, transformOrigin: '50% 50%' })
  gsap.set(deviceHardware, { opacity: 0 })
  gsap.set(deviceIsland, { opacity: 0 })
  gsap.set(deviceScreen, {
    '--device-clip-y': '-7.3733cqw',
    '--device-clip-x': '-1.4237cqw',
    '--device-clip-radius': '0cqw',
  })
  gsap.set(deviceCity, { opacity: 1, x: 0, y: 0, scale: 1 })
  gsap.set(deviceWhite, { opacity: 0 })
  gsap.set(deviceApp, { opacity: 0 })
  gsap.set(deviceAppIcon, { scale: 0.88 })
  gsap.set(deviceIntro, { opacity: 0, y: scaled(scene, 1440, -16) })
  gsap.set(finalBackground, { opacity: 0 })
  gsap.set(finalBackgroundImage, {
    y: scaled(scene, 1440, 12),
    scale: 1.025,
    transformOrigin: '50% 50%',
  })
  gsap.set(finalCta, { autoAlpha: 0 })
  gsap.set([finalEyebrow, finalHeadline, finalForm, finalPrivacy], {
    autoAlpha: 0,
    y: scaled(scene, 1440, 14),
  })
  gsap.set(finalSocials, { autoAlpha: 0, y: scaled(scene, 1440, 10) })

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: () => `+=${window.innerHeight * DESKTOP_PIN_DISTANCE}`,
      scrub: 0.12,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })

  timeline
    .addLabel('hero', 0)
    .to(city, {
      x: 0,
      y: 0,
      scale: 1,
      borderRadius: scaled(scene, 1440, 48),
      duration: 2.75,
      ease: 'none',
    }, 0)
    .addLabel('heroExit', 0.48)
    .to(cue, { opacity: 0, y: scaled(scene, 1440, -14), duration: 0.35, ease: 'power1.out' }, 'heroExit')
    .to(copy, { opacity: 0, y: scaled(scene, 1440, -42), duration: 0.8, ease: 'power2.out' }, 'heroExit+=0.08')
    .to(header, { autoAlpha: 0, duration: 0.42, ease: 'power1.out' }, 1.85)
    .addLabel('cloudReveal', 0.68)
    .to(initialClouds, { opacity: 1, duration: 0.45, stagger: 0.016, ease: 'power1.out' }, 'cloudReveal')
    .to(cityReveal, { ...DESKTOP_MASK_CORE, duration: 1.7, ease: 'none' }, 0.72)
    .to(cityReveal, { opacity: 1, duration: 0.36, ease: 'power1.out' }, 0.84)
    .to(cityReveal, { ...DESKTOP_MASK_LOBES, duration: 1.3, ease: 'none' }, 1.45)
    .to(form, { autoAlpha: 1, y: 0, duration: 0.46, ease: 'power1.out' }, 2.15)

  animateCloudVectors(timeline, heroClouds, scene, 1440, 0, 3.65, { opacity: 0.04 })
  animateCloudVectors(timeline, initialClouds, scene, 1440, 1.15, 4.4, { opacity: 0.08 })

  timeline
    .addLabel('cityZoom', 2.75)
    .to(city, {
      '--city-edge-feather': '1.5%',
      x: scaled(scene, 1440, -225.85),
      y: scaled(scene, 1440, -149.86),
      scale: DESKTOP_CITY_ZOOM_SCALE * 1.08,
      borderRadius: 0,
      duration: 2.9,
      ease: 'none',
    }, 'cityZoom')
    .to(cityReveal, { ...MASK_ZOOMED, duration: 2.9, ease: 'none' }, 'cityZoom')
    .to(zoomClouds, { opacity: 1, x: 0, y: 0, duration: 1.35, stagger: 0.012, ease: 'none' }, 'cityZoom-=0.25')

  timeline
    .addLabel('pins', 4.65)
    .to(pins, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: 'power1.out' }, 'pins')
    .addLabel('explore', 5.65)
    .to(city, {
      '--city-edge-feather': '0%',
      x: scaled(scene, 1440, -297.6),
      y: scaled(scene, 1440, -153.4),
      scale: DESKTOP_CITY_FINAL_SCALE * 1.08,
      duration: 3.25,
      ease: 'none',
    }, 'explore')
    .to(cityReveal, { ...MASK_OPEN, duration: 3.05, ease: 'none' }, 'explore')
    .to(pins, {
      x: (index, pin) => Number(pin.dataset.finalX || 0) * (scene.clientWidth / 1440),
      y: (index, pin) => Number(pin.dataset.finalY || 0) * (scene.clientWidth / 1440),
      scale: (index, pin) => Number(pin.dataset.finalScale || 1),
      duration: 3.25,
      ease: 'none',
    }, 'explore')

  animateCloudVectors(timeline, zoomClouds, scene, 1440, 4.35, 3.95, { opacity: 0 })

  timeline
    .addLabel('labels', 6.7)
    .to(labels, {
      opacity: 1,
      y: 0,
      scale: (index, label) => Number(label.dataset.finalScale || 1),
      duration: 0.52,
      stagger: 0.4,
      ease: 'power2.out',
    }, 'labels')
    .to([...heroClouds, ...initialClouds], { opacity: 0, duration: 0.55, ease: 'none' }, 8.2)
    .addLabel('deviceBoundary', 8.72)
    .to(deviceBackdrop, { opacity: 1, duration: 1.35, ease: 'none' }, 'deviceBoundary')
    .to(deviceScreen, {
      '--device-clip-y': '0cqw',
      '--device-clip-x': '0cqw',
      '--device-clip-radius': '6.1685cqw',
      duration: 1.25,
      ease: 'none',
    }, 'deviceBoundary')
    .to([deviceHardware, deviceIsland], { opacity: 1, duration: 0.85, ease: 'none' }, 'deviceBoundary+=0.16')
    .to(form, {
      y: scaled(scene, 1440, -74),
      backgroundColor: 'rgba(255,255,255,0.1)',
      duration: 1.25,
      ease: 'none',
    }, 'deviceBoundary')
    .addLabel('deviceEnclosed', 9)
    .to(device, { scale: 0.9, duration: 1.4, ease: 'none' }, 'deviceEnclosed')
    .to(deviceCity, {
      x: scaled(scene, 1440, -12),
      y: scaled(scene, 1440, -8),
      scale: 1.018,
      duration: 1.4,
      ease: 'none',
    }, 'deviceEnclosed')
    .to(labels, { opacity: 0, duration: 0.62, stagger: 0.02, ease: 'power1.out' }, 'deviceEnclosed')
    .to(form, { y: 0, duration: 0.43, ease: 'none' }, 9.97)
    .addLabel('deviceRotationStart', 10.4)
    .addLabel('deviceLandscape', 'deviceRotationStart')
    .to(pins, { opacity: 0, duration: 0.62, stagger: 0.02, ease: 'none' }, 'deviceRotationStart')
    .to(device, { rotation: 15, scale: 0.675, duration: 1.3, ease: 'none' }, 'deviceLandscape')
    .to(deviceCity, {
      x: scaled(scene, 1440, -18),
      y: scaled(scene, 1440, -12),
      scale: 1.028,
      duration: 1.3,
      ease: 'none',
    }, 'deviceLandscape')
    .addLabel('device75', 11.7)
    .to(device, { rotation: 45, scale: 0.54, duration: 1.25, ease: 'none' }, 'device75')
    .to(deviceCity, {
      x: scaled(scene, 1440, -22),
      y: scaled(scene, 1440, -14),
      scale: 1.035,
      duration: 1.25,
      ease: 'none',
    }, 'device75')
    .addLabel('device45', 12.95)
    .to(device, { rotation: 75, scale: 0.54, duration: 1.15, ease: 'none' }, 'device45')
    .to(deviceWhite, { opacity: 1, duration: 1.3, ease: 'none' }, 'device45+=0.15')
    .to(deviceCity, { opacity: 0, duration: 1.1, ease: 'none' }, 'device45+=0.25')
    .to(form, { backgroundColor: 'rgba(0,0,0,0.1)', duration: 1.05, ease: 'none' }, 'device45+=0.2')
    .addLabel('device15', 14.1)
    .to(device, {
      x: scaled(scene, 1440, -0.092),
      y: scaled(scene, 1440, 84.04),
      rotation: 90,
      scale: 0.432,
      duration: 2,
      ease: 'none',
    }, 'device15')
    .to(form, { autoAlpha: 0, y: scaled(scene, 1440, 18), duration: 0.68, ease: 'power1.in' }, 'device15+=0.05')
    .to(deviceApp, { opacity: 1, duration: 0.72, ease: 'power1.out' }, 'device15+=0.1')
    .to(deviceAppIcon, { scale: 1, duration: 0.82, ease: 'power1.out' }, 'device15+=0.1')
    .to(deviceIntro, { opacity: 1, y: 0, duration: 0.9, ease: 'power1.out' }, 'device15+=0.65')
    .addLabel('appIntroComplete', 15.65)
    .addLabel('finalHandoff', 16)
    .to(finalBackground, { opacity: 1, duration: 1.55, ease: 'none' }, 'finalHandoff')
    .to(finalBackgroundImage, { scale: 1, y: 0, duration: 1.8, ease: 'none' }, 'finalHandoff')
    .to(deviceIntro, {
      opacity: 0,
      y: scaled(scene, 1440, -30),
      duration: 0.95,
      ease: 'power1.in',
    }, 'finalHandoff+=0.13')
    .to(device, {
      opacity: 0,
      y: scaled(scene, 1440, 30),
      scale: 0.4,
      duration: 1.4,
      ease: 'none',
    }, 16.1)
    .to(finalCta, { autoAlpha: 1, duration: 0.01 }, 'finalHandoff+=0.8')
    .to(finalEyebrow, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power1.out',
    }, 'finalHandoff+=0.9')
    .to(finalHeadline, {
      autoAlpha: 1,
      y: 0,
      duration: 0.58,
      ease: 'power1.out',
    }, 'finalHandoff+=1.13')
    .to(finalForm, {
      autoAlpha: 1,
      y: 0,
      duration: 0.48,
      ease: 'power1.out',
    }, 'finalHandoff+=1.57')
    .to(finalPrivacy, {
      autoAlpha: 1,
      y: 0,
      duration: 0.34,
      ease: 'power1.out',
    }, 'finalHandoff+=1.87')
    .to(finalSocials, {
      autoAlpha: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.06,
      ease: 'power1.out',
    }, 'finalHandoff+=2.1')
    .addLabel('complete')

  const handleWaitlistJump = (event) => {
    event.preventDefault()
    window.scrollTo({
      top: timeline.scrollTrigger.end - 1,
      behavior: 'smooth',
    })
  }
  headerCta.addEventListener('click', handleWaitlistJump)

  const pinLoops = createPinIdleLoops(scene, 1440, 1.5, [0, 0.5, 0.9777, 1], DESKTOP_CITY_ZOOM_SCALE)
  const cueLoop = createScrollCueLoop(cueMouse, scene, 1440)
  const syncIdleLoops = () => {
    const time = timeline.time()
    pinLoops.setActive(time >= 4.65 && time < 11.08)
    cueLoop.setActive(time < 0.86)
  }
  timeline.eventCallback('onUpdate', syncIdleLoops)
  syncIdleLoops()

  return () => {
    headerCta.removeEventListener('click', handleWaitlistJump)
    timeline.eventCallback('onUpdate', null)
    cueLoop.kill()
    pinLoops.kill()
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
}

function setupMobileTimeline(scene) {
  const cityReveal = scene.querySelector('.animated-city-reveal')
  const city = scene.querySelector('.animated-city-layer')
  const copy = scene.querySelector('.animated-scene__hero-copy')
  const header = scene.querySelector('.landing-header')
  const cue = scene.querySelector('.animated-scene__scroll-cue')
  const form = scene.querySelector('.animated-scene__form')
  const veil = scene.querySelector('.animated-scene__white-veil')
  const heroClouds = elements(scene, '.animated-mobile-clouds--hero img')
  const cityClouds = elements(scene, '.animated-mobile-clouds--city img')
  const pins = elements(scene, '.animated-pin')
  const labels = orderedLabels(scene)
  const appState = scene.querySelector('.animated-mobile-app-layer')
  const appCopy = appState.querySelector('.app-intro__copy')
  const appIcon = appState.querySelector('.app-intro__icon')
  const launchState = scene.querySelector('.animated-mobile-launch-layer')
  const launchEyebrow = launchState.querySelector('.launch-cta__eyebrow')
  const launchHeadline = launchState.querySelector('.launch-cta h2')
  const launchForm = launchState.querySelector('.launch-cta__form .waitlist-form')
  const launchPrivacy = launchState.querySelector('.launch-cta__privacy')
  const launchSocials = elements(launchState, '.social-links a')
  const headerCta = header.querySelector('.landing-header__cta')
  const cueMouse = cue.querySelector('.mobile-scroll-cue__mouse')

  gsap.set(cityReveal, MASK_CLOSED)
  gsap.set(cityReveal, { opacity: 0 })
  gsap.set(city, {
    '--city-edge-feather': '2.75%',
    opacity: 1,
    x: scaled(scene, 412, 24),
    y: scaled(scene, 412, 18),
    scale: 0.95,
    borderRadius: scaled(scene, 412, 18),
    transformOrigin: '0 0',
  })
  gsap.set(cityClouds, { opacity: 0, x: 0, y: 0 })
  gsap.set(pins, { opacity: 0, scale: 0.72, x: 0, y: 0, transformOrigin: '50% 100%' })
  gsap.set(labels, { opacity: 0, y: scaled(scene, 412, 10), scale: 0.49, transformOrigin: '0 0' })
  gsap.set(form, { autoAlpha: 0, y: scaled(scene, 412, 14) })
  gsap.set(veil, { opacity: 0, backgroundColor: '#ffffff' })
  gsap.set(appState, { autoAlpha: 0 })
  gsap.set(appCopy, { autoAlpha: 0, y: scaled(scene, 412, 12) })
  gsap.set(appIcon, { autoAlpha: 0, y: scaled(scene, 412, 18), scale: 0.96 })
  gsap.set(launchState, { autoAlpha: 0, y: scaled(scene, 412, 12) })
  gsap.set([launchEyebrow, launchHeadline, launchForm, launchPrivacy], {
    autoAlpha: 0,
    y: scaled(scene, 412, 12),
  })
  gsap.set(launchSocials, { autoAlpha: 0, y: scaled(scene, 412, 8) })

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: () => `+=${window.innerHeight * MOBILE_PIN_DISTANCE}`,
      scrub: 0.1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })

  timeline
    .addLabel('hero', 0)
    .to(city, {
      x: 0,
      y: 0,
      scale: 1,
      borderRadius: scaled(scene, 412, 13.44),
      duration: 2.6,
      ease: 'none',
    }, 0)
    .addLabel('heroExit', 0.45)
    .to(cue, { opacity: 0, y: scaled(scene, 412, -10), duration: 0.35, ease: 'power1.out' }, 'heroExit')
    .to(copy, { opacity: 0, y: scaled(scene, 412, -28), duration: 0.74, ease: 'power2.out' }, 'heroExit+=0.08')
    .to(header, { autoAlpha: 0, duration: 0.42, ease: 'power1.out' }, 1.82)
    .addLabel('cloudReveal', 0.66)
    .to(cityClouds, { opacity: 1, duration: 0.45, stagger: 0.024, ease: 'power1.out' }, 'cloudReveal')
    .to(cityReveal, { ...MOBILE_MASK_CORE, duration: 1.65, ease: 'none' }, 0.7)
    .to(cityReveal, { opacity: 1, duration: 0.36, ease: 'power1.out' }, 0.82)
    .to(cityReveal, { ...MOBILE_MASK_LOBES, duration: 1.25, ease: 'none' }, 1.35)
    .to(form, { autoAlpha: 1, y: 0, duration: 0.44, ease: 'power1.out' }, 2.02)

  animateCloudVectors(timeline, heroClouds, scene, 412, 0, 3.5, { opacity: 0.05 })
  animateCloudVectors(timeline, cityClouds, scene, 412, 0.85, 4.8, {
    distanceScale: 0.52,
    opacity: (cloud) => ({ back: 0.62, mid: 0.78, front: 0.9 }[cloud.dataset.cloudDepth] || 0.78),
    varyDuration: false,
  })

  timeline
    .addLabel('cityZoom', 2.6)
    .to(city, {
      x: scaled(scene, 412, 78),
      y: scaled(scene, 412, -164),
      scale: MOBILE_CITY_PIN_SCALE,
      borderRadius: 0,
      duration: 2.65,
      ease: 'none',
    }, 'cityZoom')
    .to(cityReveal, { ...MASK_ZOOMED, duration: 2.65, ease: 'none' }, 'cityZoom')

  timeline
    .addLabel('pins', 4.55)
    .to(pins, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power1.out' }, 'pins')
    .addLabel('explore', 5.25)
    .to(city, {
      x: scaled(scene, 412, -90.65),
      duration: 3.2,
      ease: 'none',
    }, 'explore')
    .to(city, {
      '--city-edge-feather': '0%',
      y: scaled(scene, 412, -289.78),
      scale: MOBILE_CITY_FINAL_SCALE,
      duration: 1.4,
      ease: 'none',
    }, 'explore')
    .to(cityReveal, { ...MASK_OPEN, duration: 3.05, ease: 'none' }, 'explore')
    .to(pins, {
      x: (index, pin) => Number(pin.dataset.finalX || 0) * (scene.clientWidth / 412),
      y: (index, pin) => Number(pin.dataset.finalY || 0) * (scene.clientWidth / 412),
      scale: (index, pin) => Number(pin.dataset.finalScale || 1),
      duration: 3.2,
      ease: 'none',
    }, 'explore')
    .addLabel('labels', 6.65)
    .to(labels, {
      opacity: 1,
      y: 0,
      scale: (index, label) => Number(label.dataset.finalScale || 1),
      duration: 0.52,
      stagger: 0.4,
      ease: 'power2.out',
    }, 'labels')
    .addLabel('fade', 8.45)
    .to(veil, { opacity: 0.42, duration: 0.35, ease: 'none' }, 'fade')
    .to([...pins, ...labels], { opacity: 0, duration: 0.45, ease: 'none' }, 'fade')
    .to(form, { autoAlpha: 0, y: scaled(scene, 412, 10), duration: 0.35, ease: 'power1.in' }, 'fade+=0.1')
    .addLabel('whiteInterstitial', 8.8)
    .to(veil, { opacity: 1, duration: 0.4, ease: 'none' }, 'whiteInterstitial')
    .to(veil, { backgroundColor: '#0b101a', duration: 0.35, ease: 'none' }, 9.2)
    .to(appState, { autoAlpha: 1, duration: 0.01 }, 9.35)
    .to(appCopy, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power1.out' }, 9.45)
    .to(appIcon, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power1.out' }, 9.4)
    .to(veil, { opacity: 0, duration: 0.4, ease: 'none' }, 9.5)
    .addLabel('mobileFinalHandoff', 10.3)
    .to(launchState, { autoAlpha: 1, y: 0, duration: 1.05, ease: 'none' }, 'mobileFinalHandoff')
    .to(appCopy, { autoAlpha: 0, y: scaled(scene, 412, -20), duration: 0.82, ease: 'none' }, 'mobileFinalHandoff+=0.1')
    .to(appIcon, {
      autoAlpha: 0,
      y: scaled(scene, 412, -28),
      scale: 0.96,
      duration: 0.95,
      ease: 'none',
    }, 'mobileFinalHandoff+=0.05')
    .to(appState, { autoAlpha: 0, duration: 0.22, ease: 'none' }, 'mobileFinalHandoff+=0.95')
    .addLabel('launchContent', 10.98)
    .to(launchEyebrow, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power1.out' }, 'launchContent')
    .to(launchHeadline, { autoAlpha: 1, y: 0, duration: 0.62, ease: 'power1.out' }, 'launchContent+=0.18')
    .to(launchForm, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power1.out' }, 'launchContent+=0.52')
    .to(launchPrivacy, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power1.out' }, 'launchContent+=0.78')
    .to(launchSocials, {
      autoAlpha: 1,
      y: 0,
      duration: 0.34,
      stagger: 0.07,
      ease: 'power1.out',
    }, 'launchContent+=0.94')
    .addLabel('complete')

  animateCloudVectors(timeline, cityClouds, scene, 412, 5.25, 3, {
    opacity: 0,
    varyDuration: false,
  })

  const handleWaitlistJump = (event) => {
    event.preventDefault()
    window.scrollTo({
      top: timeline.scrollTrigger.end - 1,
      behavior: 'smooth',
    })
  }
  headerCta.addEventListener('click', handleWaitlistJump)

  const pinLoops = createPinIdleLoops(scene, 412, 2, [0, 0.375, 0.7333, 1], MOBILE_CITY_PIN_SCALE)
  const cueLoop = createScrollCueLoop(cueMouse, scene, 412)
  const syncIdleLoops = () => {
    const time = timeline.time()
    pinLoops.setActive(time >= 4.55 && time < 8.9)
    cueLoop.setActive(time < 0.83)
  }
  timeline.eventCallback('onUpdate', syncIdleLoops)
  syncIdleLoops()

  return () => {
    headerCta.removeEventListener('click', handleWaitlistJump)
    timeline.eventCallback('onUpdate', null)
    cueLoop.kill()
    pinLoops.kill()
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
}

function setupReducedMotion(scene, mobile) {
  const cityReveal = scene.querySelector('.animated-city-reveal')
  const city = scene.querySelector('.animated-city-layer')
  const heroClouds = elements(scene, mobile ? '.animated-mobile-clouds--hero img' : '.animated-clouds--hero img')
  const cityClouds = elements(scene, mobile ? '.animated-mobile-clouds--city img' : '.animated-clouds--initial .figma-cloud')
  const zoomClouds = elements(scene, '.animated-clouds--zoom .figma-cloud')
  const pins = elements(scene, '.animated-pin')
  const labels = elements(scene, '.animated-label')
  const designWidth = mobile ? 412 : 1440

  gsap.set([scene.querySelector('.animated-scene__hero-copy'), scene.querySelector('.landing-header'), scene.querySelector('.animated-scene__scroll-cue')], { opacity: 0 })
  gsap.set([...heroClouds, ...cityClouds, ...zoomClouds], { opacity: 0 })
  gsap.set(cityReveal, { ...MASK_OPEN, opacity: 1 })
  gsap.set(city, mobile ? {
    opacity: 1,
    x: scaled(scene, designWidth, -70),
    y: scaled(scene, designWidth, -276),
    scale: MOBILE_CITY_FINAL_SCALE,
    borderRadius: 0,
    transformOrigin: '0 0',
  } : {
    opacity: 1,
    x: scaled(scene, designWidth, -240),
    y: scaled(scene, designWidth, -115),
    scale: DESKTOP_CITY_FINAL_SCALE,
    borderRadius: 0,
    transformOrigin: '0 0',
  })
  setPinFinalState(scene, designWidth, pins)
  setLabelFinalState(labels)
  gsap.set(scene.querySelector('.animated-scene__form'), { opacity: 1, y: 0 })
  const veil = scene.querySelector('.animated-scene__white-veil')
  if (veil) gsap.set(veil, { opacity: mobile ? 0.35 : 0 })

  if (mobile) {
    const appState = scene.querySelector('.animated-mobile-app-layer')
    const launchState = scene.querySelector('.animated-mobile-launch-layer')

    gsap.set(veil, { opacity: 0 })
    gsap.set(scene.querySelector('.animated-scene__form'), { autoAlpha: 0 })
    gsap.set(appState, { autoAlpha: 0 })
    gsap.set(launchState, { autoAlpha: 1, y: 0 })
    gsap.set([
      launchState.querySelector('.launch-cta__eyebrow'),
      launchState.querySelector('.launch-cta h2'),
      launchState.querySelector('.launch-cta__form .waitlist-form'),
      launchState.querySelector('.launch-cta__privacy'),
      ...elements(launchState, '.social-links a'),
    ], { autoAlpha: 1, y: 0 })
  }

  if (!mobile) {
    const scale = scene.clientWidth / 1440
    const device = scene.querySelector('.animated-device')
    const deviceScreen = scene.querySelector('.animated-device__screen')
    const deviceApp = scene.querySelector('.animated-device__app-layer')
    const finalCta = scene.querySelector('.animated-final-cta')

    gsap.set(scene.querySelector('.animated-scene__device-backdrop'), { opacity: 1 })
    gsap.set(device, {
      x: -0.092 * scale,
      y: 84.04 * scale,
      rotation: 90,
      scale: 0.432,
      transformOrigin: '50% 50%',
    })
    gsap.set(scene.querySelector('.animated-device__hardware'), { opacity: 1 })
    gsap.set(scene.querySelector('.animated-device__island'), { opacity: 1 })
    gsap.set(deviceScreen, {
      '--device-clip-y': '0cqw',
      '--device-clip-x': '0cqw',
      '--device-clip-radius': '6.1685cqw',
    })
    gsap.set(scene.querySelector('.animated-device__city-content'), { opacity: 0 })
    gsap.set(scene.querySelector('.animated-device__white-screen'), { opacity: 1 })
    gsap.set(deviceApp, { opacity: 1 })
    gsap.set(deviceApp.querySelector('.animated-app-icon'), { scale: 1 })
    gsap.set(scene.querySelector('.animated-device-intro'), { opacity: 1, y: 0 })
    gsap.set(scene.querySelector('.animated-scene__form'), { autoAlpha: 0 })
    gsap.set(scene.querySelector('.animated-final-background'), { opacity: 1 })
    gsap.set(scene.querySelector('.animated-final-background img'), { y: 0, scale: 1 })
    gsap.set([device, scene.querySelector('.animated-device-intro')], { opacity: 0 })
    gsap.set(finalCta, { autoAlpha: 1 })
    gsap.set([
      finalCta.querySelector('.launch-cta__eyebrow'),
      finalCta.querySelector('.launch-cta h2'),
      finalCta.querySelector('.launch-cta__form .waitlist-form'),
      finalCta.querySelector('.launch-cta__privacy'),
      ...elements(finalCta, '.social-links a'),
    ], { opacity: 1, y: 0 })
  }

  return () => undefined
}

export function useAnimatedExperience() {
  const root = useRef(null)

  useGSAP(() => {
    const matchMedia = gsap.matchMedia()
    let active = true
    let refreshFrame = 0

    matchMedia.add({
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { desktop, mobile, reducedMotion } = context.conditions
      const scene = root.current.querySelector(`[data-animation-scene="${desktop ? 'desktop' : 'mobile'}"]`)

      if (!scene) return undefined
      if (reducedMotion) return setupReducedMotion(scene, mobile)
      if (desktop) return setupDesktopTimeline(scene)
      return setupMobileTimeline(scene)
    })

    const scheduleRefresh = () => {
      if (!active || refreshFrame) return
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0
        if (active) ScrollTrigger.refresh()
      })
    }

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const activeScene = root.current.querySelector(`[data-animation-scene="${mobile ? 'mobile' : 'desktop'}"]`)
    const criticalImages = elements(
      activeScene,
      '.landing-header__logo, .animated-city-layer__image, .animated-clouds--hero img, .animated-mobile-clouds--hero img',
    )
    const imageReady = Promise.all(criticalImages.map((image) => (
      image.decode ? image.decode().catch(() => undefined) : Promise.resolve()
    )))

    Promise.all([document.fonts?.ready || Promise.resolve(), imageReady]).then(scheduleRefresh)

    return () => {
      active = false
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame)
      matchMedia.revert()
    }
  }, { scope: root })

  return root
}
