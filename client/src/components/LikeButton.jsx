"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { IconHeart } from "./Icons";
import { useIdSet, STORE_KEYS } from "@/lib/store";
import { compactNumber } from "@/lib/format";

/**
 * زر لايك مع تحديث متفائل (يتغير فوراً وبيرجع إذا فشل الطلب).
 * count    = عدد اللايكات من السيرفر بدون لايك المستخدم الحالي
 * onToggle = async (liked) => {...} — نادِ الـ API هون؛ لو رمى خطأ بيرجع الزر لحالته
 */
export default function LikeButton({ id, count = 0, onToggle, size = "md", storeKey = STORE_KEYS.likes }) {
  const [liked, toggle] = useIdSet(storeKey);
  const isLiked = liked.has(id);
  const [burst, setBurst] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    const next = toggle(id);
    if (next) setBurst(true);
    if (!onToggle) return;

    setBusy(true);
    try {
      await onToggle(next);
    } catch {
      toggle(id, !next);
      toast.error("Couldn't update like. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const total = count + (isLiked ? 1 : 0);
  const iconSize = size === "sm" ? 15 : 17;

  return (
    <button
      type="button"
      className={`like-btn like-${size}${isLiked ? " is-liked" : ""}${burst ? " burst" : ""}`}
      aria-pressed={isLiked}
      aria-label={`${isLiked ? "Unlike" : "Like"} · ${total} likes`}
      onClick={handleClick}
      onAnimationEnd={() => setBurst(false)}
    >
      <span className="like-icon">
        <IconHeart width={iconSize} height={iconSize} fill={isLiked ? "currentColor" : "none"} />
      </span>
      <span className="like-count">{compactNumber(total)}</span>
    </button>
  );
}
