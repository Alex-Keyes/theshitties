"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page narrow empty">
      <h1>Even this page had a setback.</h1>
      <p>We couldn’t load it. Please try again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
