"use client";
import { useState } from "react";
import Link from "next/link";
import "@/components.css";
import { useUser } from "./AppShell";
import Avatar from "./Avatar";
import { trendingDevs, popularTags } from "@/data/mockData";
import { useIdSet, STORE_KEYS } from "@/lib/store";
import { IconGithub, IconTwitter, IconDiscord } from "./Icons";

export function FollowButton({ name }) {
  const [follows, toggle] = useIdSet(STORE_KEYS.follows);
  const following = follows.has(name);
  return (
    <button
      type="button"
      className={`btn-follow${following ? " following" : ""}`}
      aria-pressed={following}
      onClick={() => toggle(name)}
    >
      <span className="follow-on">{following ? "Following" : "Follow"}</span>
      {following && <span className="follow-off">Unfollow</span>}
    </button>
  );
}

function DevRow({ dev }) {
  return (
    <div className="dev-row">
      <Avatar name={dev.name} size="sm" />
      <div className="dev-meta">
        <div className="dev-name">
          <span>{dev.name}</span>
          <span className="badge-top">{dev.badge}</span>
        </div>
        <span className="dev-sub">{dev.meta}</span>
      </div>
      <FollowButton name={dev.name} />
    </div>
  );
}

export default function SideProfile() {
  const user = useUser();
  const [showAllTags, setShowAllTags] = useState(false);
  const tags = showAllTags ? popularTags : popularTags.slice(0, 6);

  return (
    <aside className="rightbar" aria-label="Profile and suggestions">
      <section className="card profile-card">
        <div className="profile-banner" />
        <Avatar name={user.name} src={user.avatar} size="lg" />
        <h3 className="profile-name">{user.name}</h3>
        <span className="profile-handle">{user.handle}</span>
        <span className="profile-role">{user.role}</span>
        <p className="profile-bio">{user.bio}</p>

        <div className="profile-stats">
          <div className="stat">
            <strong>{user.stats.reputation}</strong>
            <span>Reputation</span>
          </div>
          <div className="stat">
            <strong>{user.stats.solutions}</strong>
            <span>Solutions</span>
          </div>
          <div className="stat">
            <strong>{user.stats.projects}</strong>
            <span>Projects</span>
          </div>
        </div>

        <div className="profile-skills">
          <h4 className="side-title">Skills</h4>
          <div className="skill-list">
            {user.skills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <Link href="/dashboard/settings" className="btn btn-secondary btn-block profile-cta">
          Edit Profile
        </Link>
      </section>

      <section className="card">
        <div className="card-title-row">
          <h4 className="card-title">Trending developers</h4>
          <Link href="/following" className="link-btn">
            See all
          </Link>
        </div>
        <div className="dev-list">
          {trendingDevs.map((dev) => (
            <DevRow key={dev.name} dev={dev} />
          ))}
        </div>
      </section>

      <section className="card">
        <h4 className="card-title">Popular Tags</h4>
        <div className="tag-grid">
          {tags.map((tag) => (
            <Link key={tag.name} href={`/?tag=${encodeURIComponent(tag.name)}`} className="tag-pill">
              <span>{tag.name}</span>
              <span className="tag-count">{tag.count}</span>
            </Link>
          ))}
        </div>
        <button type="button" className="side-more" onClick={() => setShowAllTags((v) => !v)}>
          {showAllTags ? "Show less" : "View all tags →"}
        </button>
      </section>

      <footer className="rb-footer">
        <span className="rb-brand">DevFlow</span>
        <span className="rb-tagline">Code • Share • Grow</span>
        <div className="rb-social">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <IconGithub width={16} height={16} />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <IconTwitter width={16} height={16} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <IconDiscord width={16} height={16} />
          </a>
        </div>
        <span className="rb-copy">© {new Date().getFullYear()} DevFlow</span>
      </footer>
    </aside>
  );
}
