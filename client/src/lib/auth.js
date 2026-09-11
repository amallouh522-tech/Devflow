// قراءة بيانات المستخدم من الـ JWT بدون مكتبات. التحقق الحقيقي من التوقيع على السيرفر.
export function decodeToken(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

// null إذا ما في توكن أو منتهي
export function getSession() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload;
}

export function clearSession() {
  localStorage.removeItem("token");
}
