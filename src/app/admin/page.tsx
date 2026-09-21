import { isAdmin } from "@/lib/auth";
import { listNominees, season, finalize } from "@/lib/service";
import { getDb } from "@/lib/db";
import { AdminLogin, AdminPanel } from "@/components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  const authenticated = await isAdmin();
  if (!authenticated)
    return (
      <div className="page narrow">
        <div className="eyebrow">BACKSTAGE</div>
        <h1>
          Administrator <em>access.</em>
        </h1>
        <AdminLogin />
      </div>
    );
  await finalize();
  const [items, s, reports] = await Promise.all([
    listNominees(null, true),
    season(),
    (await getDb()).query<{
      id: string;
      nominee_id: string;
      reason: string;
      company: string;
    }>(
      "SELECT r.*,n.company FROM reports r JOIN nominees n ON n.id=r.nominee_id WHERE r.resolved=0 ORDER BY r.created_at DESC",
    ),
  ]);
  return (
    <div className="page shell">
      <div className="eyebrow">BACKSTAGE</div>
      <h1>
        Manage the <em>mess.</em>
      </h1>
      <AdminPanel
        items={JSON.parse(JSON.stringify(items))}
        season={JSON.parse(JSON.stringify(s))}
        reports={reports}
      />
    </div>
  );
}
