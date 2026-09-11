"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconBookmark, IconPlus, IconUsers, IconGrid } from "./Icons";

const items = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/bookmarks", label: "Saved", Icon: IconBookmark },
  { href: "/dashboard/post", label: "Create", Icon: IconPlus, primary: true },
  { href: "/following", label: "People", Icon: IconUsers },
  { href: "/dashboard", label: "Dashboard", Icon: IconGrid },
];

// شريط سفلي للموبايل بدل السايدبار
export default function MobileNav() {
  const pathname = usePathname();
  const isActive = (href) =>
    href === "/" || href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="mobile-nav" aria-label="Main">
      {items.map(({ href, label, Icon, primary }) => (
        <Link
          key={href}
          href={href}
          className={`mobile-link${primary ? " primary" : ""}${isActive(href) ? " active" : ""}`}
          aria-current={isActive(href) ? "page" : undefined}
        >
          <span className="mobile-icon">
            <Icon width={20} height={20} />
          </span>
          <span className="mobile-label">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
