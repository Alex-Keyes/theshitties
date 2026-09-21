"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./ui";
import type { Nominee, Season } from "@/lib/constants";
export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await api("admin/login", {
            password: new FormData(e.currentTarget).get("password"),
          });
          router.refresh();
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Administrator password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        Sign in
      </button>
    </form>
  );
}
export function AdminPanel({
  items,
  reports,
  season,
}: {
  items: Nominee[];
  reports: {
    id: string;
    nominee_id: string;
    reason: string;
    company: string;
  }[];
  season: Season;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function act(body: unknown) {
    setBusy(true);
    setMessage("");
    try {
      await api("admin/action", body);
      setMessage("Saved.");
      router.refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-panel">
      <button
        className="text-button"
        onClick={async () => {
          await api("admin/logout", {});
          router.refresh();
        }}
      >
        Sign out
      </button>
      <p role="status">{message}</p>
      <section>
        <h2>Award settings</h2>
        <p>
          Current deadline:{" "}
          {new Date(season.closesAt).toLocaleString("en-US", {
            timeZone: "America/New_York",
          })}{" "}
          ET
        </p>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            const value = String(new FormData(e.currentTarget).get("date"));
            act({
              action: "deadline",
              date: new Date(value + "Z").toISOString(),
            });
          }}
        >
          <label>
            Closing date and time (UTC)
            <input
              name="date"
              type="datetime-local"
              defaultValue={new Date(season.closesAt)
                .toISOString()
                .slice(0, 16)}
              required
            />
          </label>
          <button
            disabled={busy || new Date(season.closesAt).getTime() <= Date.now()}
            className="button"
          >
            Update deadline
          </button>
        </form>
      </section>
      <section>
        <h2>Reports ({reports.length})</h2>
        {reports.length ? (
          reports.map((r) => (
            <div className="admin-row" key={r.id}>
              <strong>{r.company}</strong>
              <p>{r.reason}</p>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => act({ action: "resolve", id: r.id })}
              >
                Mark resolved
              </button>
            </div>
          ))
        ) : (
          <p>No unresolved reports.</p>
        )}
      </section>
      <section>
        <h2>Nominations</h2>
        {items.map((n) => (
          <div className="admin-row" key={n.id}>
            <strong>
              {n.company} · {n.headline}
            </strong>
            <p>
              {n.status} · {n.count} votes
            </p>
            <div className="admin-controls">
              <button
                className="button secondary"
                disabled={busy}
                onClick={() =>
                  act({
                    action: "moderate",
                    id: n.id,
                    status: n.status === "hidden" ? "visible" : "hidden",
                  })
                }
              >
                {n.status === "hidden" ? "Restore" : "Hide"}
              </button>
              {n.status === "duplicate" && (
                <button
                  className="button secondary"
                  disabled={busy}
                  onClick={() =>
                    act({ action: "moderate", id: n.id, status: "visible" })
                  }
                >
                  Restore as original
                </button>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  act({
                    action: "moderate",
                    id: n.id,
                    status: "duplicate",
                    duplicateOf: new FormData(e.currentTarget).get("original"),
                  });
                }}
              >
                <select
                  name="original"
                  aria-label={"Original nomination for " + n.company}
                  required
                  defaultValue=""
                >
                  <option value="">Duplicate of…</option>
                  {items
                    .filter(
                      (x) =>
                        x.id !== n.id &&
                        x.status === "visible" &&
                        x.seasonId === n.seasonId,
                    )
                    .map((x) => (
                      <option value={x.id} key={x.id}>
                        {x.company} — {x.headline}
                      </option>
                    ))}
                </select>
                <button disabled={busy} className="button secondary">
                  Link duplicate
                </button>
              </form>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
