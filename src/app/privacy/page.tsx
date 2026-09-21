export const metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <article className="page narrow prose">
      <div className="eyebrow">NO ACCOUNT. LESS BAGGAGE.</div>
      <h1>
        A little <em>privacy.</em>
      </h1>
      <h2>What we store</h2>
      <p>
        Your public nomination text, source links, submission time, votes, and
        any reports you send. Do not include personal information in a
        nomination or report.
      </p>
      <h2>Browser cookies</h2>
      <p>
        An essential, HTTP-only cookie stores a signed random browser identifier
        for up to 400 days. It connects your browser to its votes. It is not an
        advertising identifier. Administrators receive a separate eight-hour
        sign-in cookie.
      </p>
      <h2>Abuse prevention</h2>
      <p>
        We use a keyed hash of the connection IP address for short-window rate
        limits. The application does not store raw IP addresses in its database.
        The hosting provider may keep its own operational request logs. Expired
        rate-limit records are reused on the next request for that key.
      </p>
      <h2>No ad tracking</h2>
      <p>
        This site does not include advertising, third-party analytics, or social
        tracking pixels. Source links take you to other websites with their own
        policies.
      </p>
      <h2>Removing a vote or reporting content</h2>
      <p>
        Click your selected vote again to remove it. Use the report button on a
        nomination to request a content review. Clearing your browser cookie
        disconnects your browser from its previous votes; it does not delete
        those votes.
      </p>
    </article>
  );
}
