import Link from "next/link";
import { companyRollups } from "@/lib/service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Repeat offenders" };

export default async function RepeatOffenders() {
  const companies = (await companyRollups()).filter(
    (group) => group.nominations.length > 1,
  );
  return (
    <div className="page narrow prose">
      <div className="eyebrow">THE SERIAL DISAPPOINTERS</div>
      <h1>
        Repeat <em>offenders.</em>
      </h1>
      <p className="lede">
        Every season is judged on its own. This ledger remembers the companies
        and institutions that find a new way back onto the ballot.
      </p>
      {companies.length ? (
        <div className="record-list">
          {companies.map((group, index) => (
            <Link
              className="record-card"
              href={`/companies/${encodeURIComponent(group.company)}`}
              key={group.company.toLocaleLowerCase()}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{group.company}</h2>
                <p>
                  {group.nominations.length} nominations · {group.seasons.size}{" "}
                  season{group.seasons.size === 1 ? "" : "s"} · {group.votes}{" "}
                  votes
                </p>
              </div>
              <b>↗</b>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No repeat offenders—yet.</h2>
          <p>A company needs at least two public nominations to make this list.</p>
          <Link className="button" href="/#nominees">
            See this year’s nominees ↗
          </Link>
        </div>
      )}
    </div>
  );
}
