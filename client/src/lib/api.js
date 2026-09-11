// عنوان السيرفر — في الإنتاج حطه بمتغير البيئة NEXT_PUBLIC_API_URL
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// يطلع رسالة الخطأ من رد السيرفر مهما كان شكله
export async function readError(res, fallback = "Something went wrong. Please try again.") {
  try {
    const data = await res.json();
    return data.error || data.message || fallback;
  } catch {
    return fallback;
  }
}
