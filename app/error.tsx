"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="error-page"><section className="panel"><span className="eyebrow">CREDITS</span><h1>Something went wrong</h1><p className="muted">Your diary remains stored on this device. Try loading the screen again.</p><button className="wide" onClick={reset}>Try again</button></section></main>;
}
