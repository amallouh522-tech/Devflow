"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "@/components.css";
import { useUser } from "./AppShell";
import PostCard from "./PostCard";
import Avatar from "./Avatar";
import { composerTypes, posts as mockPosts, typeLabel } from "@/data/mockData";
import { IconCode, IconQuestion, IconBook, IconLayers, IconSmile, IconX, IconSearch } from "./Icons";

const typeIcons = {
  code: IconCode,
  question: IconQuestion,
  book: IconBook,
  layers: IconLayers,
  smile: IconSmile,
};

const tabs = [
  { key: "foryou", label: "For You" },
  { key: "latest", label: "Latest" },
  { key: "popular", label: "Popular" },
];

function Composer() {
  const user = useUser();
  return (
    <section className="card composer" aria-label="Create a post">
      <div className="composer-top">
        <Avatar name={user.name} src={user.avatar} />
        <Link href="/dashboard/post" className="composer-input">
          What&apos;s on your mind, {user.name}?
        </Link>
      </div>
      <div className="composer-types">
        {composerTypes.map((t) => {
          const Icon = typeIcons[t.icon];
          return (
            <Link key={t.key} href={`/dashboard/post?type=${t.key}`} className={`chip type-${t.key}`}>
              <Icon width={15} height={15} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function Posts({ posts = mockPosts }) {
  const params = useSearchParams();
  const type = params.get("type");
  const tag = params.get("tag");
  const q = params.get("q")?.trim() || "";
  const [tab, setTab] = useState("foryou");

  const visible = useMemo(() => {
    const needle = q.toLowerCase();
    const list = posts.filter((p) => {
      if (type && p.type !== type) return false;
      if (tag && !p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      if (needle) {
        const hay = [p.title, p.body, p.author.name, ...(p.tags || [])].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    if (tab === "latest") return [...list].sort((a, b) => a.minutesAgo - b.minutesAgo);
    if (tab === "popular") return [...list].sort((a, b) => b.likes - a.likes);
    return list;
  }, [posts, type, tag, q, tab]);

  const filters = [
    type && { key: "type", label: typeLabel(type) },
    tag && { key: "tag", label: `#${tag}` },
    q && { key: "q", label: `“${q}”` },
  ].filter(Boolean);

  // رابط الصفحة بعد إزالة فلتر واحد
  const without = (key) => {
    const next = new URLSearchParams(params);
    next.delete(key);
    const s = next.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <div className="feed">
      <div className="feed-bar">
        <div className="feed-tabs" role="tablist" aria-label="Sort posts">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filters.length > 0 && (
          <div className="feed-filters">
            {filters.map((f) => (
              <Link key={f.key} href={without(f.key)} className="filter-chip" aria-label={`Remove filter ${f.label}`}>
                {f.label}
                <IconX width={12} height={12} />
              </Link>
            ))}
            {filters.length > 1 && (
              <Link href="/" className="filter-clear">
                Clear all
              </Link>
            )}
          </div>
        )}
      </div>

      {filters.length === 0 && <Composer />}

      {visible.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {visible.length === 0 && (
        <div className="empty">
          <span className="empty-icon">
            <IconSearch width={24} height={24} />
          </span>
          <h3>No posts found</h3>
          <p>Nothing matches these filters yet. Try another tag, or be the first to post about it.</p>
          <div className="empty-actions">
            <Link href="/" className="btn btn-secondary">
              Clear filters
            </Link>
            <Link href="/dashboard/post" className="btn btn-primary">
              Create post
            </Link>
          </div>
        </div>
      )}

      {visible.length > 0 && <p className="feed-end">You&apos;re all caught up ✨</p>}
    </div>
  );
}
