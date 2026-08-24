import { assets } from '../lib/assets.js'

const links = [
  ['twitter', 'X', 'https://x.com'],
  ['instagram', 'Instagram', 'https://instagram.com'],
  ['linkedin', 'LinkedIn', 'https://linkedin.com'],
  ['youtube', 'YouTube', 'https://youtube.com'],
  ['facebook', 'Facebook', 'https://facebook.com'],
]

function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Social links">
      {links.map(([key, label, href]) => (
        <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={label}>
          <img src={assets.social[key]} alt="" />
        </a>
      ))}
    </nav>
  )
}

export default SocialLinks
