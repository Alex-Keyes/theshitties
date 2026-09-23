import Link from "next/link";
import { companyRollups } from "@/lib/service";
import { BrandMark } from "@/components/brand-mark";

export const dynamic = "force-dynamic";
export const metadata = { title: "Repeat offenders" };

export default async function RepeatOffenders() {
  const companies = (await companyRollups()).filter(
    (group) => group.nominations.length > 1,
  );
  return (
    <div className="page visual-page">
      <div className="eyebrow">THE SERIAL DISAPPOINTERS</div>
      <h1>
        Repeat <em>offenders.</em>
      </h1>
      <p className="lede">
        Different year. Same culprits. Companies with two or more nominations.
      </p>
      {companies.length ? (
        <div className="company-record-list">
          {companies.map((group, index) => (
            <Link
              className="company-record-card"
              href={`/companies/${encodeURIComponent(group.company)}`}
              key={group.company.toLocaleLowerCase()}
            >
              <span className="eyebrow">
                {String(index + 1).padStart(2, "0")} · THE REPEAT OFFENDERS
              </span>
              <BrandMark company={group.company} />
              <h2>{group.company}</h2>
              <div className="record-stats">
                <div>
                  <strong>{group.nominations.length}</strong>
                  <span>Nominations</span>
                </div>
                <div>
                  <strong>{group.seasons.size}</strong>
                  <span>Seasons</span>
                </div>
                <div>
                  <strong>{group.votes}</strong>
                  <span>Votes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No repeat offenders—yet.</h2>
          <p>
            A company needs at least two public nominations to make this list.
          </p>
          <Link className="button" href="/#nominees">
            See this year’s nominees ↗
          </Link>
        </div>
      )}
    </div>
  );
}
