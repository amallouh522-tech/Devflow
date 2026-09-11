/** 1284 → "1,284" ، 12900 → "12.9K" */
export function compactNumber(n) {
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString("en-US");
}

/** 95 → "1h ago" */
export function timeAgo(minutes) {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function initials(name = "") {
  return name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "?";
}

// لون ثابت لكل اسم (للصور الرمزية الافتراضية)
const AVATAR_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#06b6d4", "#22c55e", "#a855f7", "#ef4444", "#3b82f6"];
export function colorFor(name = "") {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
