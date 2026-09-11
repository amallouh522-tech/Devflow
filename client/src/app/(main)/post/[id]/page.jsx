"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import PostCard from "@/components/PostCard";
import Avatar from "@/components/Avatar";
import LikeButton from "@/components/LikeButton";
import { useUser } from "@/components/AppShell";
import { IconArrowLeft, IconCheck, IconComment, IconSend, IconSearch } from "@/components/Icons";
import { posts, commentsByPost } from "@/data/mockData";
import { STORE_KEYS } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import styles from "./post.module.css";

const MAX_COMMENT = 1000;

function CommentForm({ onSubmit }) {
  const user = useUser();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const trimmed = text.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!trimmed || trimmed.length > MAX_COMMENT) return;
    setBusy(true);
    try {
      await onSubmit(trimmed);
      setText("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <Avatar name={user.name} src={user.avatar} />
      <div className={styles.formBody}>
        <label htmlFor="comment" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment"
          className={`textarea ${styles.textarea}`}
          placeholder="Add a helpful comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(e);
          }}
          rows={3}
        />
        <div className={styles.formFoot}>
          <span className={`counter${text.length > MAX_COMMENT ? " over" : ""}`}>
            {text.length}/{MAX_COMMENT} · Ctrl+Enter to send
          </span>
          <button type="submit" className="btn btn-primary btn-sm" disabled={!trimmed || busy || text.length > MAX_COMMENT}>
            {busy ? <span className="spinner" /> : <IconSend width={14} height={14} />}
            Comment
          </button>
        </div>
      </div>
    </form>
  );
}

function Comment({ comment }) {
  return (
    <li className={`${styles.comment}${comment.accepted ? ` ${styles.accepted}` : ""}`}>
      <Avatar name={comment.author} size="sm" />
      <div className={styles.commentBody}>
        <div className={styles.commentHead}>
          <span className={styles.commentAuthor}>{comment.author}</span>
          <span className={styles.commentTime}>{timeAgo(comment.minutesAgo)}</span>
          {comment.accepted && (
            <span className="badge badge-success">
              <IconCheck width={12} height={12} /> Accepted answer
            </span>
          )}
        </div>
        <p className={styles.commentText}>{comment.body}</p>
        <LikeButton id={comment.id} count={comment.likes} size="sm" storeKey={STORE_KEYS.commentLikes} />
      </div>
    </li>
  );
}

export default function PostPage() {
  const { id } = useParams();
  const user = useUser();
  const post = posts.find((p) => String(p.id) === String(id));
  const [comments, setComments] = useState(() => commentsByPost[id] || []);

  if (!post) {
    return (
      <div className="empty">
        <span className="empty-icon">
          <IconSearch width={24} height={24} />
        </span>
        <h3>Post not found</h3>
        <p>It may have been deleted, or the link is wrong.</p>
        <Link href="/" className="btn btn-primary">
          Back to feed
        </Link>
      </div>
    );
  }

  // TODO(api): POST /api/posts/:id/comments ثم استبدل الإضافة المحلية برد السيرفر
  const addComment = async (body) => {
    setComments((list) => [...list, { id: `local-${Date.now()}`, author: user.name, minutesAgo: 0, likes: 0, body }]);
    toast.success("Comment posted");
  };

  // الإجابة المقبولة أولاً ثم الأكثر لايكات
  const sorted = [...comments].sort((a, b) => (b.accepted ? 1 : 0) - (a.accepted ? 1 : 0) || b.likes - a.likes);

  return (
    <div className={styles.page}>
      <Link href="/" className="back-link">
        <IconArrowLeft width={15} height={15} /> Back to feed
      </Link>

      <PostCard post={{ ...post, comments: comments.length }} full />

      <section id="comments" className={`card ${styles.comments}`} aria-labelledby="comments-title">
        <h2 id="comments-title" className={styles.title}>
          <IconComment width={18} height={18} />
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h2>

        <CommentForm onSubmit={addComment} />

        {sorted.length > 0 ? (
          <ul className={styles.list}>
            {sorted.map((c) => (
              <Comment key={c.id} comment={c} />
            ))}
          </ul>
        ) : (
          <p className={styles.none}>No comments yet — start the conversation.</p>
        )}
      </section>
    </div>
  );
}
