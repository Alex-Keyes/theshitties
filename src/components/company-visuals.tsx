import Link from "next/link";
import {
  Armchair,
  ArrowRight,
  ArrowUpRight,
  Headphones,
  ImageIcon,
  Luggage,
  Play,
  Sparkles,
} from "lucide-react";
import type { Nominee } from "@/lib/constants";
import { companyBrands, visualCase, type VisualCase } from "@/lib/visual-cases";
import { BrandMark } from "./brand-mark";

const icons = {
  music: Headphones,
  video: Play,
  baggage: Luggage,
  seating: Armchair,
  photos: ImageIcon,
};

export function ChangeComparison({ summary }: { summary: VisualCase }) {
  const Icon = icons[summary.kind];
  return (
    <div className={`change-comparison change-${summary.kind}`}>
      <div className="change-context">{summary.context}</div>
      <div className="change-values">
        <div
          className={`change-before ${summary.beforeLabel ? "comparison-alternative" : ""}`}
        >
          <span className="change-label">{summary.beforeLabel ?? "Then"}</span>
          <span className="change-object" aria-hidden="true">
            <Icon strokeWidth={1.3} />
          </span>
          <strong>{summary.before}</strong>
        </div>
        <ArrowRight
          className="change-arrow"
          size={23}
          aria-label="changed to"
        />
        <div className="change-after">
          <span className="change-label">{summary.afterLabel ?? "Now"}</span>
          <span className="change-object" aria-hidden="true">
            {summary.kind === "photos" ? (
              <Sparkles strokeWidth={1.3} />
            ) : (
              <Icon strokeWidth={1.3} />
            )}
            {summary.kind === "seating" && <small>12B</small>}
          </span>
          <strong>{summary.after}</strong>
        </div>
      </div>
    </div>
  );
}

export function CompanyPoster({ nominee }: { nominee: Nominee }) {
  const summary = visualCase(nominee);
  const brand = companyBrands[nominee.company.toLowerCase()];
  return (
    <div className={`company-poster tone-${brand?.tone ?? "gold"}`}>
      <div className="poster-brand">
        <BrandMark company={nominee.company} />
      </div>
      {summary ? (
        <>
          <ChangeComparison summary={summary} />
          <div
            className={`impact-strip ${nominee.outcome === "reversed" ? "impact-reversed" : ""}`}
          >
            <strong>{summary.impact}</strong>
            <span>{summary.impactLabel}</span>
          </div>
        </>
      ) : (
        <div className="poster-generic">
          <span aria-hidden="true">↘</span>
          <strong>It used to be better.</strong>
          <span>{nominee.seasonId} community nomination</span>
        </div>
      )}
    </div>
  );
}

export function FeaturedChanges({ nominees }: { nominees: Nominee[] }) {
  const featured = ["Netflix", "Southwest Airlines", "YouTube"]
    .map((company) =>
      nominees.find((n) => n.company === company && visualCase(n)),
    )
    .filter((n): n is Nominee => Boolean(n));
  if (!featured.length) return null;
  return (
    <div className="featured-changes">
      <div className="featured-label">
        <span className="status-dot" /> EXHIBIT A: THE DOWNGRADES
      </div>
      {featured.map((nominee) => {
        const summary = visualCase(nominee)!;
        return (
          <Link
            className="featured-change"
            href={`/nominees/${nominee.id}`}
            key={nominee.id}
          >
            <BrandMark company={nominee.company} />
            <div>
              <strong>{summary.impact}</strong>
              <span>{summary.impactLabel}</span>
            </div>
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        );
      })}
      <div className="featured-footnote">
        Familiar logos. Fresh disappointments.
      </div>
    </div>
  );
}

export function CompanyStrip({ nominees }: { nominees: Nominee[] }) {
  const unique = [
    ...new Map(nominees.map((n) => [n.company.toLowerCase(), n])).values(),
  ];
  if (!unique.length) return null;
  return (
    <div className="company-strip shell" aria-label="Companies on the ballot">
      <span>
        ON THE
        <br />
        {nominees[0].seasonId} BALLOT
      </span>
      <div>
        {unique.map((n) => (
          <Link
            key={n.company}
            href={`/companies/${encodeURIComponent(n.company)}`}
            aria-label={`${n.company} record`}
          >
            <BrandMark company={n.company} />
          </Link>
        ))}
      </div>
    </div>
  );
}
