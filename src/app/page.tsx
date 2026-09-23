import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Trophy } from "@/components/trophy";
import { NomineeList } from "@/components/ui";
import { CompanyStrip, FeaturedChanges } from "@/components/company-visuals";
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
  const currentNominees = items.filter((n) => n.seasonId === s.id);
  return (
    <>
      <section className="hero visual-hero shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            {s.id} AWARDS · {closed ? "VOTING CLOSED" : "NOMINATIONS ARE OPEN"}
          </div>
          <h1>
            Brands you know.
            <br />
            Changes you <em>hate.</em>
          </h1>
          <p>
            Higher prices. Smaller perks. The same old bullshit. The annual
            awards for things that got worse.
          </p>
          <div className="hero-actions">
            <Link className="button" href={closed ? "/results" : "#nominees"}>
              {closed ? "See the dishonorees" : "Vote for the worst"}{" "}
              <ArrowDown size={17} />
            </Link>
            <Link className="text-link" href="/submit">
              Nominate a downgrade <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="hero-evidence">
          <FeaturedChanges nominees={currentNominees} />
          <div className="award-seal">
            <Trophy />
            <span>
              A GOLDEN SHIT.
              <br />
              FOR A JOB BADLY DONE.
            </span>
          </div>
        </div>
      </section>
      <CompanyStrip nominees={currentNominees} />
      <div className="ticker">
        <div className="shell">
          <span>PROGRESS, DOWN THE DRAIN.</span>
          <span>〰</span>
          <span>LESS VALUE. MORE SHAREHOLDER VALUE.</span>
          <span>〰</span>
          <span>IT USED TO BE BETTER.</span>
          <span>〰</span>
        </div>
      </div>
      <section id="nominees" className="shell ballot">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SPOT THE DOWNGRADE. CAST YOUR VOTE.</div>
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
        <NomineeList items={currentNominees} closed={closed} />
        <p className="ballot-footnote">
          No account. No downvotes. Give a shit about as many as you like.{" "}
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
            You bring the receipts. The internet picks the winners. We give bad
            decisions the recognition they deserve.
          </p>
          <p>
            Each year starts a fresh ballot. The archives remember who keeps
            coming back.
          </p>
          <Link className="text-link" href="/how-it-works">
            A little more about this whole thing <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
