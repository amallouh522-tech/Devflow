"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/components.css";
import { useUser } from "./AppShell";
import Avatar from "./Avatar";
import { clearSession } from "@/lib/auth";
import { activityFeed } from "@/data/dashboardData";
import {
  IconLogo,
  IconSearch,
  IconBell,
  IconPlus,
  IconChevronDown,
  IconGrid,
  IconLayers,
  IconBookmark,
  IconSettings,
  IconLogout,
  IconCheck,
  IconHeart,
  IconComment,
  IconUserPlus,
  IconAward,
  IconPost,
} from "./Icons";

const notifIcons = {
  solution: IconCheck,
  upvote: IconHeart,
  comment: IconComment,
  follow: IconUserPlus,
  badge: IconAward,
  post: IconPost,
};

// يسكّر القائمة لما تضغط برا أو على Escape
function useDismiss(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);
  return ref;
}

export default function Navbar() {
  const user = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const [query, setQuery] = useState("");
  const menuRef = useDismiss(menuOpen, setMenuOpen);
  const notifRef = useDismiss(notifOpen, setNotifOpen);

  const notifications = activityFeed.slice(0, 5);

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  const logout = () => {
    clearSession();
    router.replace("/sign/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <Link href="/" className="nav-brand" aria-label="DevFlow home">
        <span className="brand-mark">
          <IconLogo width={18} height={18} />
        </span>
        <span className="brand-name">DevFlow</span>
      </Link>

      <form className="nav-search" role="search" onSubmit={search}>
        <IconSearch width={16} height={16} className="search-icon" />
        <input
          type="search"
          className="search-input"
          placeholder="Search posts, code, tags…"
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="nav-actions">
        <Link href="/dashboard/post" className="btn btn-primary btn-create">
          <IconPlus width={16} height={16} />
          <span>Create Post</span>
        </Link>

        <div className="popover-wrap" ref={notifRef}>
          <button
            className={`icon-btn${notifOpen ? " open" : ""}`}
            type="button"
            aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((v) => !v)}
          >
            <IconBell width={18} height={18} />
            {unread > 0 && <span className="dot" />}
          </button>

          {notifOpen && (
            <div className="menu notif-menu">
              <div className="menu-title">
                <span>Notifications</span>
                {unread > 0 && (
                  <button type="button" className="link-btn" onClick={() => setUnread(0)}>
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="notif-list">
                {notifications.map((n, i) => {
                  const Icon = notifIcons[n.type] || IconBell;
                  return (
                    <li key={n.id} className={`notif${i < unread ? " unread" : ""}`}>
                      <span className={`notif-icon notif-${n.type}`}>
                        <Icon width={15} height={15} />
                      </span>
                      <div className="notif-body">
                        <p>{n.text}</p>
                        <span>{n.daysAgo === 0 ? "Today" : `${n.daysAgo}d ago`}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link href="/dashboard" className="menu-footer" onClick={() => setNotifOpen(false)}>
                View all activity
              </Link>
            </div>
          )}
        </div>

        <div className="popover-wrap" ref={menuRef}>
          <button
            type="button"
            className={`nav-account${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <span className="account-name">{user.name}</span>
            <IconChevronDown width={14} height={14} className={`caret${menuOpen ? " up" : ""}`} />
          </button>

          {menuOpen && (
            <div className="menu" role="menu">
              <div className="menu-head">
                <Avatar name={user.name} src={user.avatar} />
                <div className="menu-user">
                  <span className="menu-name">{user.name}</span>
                  <span className="menu-handle">{user.handle}</span>
                </div>
              </div>

              <div className="menu-list">
                <Link href="/dashboard" className="menu-item" role="menuitem" onClick={closeMenu}>
                  <IconGrid width={16} height={16} />
                  <span>Dashboard</span>
                </Link>
                <Link href="/dashboard/posts" className="menu-item" role="menuitem" onClick={closeMenu}>
                  <IconLayers width={16} height={16} />
                  <span>My Posts</span>
                </Link>
                <Link href="/bookmarks" className="menu-item" role="menuitem" onClick={closeMenu}>
                  <IconBookmark width={16} height={16} />
                  <span>Bookmarks</span>
                </Link>
                <Link href="/dashboard/settings" className="menu-item" role="menuitem" onClick={closeMenu}>
                  <IconSettings width={16} height={16} />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="menu-sep" />

              <button type="button" className="menu-item danger" role="menuitem" onClick={logout}>
                <IconLogout width={16} height={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
