import Link from "next/link";
import { notFound } from "next/navigation";
import { NomineeBadges } from "@/components/ui";
import { category, sector } from "@/lib/constants";
import { companyRollups } from "@/lib/service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return { title: `${name} — record` };
}

export default async function CompanyRecord({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const group = (await companyRollups()).find(
    (item) => item.company.toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
  if (!group) notFound();
  return (
    <div className="page narrow prose">
      <Link className="back" href="/repeat-offenders">
        ← Repeat offenders
      </Link>
      <div className="eyebrow">THE PERMANENT RECORD</div>
      <h1>{group.company}</h1>
      <p className="lede">
        {group.nominations.length} nomination
        {group.nominations.length === 1 ? "" : "s"} across {group.seasons.size}{" "}
        season{group.seasons.size === 1 ? "" : "s"}, with {group.votes} total
        votes.
      </p>
      <div className="record-list">
        {group.nominations.map((nominee) => (
          <Link
            className="record-card outcome-card"
            href={`/nominees/${nominee.id}`}
            key={nominee.id}
          >
            <span>{nominee.seasonId}</span>
            <div>
              <small>
                {category(nominee.category).name} · {sector(nominee.sector).name}
              </small>
              <h2>{nominee.headline}</h2>
              <p>{nominee.count} votes</p>
              <NomineeBadges nominee={nominee} />
            </div>
            <b>↗</b>
          </Link>
        ))}
      </div>
    </div>
  );
}
