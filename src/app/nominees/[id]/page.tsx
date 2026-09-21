import Link from "next/link";
import { notFound } from "next/navigation";
import { listNominees, season } from "@/lib/service";
import { voterId } from "@/lib/auth";
import { category } from "@/lib/constants";
import { Vote, Report } from "@/components/ui";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = (await listNominees()).find((n) => n.id === id);
  return {
    title: n?.headline || "Nomination",
    description: n?.description.slice(0, 160),
  };
}
export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [items, s] = await Promise.all([
    listNominees(await voterId(), true),
    season(),
  ]);
  const n = items.find((n) => n.id === id);
  if (!n || n.status === "hidden") notFound();
  return (
    <article className="page narrow">
      <Link className="back" href="/#nominees">
        ← Back to the nominees
      </Link>
      <div className="eyebrow">
        {n.seasonId} COMMUNITY NOMINATION · {category(n.category)?.name}
      </div>
      <h1>{n.headline}</h1>
      <div className="detail-company">
        <strong>{n.company}</strong>
        <span>
          Submitted{" "}
          {new Date(n.createdAt).toLocaleDateString("en-US", {
            timeZone: "America/New_York",
            dateStyle: "medium",
          })}
        </span>
      </div>
      {n.status === "duplicate" ? (
        <aside className="notice">
          This nomination duplicates an existing entry.{" "}
          <Link href={"/nominees/" + n.duplicateOf}>Visit the original →</Link>
        </aside>
      ) : (
        <Vote
          nominee={n}
          closed={
            n.seasonId !== s.id || new Date(s.closesAt).getTime() <= Date.now()
          }
        />
      )}
      <div className="detail-body">{n.description}</div>
      <section className="sources">
        <h2>The receipts</h2>
        {n.sources.map((url, i) => (
          <a
            key={url + i}
            href={url}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {String(i + 1).padStart(2, "0")} · {new URL(url).hostname}{" "}
            <span>↗</span>
          </a>
        ))}
      </section>
      <p className="muted">
        A community-submitted nomination, not an official award announcement.
        Votes reflect informal community opinion.
      </p>
      {n.status === "visible" && <Report id={n.id} />}
    </article>
  );
}
