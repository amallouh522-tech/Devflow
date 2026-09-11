"use client";

import Link from "next/link";
import PostCard from "@/components/PostCard";
import { IconBookmark } from "@/components/Icons";
import { posts } from "@/data/mockData";
import { useIdSet, STORE_KEYS } from "@/lib/store";

export default function BookmarksPage() {
  const [bookmarks] = useIdSet(STORE_KEYS.bookmarks);
  const saved = posts.filter((p) => bookmarks.has(p.id));

  return (
    <div className="feed">
      <div className="page-head">
        <div>
          <h1 className="page-title">Bookmarks</h1>
          <p className="page-sub">
            {saved.length ? `${saved.length} saved ${saved.length === 1 ? "post" : "posts"}` : "Posts you save show up here."}
          </p>
        </div>
      </div>

      {saved.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {saved.length === 0 && (
        <div className="empty">
          <span className="empty-icon">
            <IconBookmark width={24} height={24} />
          </span>
          <h3>No bookmarks yet</h3>
          <p>Tap “Save” on any post to keep it here for later.</p>
          <Link href="/" className="btn btn-primary">
            Browse the feed
          </Link>
        </div>
      )}
    </div>
  );
}
