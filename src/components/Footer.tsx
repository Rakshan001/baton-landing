import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span className="wordmark">
          <span className="baton-glyph" />
          baton
        </span>
        <span className="tagline">Pass it on.</span>
        <nav className="footer-links" aria-label="Footer">
          <a href="#top">GitHub</a>
          <Link href="/docs">Docs</Link>
          <a href="#opensource">License</a>
        </nav>
      </div>
    </footer>
  );
}
