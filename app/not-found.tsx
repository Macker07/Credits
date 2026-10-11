import Link from "next/link";

export default function NotFound() {
  return <main className="error-page"><section className="panel"><span className="eyebrow">404</span><h1>Page not found</h1><p className="muted">Return to your Credits diary.</p><Link className="wide link-button" href="/">Open tracker</Link></section></main>;
}
