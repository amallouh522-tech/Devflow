"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "@/components.css";
import { clearSession } from "@/lib/auth";
import { IconGrid, IconPost, IconPlus, IconSettings, IconArrowLeft, IconLogout } from "./Icons";

const menuItems = [
  { label: "Overview", path: "/dashboard", Icon: IconGrid },
  { label: "My Posts", path: "/dashboard/posts", Icon: IconPost },
  { label: "New Post", path: "/dashboard/post", Icon: IconPlus },
  { label: "Settings", path: "/dashboard/settings", Icon: IconSettings },
];

// شريط الداشبورد فقط
export default function DashboardsideBar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearSession();
    router.replace("/sign/login");
  };

  return (
    <aside className="sidebar" aria-label="Dashboard">
      <div className="side-section">
        <h4 className="side-title">Dashboard</h4>
        <nav className="side-nav">
          {menuItems.map(({ label, path, Icon }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={`side-link${isActive ? " active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon width={18} height={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="side-section side-bottom">
        <Link href="/" className="side-link">
          <IconArrowLeft width={18} height={18} />
          <span>Back to feed</span>
        </Link>
        <button type="button" className="side-link danger" onClick={logout}>
          <IconLogout width={18} height={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
