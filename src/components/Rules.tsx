import './Rules.css'

export function Rules() {
  return (
    <section
      className="pb-rules animate-in animate-delay-1"
      aria-labelledby="rules-heading"
    >
      <h2 id="rules-heading" className="pb-rules__title">
        Quick rules
      </h2>
      <ul className="pb-rules__list">
        <li>
          Win and move up — bottom court is <strong>Bakhti</strong> (rubbish court).
        </li>
        <li>
          The <strong>earlier you arrive</strong>, the <strong>higher court</strong> you
          start on — better start.
        </li>
        <li>
          <strong>6–9 courts</strong> · climb to <strong>court 1</strong>.
        </li>
        <li>
          Only <strong>Champs court</strong> (court 1) wins count — most wins wins the
          week.
        </li>
      </ul>
    </section>
  )
}
