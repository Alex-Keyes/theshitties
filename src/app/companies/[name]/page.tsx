import Link from "next/link";
import { notFound } from "next/navigation";
import { NomineeCard } from "@/components/ui";
import { BrandMark } from "@/components/brand-mark";
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
    <div className="page visual-page">
      <Link className="back" href="/repeat-offenders">
        ← Repeat offenders
      </Link>
      <div className="company-record-head">
        <div>
          <div className="eyebrow">THE PERMANENT RECORD</div>
          <h1>{group.company}</h1>
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
        </div>
        <BrandMark company={group.company} />
      </div>
      <div className="ballot-grid record-grid">
        {group.nominations.map((nominee) => (
          <NomineeCard nominee={nominee} showVote={false} key={nominee.id} />
        ))}
      </div>
    </div>
  );
}
