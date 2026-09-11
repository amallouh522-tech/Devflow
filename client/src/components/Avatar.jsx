import { colorFor, initials } from "@/lib/format";

// صورة المستخدم، أو أول حرفين من اسمه بلون ثابت
export default function Avatar({ name, src, size = "md" }) {
  if (src) return <img className={`avatar-${size}`} src={src} alt={name} />;
  return (
    <span className={`avatar-${size} avatar-fallback`} style={{ background: colorFor(name) }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
