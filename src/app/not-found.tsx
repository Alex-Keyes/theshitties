import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page narrow empty">
      <div className="eyebrow">404 · A NEW LOW</div>
      <h1>Nothing to see here.</h1>
      <p>This nomination may have been removed, or this page never existed.</p>
      <Link className="button" href="/">
        Back to the awards ↗
      </Link>
    </div>
  );
}
