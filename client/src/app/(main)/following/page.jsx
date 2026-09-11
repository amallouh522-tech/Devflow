"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import { FollowButton } from "@/components/SideProfile";
import { IconUsers } from "@/components/Icons";
import { developers } from "@/data/mockData";
import { useIdSet, STORE_KEYS } from "@/lib/store";
import styles from "./following.module.css";

export default function FollowingPage() {
  const [follows] = useIdSet(STORE_KEYS.follows);
  const [tab, setTab] = useState("discover");

  const following = developers.filter((d) => follows.has(d.name));
  const list = tab === "following" ? following : developers;

  const tabs = [
    { key: "discover", label: "Discover" },
    { key: "following", label: `Following · ${following.length}` },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">People</h1>
          <p className="page-sub">Follow developers to see more of their posts in your feed.</p>
        </div>
        <div className="feed-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <ul className={styles.grid}>
          {list.map((dev) => (
            <li key={dev.name} className={`card ${styles.person}`}>
              <Avatar name={dev.name} size="lg" />
              <div className={styles.name}>
                {dev.name}
                <span className="badge-top">{dev.badge}</span>
              </div>
              <span className={styles.role}>{dev.role}</span>
              <span className={styles.meta}>{dev.meta}</span>
              <div className={styles.skills}>
                {dev.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
              <FollowButton name={dev.name} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <span className="empty-icon">
            <IconUsers width={24} height={24} />
          </span>
          <h3>You&apos;re not following anyone yet</h3>
          <p>Discover developers and follow people whose posts you enjoy.</p>
          <button type="button" className="btn btn-primary" onClick={() => setTab("discover")}>
            Discover people
          </button>
        </div>
      )}
    </div>
  );
}
