import Link from "next/link";
import { categories } from "@/lib/constants";
export const metadata = { title: "How it works" };
export default function How() {
  return (
    <article className="page narrow prose">
      <div className="eyebrow">A VERY QUESTIONABLE HONOR</div>
      <h1>
        Bad changes.
        <br />
        <em>Good recognition.</em>
      </h1>
      <p className="lede">
        The Shitties is an independent, annual community award for
        enshittification: products and services that become worse for the people
        using them.
      </p>
      <h2>01. Make your case.</h2>
      <p>
        Nominate a specific change to a company or product. Explain the before
        and after, pick a category, and include supporting links. Submissions
        appear immediately. No account needed.
      </p>
      <h2>02. Vote for the worst.</h2>
      <p>
        Upvote as many nominations as you like. Click again to remove your vote.
        A browser cookie remembers your choices; clearing it or using a
        different browser can allow another vote. This is an informal community
        poll, not a verified one-person-one-vote election.
      </p>
      <h2>03. Dishonor where it’s due.</h2>
      <p>
        Nominations and voting close together at the published deadline. The
        most-upvoted entry in each category wins. The overall leader also
        receives The Golden Shitty. Ties mean joint winners. Results are saved
        when the season closes.
      </p>
      <h2>Five ways to disappoint.</h2>
      <div className="category-descriptions">
        {categories.map((c) => (
          <div key={c.id}>
            <span>{c.symbol}</span>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
      <p>
        No category nominees means no award in that category. If nominees tie at
        zero votes, they remain joint leaders under the same rules.
      </p>
      <Link className="button" href="/submit">
        Submit a nomination ↗
      </Link>
    </article>
  );
}
