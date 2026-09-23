import Link from "next/link";
import { resultArchives } from "@/lib/service";
import { categories } from "@/lib/constants";
export const dynamic = "force-dynamic";
export const metadata = { title: "Past dishonors" };
export default async function Results() {
  const archives = await resultArchives();
  return (
    <div className="page narrow prose">
      <div className="eyebrow">THE HALL OF SHAME</div>
      <h1>
        Past <em>dishonors.</em>
      </h1>
      <p className="lede">
        The votes are temporary. The stain on history is forever.
      </p>
      {!archives.length ? (
        <div className="empty">
          <h2>History is still being made.</h2>
          <p>
            Our inaugural awards are open. Winners will appear here after voting
            closes.
          </p>
          <Link className="button" href="/#nominees">
            Explore the nominees ↗
          </Link>
        </div>
      ) : (
        archives.map((a) => (
          <section className="archive" key={a.season_id}>
            <h2>{a.season_id} · Official results</h2>
            {[
              {
                id: "overall",
                name: "The Golden Shitty",
                items: a.snapshot.overall,
              },
                ...categories.map((c) => ({
                  ...c,
                  items: a.snapshot.categories[c.id] ?? [],
                })),
            ].map((c) => (
              <div key={c.id}>
                <h3>{c.name}</h3>
                {c.items.length ? (
                  c.items.map((n) => (
                    <p key={n.id}>
                      <strong>{n.company}</strong> — {n.headline}{" "}
                      <span className="muted">({n.count} votes)</span>
                    </p>
                  ))
                ) : (
                  <p>No award — no nominations.</p>
                )}
              </div>
            ))}
            <p className="muted">
              Results preserve the nominations and vote totals at closing. Tied
              entries share the award.
            </p>
          </section>
        ))
      )}
    </div>
  );
}
