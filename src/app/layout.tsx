import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://theshitties.com"),
  title: {
    default: "The Shitties — Honoring the worst upgrades",
    template: "%s | The Shitties",
  },
  description:
    "More ads. Fewer features. Higher prices. The annual community awards for products that got worse.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="header shell">
          <Link className="wordmark" href="/">
            the shitties<span>®*</span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/#nominees">Nominees</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/results">Past dishonors</Link>
          </nav>
          <Link className="button nav-submit" href="/submit">
            Submit a nomination <ArrowUpRight size={16} />
          </Link>
        </header>
        <main id="main">{children}</main>
        <footer className="shell footer">
          <div>
            <Link className="wordmark" href="/">
              the shitties<span>®*</span>
            </Link>
            <p>Because worse deserves recognition.</p>
            <small>
              *Not a registered trademark. Just an inflated sense of importance.
            </small>
          </div>
          <div className="footer-links">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/rules">Submission rules</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/admin">Admin</Link>
          </div>
          <div className="footer-note">
            INDEPENDENT. COMMUNITY-POWERED.
            <br />
            REGRETTABLY NECESSARY.
          </div>
        </footer>
      </body>
    </html>
  );
}
