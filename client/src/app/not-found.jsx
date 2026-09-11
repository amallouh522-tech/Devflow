import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="status-page">
      <div className="status-card">
        <span className="status-code">404</span>
        <h1>This page wandered off</h1>
        <p>The link might be broken, or the page may have been removed.</p>
        <pre className="status-snippet">
          <code>
            <span className="tok-k">throw new</span> <span className="tok-f">NotFoundError</span>(
            <span className="tok-s">&quot;page&quot;</span>);
          </code>
        </pre>
        <div className="status-actions">
          <Link href="/" className="btn btn-primary">
            Back to feed
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
