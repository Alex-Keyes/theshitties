import Link from "next/link";
import { NomineeCard } from "@/components/ui";
import { publicHistory } from "@/lib/service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Backlash worked" };

export default async function BacklashWorked() {
  const entries = (await publicHistory()).filter(
    (nominee) =>
      nominee.outcome === "partial" || nominee.outcome === "reversed",
  );
  return (
    <div className="page visual-page">
      <div className="eyebrow">COMPLAINING: OCCASIONALLY EFFECTIVE</div>
      <h1>
        Backlash <em>worked.</em>
      </h1>
      <p className="lede">
        The rare good-news file: nominated changes that were reversed or at
        least partly repaired after people pushed back.
      </p>
      {entries.length ? (
        <div className="ballot-grid record-grid">
          {entries.map((nominee) => (
            <NomineeCard nominee={nominee} showVote={false} key={nominee.id} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Nothing has been unfucked yet.</h2>
          <p>
            When a nominated change is reversed or partly fixed, it will appear
            here.
          </p>
          <Link className="button" href="/#nominees">
            Keep up the pressure ↗
          </Link>
        </div>
      )}
    </div>
  );
}
