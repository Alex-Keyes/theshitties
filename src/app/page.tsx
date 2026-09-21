import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Trophy } from "@/components/trophy";
import { NomineeList } from "@/components/ui";
import { finalize, listNominees, season } from "@/lib/service";
import { voterId } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function Home() {
  await finalize();
  const [s, items] = await Promise.all([
    season(),
    listNominees(await voterId()),
  ]);
  const closed = new Date(s.closesAt).getTime() <= Date.now();
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            {s.id} AWARDS · {closed ? "VOTING CLOSED" : "NOMINATIONS ARE OPEN"}
          </div>
          <h1>
            Honoring the worst
            <br />
            upgrades in
            <br />
            the <em>world.</em>
          </h1>
          <p>
            More ads. Fewer features. Higher prices.
            <br />
            Nominate the products that got worse.
          </p>
          <div className="hero-actions">
            <Link className="button" href={closed ? "/results" : "/submit"}>
              {closed ? "See the dishonorees" : "Nominate the worst"}{" "}
              <ArrowUpRight size={17} />
            </Link>
            <Link className="text-link" href="#nominees">
              Meet the nominees <ArrowDown size={15} />
            </Link>
          </div>
        </div>
        <div className="trophy-panel">
          <span className="edition">
            THE FIRST ANNUAL
            <br />
            <strong>SHITTY AWARDS</strong>
          </span>
          <Trophy />
          <span className="trophy-caption">A new low. A new honor.</span>
          <span className="orbit-text">EXCELLENCE IN DISAPPOINTMENT</span>
        </div>
      </section>
      <div className="ticker">
        <div className="shell">
          <span>PROGRESS, BUT BACKWARDS.</span>
          <span>✳</span>
          <span>LESS VALUE. MORE SHAREHOLDER VALUE.</span>
          <span>✳</span>
          <span>IT USED TO BE BETTER.</span>
          <span>✳</span>
        </div>
      </div>
      <section id="nominees" className="shell ballot">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE PEOPLE HAVE COMPLAINTS</div>
            <h2>
              The {s.id} nominees<span>.</span>
            </h2>
          </div>
          <p>
            {closed ? (
              "The votes are in. The bar is on the floor."
            ) : (
              <>
                Vote for the worst. Yes, you can pick more than one.
                <br />
                <span>
                  Closes{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "America/New_York",
                  }).format(new Date(s.closesAt))}{" "}
                  ET.
                </span>
              </>
            )}
          </p>
        </div>
        {!process.env.DATABASE_URL && (
          <div className="demo-note">
            LOCAL PREVIEW · Sample companies are fictional. Real nominations can
            be added below.
          </div>
        )}
        <NomineeList
          items={items.filter((n) => n.seasonId === s.id)}
          closed={closed}
        />
        <p className="ballot-footnote">
          No account. No downvotes. Just a well-earned upvote.{" "}
          <Link href="/how-it-works">How voting works ↗</Link>
        </p>
      </section>
      <section className="manifesto shell">
        <span className="eyebrow">IT’S NOT JUST YOU.</span>
        <h2>
          Things really <em>are</em>
          <br />
          getting shittier.
        </h2>
        <div>
          <p>
            The app you loved. The service you paid for. The feature that
            quietly disappeared. Somewhere along the way, “better” started
            meaning better for someone else.
          </p>
          <p>
            The Shitties gives those decisions the recognition they deserve. You
            bring the receipts. The internet picks the winners.
          </p>
          <Link className="text-link" href="/how-it-works">
            A little more about this whole thing <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
