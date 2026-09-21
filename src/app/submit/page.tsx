import { SubmissionForm } from "@/components/ui";
import { season } from "@/lib/service";
export const dynamic = "force-dynamic";
export const metadata = { title: "Submit a nomination" };
export default async function Submit() {
  const s = await season();
  return (
    <div className="page narrow">
      <div className="eyebrow">THE {s.id} SHITTIES</div>
      <h1>
        Give worse its <em>due.</em>
      </h1>
      <p className="lede">
        Know a product that took a turn for the worse? Make your case. Bring the
        receipts.
      </p>
      <SubmissionForm closed={new Date(s.closesAt).getTime() <= Date.now()} />
    </div>
  );
}
