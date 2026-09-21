"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowUpRight, Check, Flag, Loader2 } from "lucide-react";
import { categories, category, type Nominee } from "@/lib/constants";
export async function api(path: string, body: unknown) {
  const res = await fetch("/api/" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Please try again.");
  return data;
}
let voterSession: Promise<unknown> | undefined;
async function ensureVoterSession() {
  if (!voterSession)
    voterSession = api("session", {}).catch((e) => {
      voterSession = undefined;
      throw e;
    });
  await voterSession;
}
export function Vote({
  nominee,
  closed = false,
}: {
  nominee: Nominee;
  closed?: boolean;
}) {
  const [state, setState] = useState({
    count: nominee.count,
    voted: nominee.voted,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    () => setState({ count: nominee.count, voted: nominee.voted }),
    [nominee.count, nominee.voted],
  );
  return (
    <div className="vote-wrap">
      <button
        className={"vote " + (state.voted ? "voted" : "")}
        aria-label={`${state.voted ? "Remove your vote for" : "Give a shit about"} ${nominee.company}`}
        aria-pressed={state.voted}
        disabled={busy || closed}
        onClick={async () => {
          const prev = state;
          setBusy(true);
          setError("");
          setState({
            count: state.count + (state.voted ? -1 : 1),
            voted: !state.voted,
          });
          try {
            await ensureVoterSession();
            setState(
              await api(`nominees/${nominee.id}/vote`, { active: !prev.voted }),
            );
          } catch (e) {
            setState(prev);
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <ArrowUp size={17} />
        <span>{state.count.toLocaleString()}</span>
        <small>{state.voted ? "GIVEN" : "GIVE A SHIT"}</small>
      </button>
      {error && (
        <span role="alert" className="vote-error">
          {error}
        </span>
      )}
    </div>
  );
}
export function NomineeList({
  items,
  closed,
}: {
  items: Nominee[];
  closed: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("top");
  const filtered = items
    .filter((n) => filter === "all" || n.category === filter)
    .sort((a, b) =>
      sort === "new"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : b.count - a.count ||
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  return (
    <>
      <div className="filters" aria-label="Filter nominees">
        <button
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All nominees <span>{items.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="list-meta">
        <span>
          {filtered.length} NOMINATION{filtered.length === 1 ? "" : "S"} · ONE
          VERY LOW BAR
        </span>
        <label>
          Sort by{" "}
          <select
            aria-label="Sort nominees"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="top">Most votes</option>
            <option value="new">Newest</option>
          </select>
        </label>
      </div>
      <div className="nominee-list">
        {filtered.length ? (
          filtered.map((n, i) => (
            <article className="nominee" key={n.id}>
              <span className="rank">{String(i + 1).padStart(2, "0")}</span>
              <div className="nominee-copy">
                <div className="nominee-overline">
                  <span>{n.company}</span>
                  <span className="category-tag">
                    {category(n.category)?.name}
                  </span>
                </div>
                <Link className="nominee-title" href={"/nominees/" + n.id}>
                  {n.headline}
                  <ArrowUpRight size={19} />
                </Link>
                <p>{n.description}</p>
              </div>
              <Vote nominee={n} closed={closed} />
            </article>
          ))
        ) : (
          <div className="empty">
            <div className="empty-plunger" aria-hidden="true">
              ↟
            </div>
            <h3>The bowl is clean—for now.</h3>
            <p>
              No nominations have hit the fan yet. Know something that got
              worse?
            </p>
            <Link className="button" href="/submit">
              Make the first nomination <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
export function SubmissionForm({ closed }: { closed: boolean }) {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [similar, setSimilar] = useState<
    { id: string; company: string; headline: string }[]
  >([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch("/api/similar?q=" + encodeURIComponent(company), {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then(setSimilar)
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [company]);
  if (closed)
    return (
      <div className="empty">
        <h2>The ballot is closed.</h2>
        <Link href="/results">See the results →</Link>
      </div>
    );
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const data = new FormData(e.currentTarget);
        try {
          const result = await api("nominees", {
            company,
            headline: data.get("headline"),
            description: data.get("description"),
            category: data.get("category"),
            sources: String(data.get("sources"))
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            website: data.get("website"),
          });
          router.push("/nominees/" + result.id);
          router.refresh();
        } catch (e) {
          setError((e as Error).message);
          setBusy(false);
        }
      }}
    >
      <label>
        Company or product
        <input
          required
          minLength={2}
          maxLength={100}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Who deserves the dishonor?"
        />
      </label>
      {similar.length > 0 && (
        <aside className="similar">
          <strong>Already on the ballot?</strong>
          {similar.map((n) => (
            <Link key={n.id} href={"/nominees/" + n.id}>
              {n.company}: {n.headline} ↗
            </Link>
          ))}
        </aside>
      )}
      <label>
        Nomination headline
        <input
          name="headline"
          required
          minLength={8}
          maxLength={140}
          placeholder="The update nobody asked for"
        />
      </label>
      <label>
        Award category
        <select name="category" required>
          <option value="">Choose their particular specialty</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        What got worse?
        <textarea
          name="description"
          required
          minLength={30}
          maxLength={4000}
          rows={6}
          placeholder="Explain what changed, what it used to be like, and why it matters. Be specific."
        />
      </label>
      <label>
        Bring the receipts
        <textarea
          name="sources"
          required
          rows={3}
          placeholder="https://example.com/source"
        />
        <small>
          1–3 supporting HTTP/HTTPS links, one per line. News, announcements, or
          documented changes.
        </small>
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="muted">
        Nominations publish immediately. Keep it factual, focus on products and
        companies, and follow our <Link href="/rules">submission rules</Link>.
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button disabled={busy} className="button">
        {busy ? (
          <Loader2 className="spin" size={18} />
        ) : (
          <ArrowUpRight size={18} />
        )}{" "}
        {busy ? "Submitting…" : "Submit nomination"}
      </button>
    </form>
  );
}
export function Report({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="report">
      {sent ? (
        <p role="status">
          <Check size={16} /> Report sent. Thanks for helping keep the ballot
          useful.
        </p>
      ) : !open ? (
        <button className="text-button" onClick={() => setOpen(true)}>
          <Flag size={14} /> Report this nomination
        </button>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await api(`nominees/${id}/report`, {
                reason: new FormData(e.currentTarget).get("reason"),
              });
              setSent(true);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            What should we review?
            <textarea name="reason" required minLength={5} maxLength={1000} />
          </label>
          <button className="button" disabled={busy}>
            Send report
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
