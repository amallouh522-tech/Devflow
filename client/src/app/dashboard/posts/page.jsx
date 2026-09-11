"use client";

/*
 * إدارة منشوراتي
 * الحذف: DELETE {API_URL}/api/posts/:id  مع  Authorization: Bearer <token>
 * TODO(api): استبدل dashboardPosts بـ GET /api/posts?author=me
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ConfirmModal";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconHeart,
  IconComment,
  IconEdit,
  IconTrash,
  IconCheck,
  IconPost,
  IconX,
} from "@/components/Icons";
import { dashboardPosts, postCategories } from "@/data/dashboardData";
import { API_URL, authHeaders, readError } from "@/lib/api";
import styles from "./posts.module.css";

const PAGE_SIZE = 8;

const sorts = {
  newest: { label: "Newest", fn: (a, b) => a.daysAgo - b.daysAgo },
  views: { label: "Most viewed", fn: (a, b) => b.views - a.views },
  likes: { label: "Most liked", fn: (a, b) => b.votes - a.votes },
  comments: { label: "Most discussed", fn: (a, b) => b.comments - a.comments },
};

const ago = (d) => (d === 0 ? "Today" : d === 1 ? "Yesterday" : d < 30 ? `${d} days ago` : `${Math.floor(d / 30)} mo ago`);

export default function PostsPage() {
  const [posts, setPosts] = useState(dashboardPosts);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("newest");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [pending, setPending] = useState(null); // المنشور اللي بانتظار تأكيد الحذف
  const [deleting, setDeleting] = useState(false);

  const counts = useMemo(() => {
    const c = { All: posts.length };
    postCategories.forEach((name) => (c[name] = posts.filter((p) => p.category === name).length));
    return c;
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts
      .filter((p) => (type === "All" || p.category === type) && (!needle || p.title.toLowerCase().includes(needle)))
      .sort(sorts[sort].fn);
  }, [posts, query, type, sort]);

  const visible = filtered.slice(0, limit);
  const hasFilters = query || type !== "All";

  const confirmDelete = async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/posts/${pending.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        toast.error(await readError(res, "Couldn't delete the post."));
        return;
      }
      setPosts((list) => list.filter((p) => p.id !== pending.id));
      toast.success("Post deleted");
      setPending(null);
    } catch {
      toast.error("Can't reach the server right now.");
    } finally {
      setDeleting(false);
    }
  };

  const reset = () => {
    setQuery("");
    setType("All");
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">My posts</h1>
          <p className="page-sub">
            {posts.length} published · {posts.reduce((t, p) => t + p.views, 0).toLocaleString("en-US")} total views
          </p>
        </div>
        <Link href="/dashboard/post" className="btn btn-primary">
          <IconPlus width={16} height={16} /> New post
        </Link>
      </div>

      <div className={`card ${styles.toolbar}`}>
        <div className={styles.search}>
          <IconSearch width={16} height={16} />
          <input
            type="search"
            className="input"
            placeholder="Search your posts…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            aria-label="Search your posts"
          />
        </div>

        <label className={styles.sort}>
          <span className="sr-only">Sort by</span>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(sorts).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.types} role="radiogroup" aria-label="Filter by type">
          {["All", ...postCategories].map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={type === name}
              className={`${styles.typePill}${type === name ? ` ${styles.typeActive}` : ""}${
                name !== "All" ? ` type-${name.toLowerCase()}` : ""
              }`}
              onClick={() => {
                setType(name);
                setLimit(PAGE_SIZE);
              }}
            >
              {name !== "All" && <span className={styles.typeDot} />}
              {name}
              <span className={styles.typeCount}>{counts[name]}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          <ul className={styles.list}>
            {visible.map((post) => (
              <li key={post.id} className={`card ${styles.row}`}>
                <div className={styles.main}>
                  <div className={styles.meta}>
                    <span className={`badge badge-type type-${post.category.toLowerCase()}`}>{post.category}</span>
                    <span className={styles.date}>{ago(post.daysAgo)}</span>
                    {post.solved && (
                      <span className="badge badge-success">
                        <IconCheck width={12} height={12} /> Solved
                      </span>
                    )}
                  </div>
                  <h2 className={styles.title}>{post.title}</h2>
                </div>

                <dl className={styles.stats}>
                  <div title="Views">
                    <dt className="sr-only">Views</dt>
                    <dd>
                      <IconEye width={15} height={15} />
                      {post.views.toLocaleString("en-US")}
                    </dd>
                  </div>
                  <div title="Likes">
                    <dt className="sr-only">Likes</dt>
                    <dd>
                      <IconHeart width={15} height={15} />
                      {post.votes}
                    </dd>
                  </div>
                  <div title="Comments">
                    <dt className="sr-only">Comments</dt>
                    <dd>
                      <IconComment width={15} height={15} />
                      {post.comments}
                    </dd>
                  </div>
                </dl>

                <div className={styles.actions}>
                  <Link href={`/dashboard/post?edit=${post.id}`} className="btn btn-secondary btn-sm" aria-label={`Edit ${post.title}`}>
                    <IconEdit width={14} height={14} />
                    <span className={styles.actionLabel}>Edit</span>
                  </Link>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setPending(post)} aria-label={`Delete ${post.title}`}>
                    <IconTrash width={14} height={14} />
                    <span className={styles.actionLabel}>Delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.more}>
            <span>
              Showing {visible.length} of {filtered.length}
            </span>
            {visible.length < filtered.length && (
              <button type="button" className="btn btn-secondary" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                Load more
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="empty">
          <span className="empty-icon">{hasFilters ? <IconSearch width={24} height={24} /> : <IconPost width={24} height={24} />}</span>
          <h3>{hasFilters ? "No posts match your filters" : "You haven't posted yet"}</h3>
          <p>{hasFilters ? "Try a different search or type." : "Share your first snippet, question, or project with the community."}</p>
          {hasFilters ? (
            <button type="button" className="btn btn-secondary" onClick={reset}>
              <IconX width={14} height={14} /> Clear filters
            </button>
          ) : (
            <Link href="/dashboard/post" className="btn btn-primary">
              <IconPlus width={16} height={16} /> Create your first post
            </Link>
          )}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pending)}
        title="Delete this post?"
        message={pending ? `“${pending.title}” and its ${pending.comments} comments will be permanently removed. This can't be undone.` : ""}
        confirmLabel={deleting ? "Deleting…" : "Delete post"}
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => setPending(null)}
      />
    </div>
  );
}
