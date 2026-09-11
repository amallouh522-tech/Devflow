"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "@/components.css";
import { navItems, yourStuff, sidebarTags } from "@/data/mockData";
import { clearSession } from "@/lib/auth";
import {
  IconHome,
  IconQuestion,
  IconCode,
  IconBook,
  IconLayers,
  IconSmile,
  IconBookmark,
  IconUsers,
  IconActivity,
  IconGrid,
  IconLogout,
} from "./Icons";

const icons = {
  home: IconHome,
  question: IconQuestion,
  code: IconCode,
  book: IconBook,
  layers: IconLayers,
  smile: IconSmile,
  bookmark: IconBookmark,
  users: IconUsers,
  activity: IconActivity,
  grid: IconGrid,
};

// شريط الصفحة الرئيسية (التصفح + Your stuff + Tags)
export default function Sidebar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [showAllTags, setShowAllTags] = useState(false);
  const tags = showAllTags ? sidebarTags : sidebarTags.slice(0, 6);

  const activeType = params.get("type");
  const activeTag = params.get("tag");

  const isActive = (item) => {
    if (item.type) return pathname === "/" && activeType === item.type;
    if (item.path === "/") return pathname === "/" && !activeType;
    return pathname.startsWith(item.path);
  };

  const logout = () => {
    clearSession();
    router.replace("/sign/login");
  };

  const renderLink = (item) => {
    const Icon = icons[item.icon];
    const active = isActive(item);
    return (
      <Link
        key={item.key}
        href={item.path}
        className={`side-link${active ? " active" : ""}`}
        aria-current={active ? "page" : undefined}
      >
        <Icon width={18} height={18} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <nav className="side-nav" aria-label="Browse">
        {navItems.map(renderLink)}
      </nav>

      <div className="side-section">
        <h4 className="side-title">Your stuff</h4>
        {yourStuff.map(renderLink)}
      </div>

      <div className="side-section">
        <h4 className="side-title">Tags</h4>
        <div className="side-tags">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={`side-tag${activeTag === tag ? " active" : ""}`}
            >
              <span className="tag-dot" />
              {tag}
            </Link>
          ))}
        </div>
        <button type="button" className="side-more" onClick={() => setShowAllTags((v) => !v)}>
          {showAllTags ? "Show less" : "Show more…"}
        </button>
      </div>

      <div className="side-section side-bottom">
        <button type="button" className="side-link danger" onClick={logout}>
          <IconLogout width={18} height={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
