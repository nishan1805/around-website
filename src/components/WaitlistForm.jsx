import { useId } from 'react'

function WaitlistForm({ className = '', compact = false }) {
  const emailId = useId()

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form
      className={`waitlist-form ${compact ? 'waitlist-form--compact' : ''} ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="waitlist-form__inner">
        <label className="sr-only" htmlFor={emailId}>
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          required
        />
        <button type="submit">Join Waitlist</button>
      </div>
    </form>
  )
}

export default WaitlistForm
