"use client";

import { useEffect } from "react";
import Link from "next/link";

// أي خطأ غير متوقع بأي صفحة بيوصل هون بدل ما تطلع شاشة بيضا
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <div className="status-card">
        <span className="status-code error">Oops</span>
        <h1>Something went wrong</h1>
        <p>An unexpected error happened on our side. Try again — if it keeps happening, reload the page.</p>
        {error?.digest && <p className="status-digest">Error ID: {error.digest}</p>}
        <div className="status-actions">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to feed
          </Link>
        </div>
      </div>
    </main>
  );
}
