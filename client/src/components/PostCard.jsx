"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Avatar from "./Avatar";
import LikeButton from "./LikeButton";
import {
  IconComment,
  IconShare,
  IconBookmark,
  IconCopy,
  IconCheck,
  IconImage,
  IconAlert,
} from "./Icons";
import { typeLabel } from "@/data/mockData";
import { timeAgo } from "@/lib/format";
import { useIdSet, STORE_KEYS } from "@/lib/store";

export function CodeBlock({ lang, value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <div className="code-block">
      <div className="code-head">
        <span className="code-lang">{lang || "code"}</span>
        <button type="button" className="code-copy" onClick={copy} aria-label="Copy code">
          {copied ? <IconCheck width={14} height={14} /> : <IconCopy width={14} height={14} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="code-body">
        <code>{value}</code>
      </pre>
    </div>
  );
}

export function ErrorBlock({ value }) {
  return (
    <div className="error-block" role="note">
      <span className="error-head">
        <IconAlert width={14} height={14} />
        Error
      </span>
      <pre>{value}</pre>
    </div>
  );
}

function PostImage({ src, title }) {
  if (typeof src === "string") {
    return (
      <div className="post-image has-img">
        <img src={src} alt={title || "Post image"} />
      </div>
    );
  }
  return (
    <div className="post-image" aria-hidden="true">
      <IconImage width={28} height={28} />
    </div>
  );
}

/**
 * بطاقة منشور واحدة.
 * full    = عرض كامل (صفحة المنشور) بدل النص المختصر
 * preview = معاينة داخل صفحة الإضافة: بدون روابط وبدون تفاعل
 */
export default function PostCard({ post, full = false, preview = false }) {
  const [bookmarks, toggleBookmark] = useIdSet(STORE_KEYS.bookmarks);
  const saved = bookmarks.has(post.id);
  const href = `/post/${post.id}`;

  const share = async () => {
    const url = `${window.location.origin}${href}`;
    try {
      if (navigator.share) await navigator.share({ title: post.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* المستخدم سكّر نافذة المشاركة */
    }
  };

  const save = () => {
    const on = toggleBookmark(post.id);
    toast(on ? "Saved to bookmarks" : "Removed from bookmarks", { autoClose: 1800 });
  };

  const Title = preview || full ? "span" : Link;
  const titleProps = preview || full ? {} : { href };

  return (
    <article className={`card post${full ? " is-full" : ""}${preview ? " is-preview" : ""}`}>
      <header className="post-head">
        <Avatar name={post.author.name} src={post.author.avatar} />
        <div className="post-meta">
          <div className="post-author">
            <span className="author-name">{post.author.name}</span>
            {post.author.badge && <span className="badge-top">{post.author.badge}</span>}
          </div>
          <span className="post-time">{preview ? "Just now" : timeAgo(post.minutesAgo)}</span>
        </div>
        <span className={`badge badge-type type-${post.type} post-type`}>{typeLabel(post.type)}</span>
      </header>

      <div className="post-body">
        {full ? (
          <h1 className="post-title">{post.title}</h1>
        ) : (
          <h2 className="post-title">
            <Title {...titleProps} className="post-link">
              {post.title || "Untitled post"}
            </Title>
          </h2>
        )}

        {post.body && <p className="post-text">{post.body}</p>}
        {post.error && <ErrorBlock value={post.error} />}
        {post.code?.value && <CodeBlock lang={post.code.lang} value={post.code.value} />}
        {post.image && <PostImage src={post.image} title={post.title} />}

        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) =>
              preview ? (
                <span key={tag} className="tag">#{tag}</span>
              ) : (
                <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`} className="tag">
                  #{tag}
                </Link>
              )
            )}
          </div>
        )}
      </div>

      <footer className="post-foot" inert={preview || undefined}>
        <LikeButton id={post.id} count={post.likes} />

        {full ? (
          <a href="#comments" className="foot-btn">
            <IconComment width={16} height={16} />
            <span>{post.comments}</span>
          </a>
        ) : (
          <Link href={preview ? "#" : `${href}#comments`} className="foot-btn" aria-label={`${post.comments} comments`}>
            <IconComment width={16} height={16} />
            <span>{post.comments}</span>
          </Link>
        )}

        <button type="button" className="foot-btn" onClick={share}>
          <IconShare width={16} height={16} />
          <span className="foot-label">Share</span>
        </button>

        <button
          type="button"
          className={`foot-btn${saved ? " saved" : ""}`}
          onClick={save}
          aria-pressed={saved}
        >
          <IconBookmark width={16} height={16} fill={saved ? "currentColor" : "none"} />
          <span className="foot-label">{saved ? "Saved" : "Save"}</span>
        </button>

        {post.answered && (
          <span className="badge badge-success post-answered">
            <IconCheck width={13} height={13} />
            Answered
          </span>
        )}
      </footer>
    </article>
  );
}
