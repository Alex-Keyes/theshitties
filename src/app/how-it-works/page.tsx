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
        enshittification: products, services, and public systems that become
        worse for the people using them.
      </p>
      <h2>01. Make your case.</h2>
      <p>
        Nominate a specific change that began or materially expanded during the
        award year. Explain the before, after, and damage; choose a category and
        sector; and add dated receipts. Submissions appear immediately. No
        account needed.
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
      <h2>{categories.length} ways to disappoint.</h2>
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
      <h2>The record keeps going.</h2>
      <p>
        Each season has its own ballot and eligibility window. Company pages
        connect nominations across years, while outcome labels show whether the
        offending change is still active, partially fixed, reversed, or
        settled. Reversals and partial fixes appear in the Backlash Worked
        gallery.
      </p>
      <Link className="button" href="/submit">
        Submit a nomination ↗
      </Link>
    </article>
  );
}
