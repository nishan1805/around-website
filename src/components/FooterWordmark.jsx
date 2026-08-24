import { assets } from '../lib/assets.js'

function FooterWordmark({ mobile = false }) {
  return (
    <footer className="footer-wordmark" data-node-id={mobile ? '1249:5937' : '1200:105441'}>
      <img src={assets.footerWordmark} alt="around" />
    </footer>
  )
}

export default FooterWordmark
