"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "@/dashboard.css";
import { useUser } from "@/components/AppShell";
import { AreaChart, CategoryBars, Meter, Sparkline } from "@/components/Charts";
import {
  IconAward,
  IconPost,
  IconCheck,
  IconEye,
  IconArrowUp,
  IconArrowDown,
  IconPlus,
  IconHeart,
  IconComment,
  IconUserPlus,
  IconTable,
  IconChartArea,
} from "@/components/Icons";
import { dashboardRanges, getDashboardData, nextBadge, compactNumber } from "@/data/dashboardData";

const statIcons = { award: IconAward, post: IconPost, check: IconCheck, eye: IconEye };
const activityIcons = {
  solution: IconCheck,
  upvote: IconHeart,
  comment: IconComment,
  follow: IconUserPlus,
  badge: IconAward,
  post: IconPost,
};

// عنوان محور X لكل فترة، محسوب من تاريخ اليوم
function bucketLabels(bucket, rangeKey) {
  const day = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d;
  };
  const short = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const last = day(bucket.start);
  const first = day(bucket.end - 1);
  if (rangeKey === "7d") {
    return { label: last.toLocaleDateString("en-US", { weekday: "short" }), full: short(last) };
  }
  return { label: short(last), full: `${short(first)} – ${short(last)}` };
}

function StatTile({ stat, rangeLabel }) {
  const Icon = statIcons[stat.icon];
  const up = stat.delta !== null && stat.delta >= 0;
  return (
    <div className="card stat-tile">
      <div className="stat-top">
        <span className="stat-icon">
          <Icon width={16} height={16} />
        </span>
        <span className="stat-label">{stat.label}</span>
      </div>
      <div className="stat-row">
        <span className="stat-value">{compactNumber(stat.value)}</span>
        <Sparkline values={stat.spark} label={stat.label} />
      </div>
      {stat.delta === null ? (
        <span className="stat-delta flat">No data for the previous {rangeLabel}</span>
      ) : (
        <span className={`stat-delta ${up ? "up" : "down"}`}>
          {up ? <IconArrowUp width={13} height={13} /> : <IconArrowDown width={13} height={13} />}
          {up ? "+" : "−"}
          {Math.abs(stat.delta).toFixed(1)}%<em>vs previous {rangeLabel}</em>
        </span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const user = useUser();
  const [range, setRange] = useState("30d");
  const [tableView, setTableView] = useState(false);

  const data = useMemo(() => getDashboardData(range), [range]);
  const points = useMemo(
    () => data.series.map((b) => ({ value: b.value, ...bucketLabels(b, range) })),
    [data, range]
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="dash">
      <div className="page-head">
        <div>
          <h1 className="page-title">
            {greeting}, {user.name} 👋
          </h1>
          <p className="page-sub">Here&apos;s how your posts are doing.</p>
        </div>
        <Link href="/dashboard/post" className="btn btn-primary">
          <IconPlus width={16} height={16} /> New post
        </Link>
      </div>

      {/* الفلتر الزمني فوق كل شي بيحكمه */}
      <div className="range-bar" role="radiogroup" aria-label="Time range">
        {dashboardRanges.map((r) => (
          <button
            key={r.key}
            type="button"
            role="radio"
            aria-checked={range === r.key}
            className={`range-btn${range === r.key ? " active" : ""}`}
            onClick={() => setRange(r.key)}
          >
            Last {r.label}
          </button>
        ))}
      </div>

      <section className="kpi-grid" aria-label="Key numbers">
        {data.stats.map((s) => (
          <StatTile key={s.key} stat={s} rangeLabel={data.range.label} />
        ))}
      </section>

      <div className="dash-grid">
        <section className="card chart-card span-2" aria-labelledby="rep-title">
          <div className="chart-head">
            <div>
              <h2 id="rep-title" className="chart-title">Reputation earned</h2>
              <p className="chart-sub">Points per period · last {data.range.label}</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setTableView((v) => !v)}
              aria-pressed={tableView}
            >
              {tableView ? <IconChartArea width={15} height={15} /> : <IconTable width={15} height={15} />}
              {tableView ? "Chart" : "Table"}
            </button>
          </div>

          {tableView ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Period</th>
                    <th scope="col" className="num">Reputation</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((p, i) => (
                    <tr key={i}>
                      <td>{p.full}</td>
                      <td className="num">{p.value.toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AreaChart points={points} unit="points" />
          )}
        </section>

        <section className="card chart-card" aria-labelledby="cat-title">
          <div className="chart-head">
            <div>
              <h2 id="cat-title" className="chart-title">Posts by type</h2>
              <p className="chart-sub">Published in the last {data.range.label}</p>
            </div>
          </div>
          {data.categories.some((c) => c.count > 0) ? (
            <CategoryBars rows={data.categories} />
          ) : (
            <p className="muted-note">No posts in this period.</p>
          )}

          <div className="badge-goal">
            <div className="badge-goal-head">
              <span className="stat-icon gold">
                <IconAward width={16} height={16} />
              </span>
              <div>
                <strong>{nextBadge.name}</strong>
                <span>{nextBadge.description} · all time</span>
              </div>
            </div>
            <Meter current={nextBadge.current} target={nextBadge.target} />
          </div>
        </section>

        <section className="card span-2" aria-labelledby="top-title">
          <div className="chart-head">
            <h2 id="top-title" className="chart-title">Top posts</h2>
            <Link href="/dashboard/posts" className="link-btn">
              Manage posts →
            </Link>
          </div>
          {data.topPosts.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Post</th>
                    <th scope="col" className="num">Views</th>
                    <th scope="col" className="num">Likes</th>
                    <th scope="col" className="num">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPosts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="post-cell">
                          <span className={`badge badge-type type-${p.category.toLowerCase()}`}>{p.category}</span>
                          <span className="post-cell-title">{p.title}</span>
                        </div>
                      </td>
                      <td className="num">{p.views.toLocaleString("en-US")}</td>
                      <td className="num">{p.votes}</td>
                      <td className="num">{p.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted-note">No posts in this period yet.</p>
          )}
        </section>

        <section className="card" aria-labelledby="act-title">
          <div className="chart-head">
            <h2 id="act-title" className="chart-title">Recent activity</h2>
          </div>
          {data.activity.length ? (
            <ul className="activity">
              {data.activity.map((a) => {
                const Icon = activityIcons[a.type];
                return (
                  <li key={a.id} className="activity-item">
                    <span className={`notif-icon notif-${a.type}`}>
                      <Icon width={14} height={14} />
                    </span>
                    <div className="activity-body">
                      <p>{a.text}</p>
                      <span>
                        {a.daysAgo === 0 ? "Today" : a.daysAgo === 1 ? "Yesterday" : `${a.daysAgo} days ago`}
                        {a.points > 0 && <em> · +{a.points} rep</em>}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted-note">Quiet period — no activity yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
