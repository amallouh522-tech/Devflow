"use client";
import { useRef, useState } from "react";
import "@/dashboard.css";

/* ============ أدوات مشتركة ============ */

// تقريب أعلى قيمة لرقم نظيف حتى تطلع خطوط المحور مرتبة
function niceMax(value) {
  if (value <= 0) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

/* ============ خط مصغّر داخل بطاقات الأرقام ============ */
// مؤشر اتجاه فقط: القيم نفسها مكتوبة برقم البطاقة وبالرسم الكبير تحت
export function Sparkline({ values, label }) {
  if (!values || values.length < 2) return null;

  const w = 116;
  const h = 32;
  const pad = 3;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const x = (i) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const y = (v) => h - pad - ((v - min) / span) * (h - pad * 2);

  const path = values
    .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");

  const lastIndex = values.length - 1;
  const tail = `M${x(lastIndex - 1).toFixed(1)},${y(values[lastIndex - 1]).toFixed(1)} L${x(
    lastIndex
  ).toFixed(1)},${y(values[lastIndex]).toFixed(1)}`;

  const rising = values[lastIndex] >= values[0];

  return (
    <svg
      className="spark"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`${label}: trend across ${values.length} periods, ${
        rising ? "rising" : "falling"
      } from ${values[0]} to ${values[lastIndex]}`}
    >
      <path className="spark-line" d={path} vectorEffect="non-scaling-stroke" />
      <path className="spark-tail" d={tail} vectorEffect="non-scaling-stroke" />
      <circle className="spark-dot" cx={x(lastIndex)} cy={y(values[lastIndex])} r="3" />
    </svg>
  );
}

/* ============ الرسم البياني الكبير (سلسلة واحدة) ============ */

const W = 720;
const H = 260;
const PAD = { top: 20, right: 20, bottom: 34, left: 50 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

export function AreaChart({ points, unit = "points" }) {
  const [active, setActive] = useState(null);
  const svgRef = useRef(null);

  const n = points.length;
  const max = niceMax(Math.max(...points.map((p) => p.value), 1));
  const x = (i) => PAD.left + (n === 1 ? PW / 2 : (i / (n - 1)) * PW);
  const y = (v) => PAD.top + PH - (v / max) * PH;
  const baseline = PAD.top + PH;

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(" ");
  const area = `M${x(0).toFixed(1)},${baseline} ${line.slice(1)} L${x(n - 1).toFixed(
    1
  )},${baseline} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const last = points[n - 1];

  // تحويل موقع الماوس لإحداثيات الرسم ثم إيجاد أقرب نقطة
  const pick = (clientX) => {
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    const ratio = (px - PAD.left) / PW;
    const i = Math.round(ratio * (n - 1));
    return Math.min(n - 1, Math.max(0, i));
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = e.key === "ArrowLeft" ? -1 : 1;
    const from = active === null ? n - 1 : active;
    setActive(Math.min(n - 1, Math.max(0, from + step)));
  };

  const point = active === null ? null : points[active];
  const align = active === null ? "center" : active < n * 0.2 ? "start" : active > n * 0.8 ? "end" : "center";

  return (
    <div className="chart-wrap">
      <svg
        ref={svgRef}
        className="chart"
        viewBox={`0 0 ${W} ${H}`}
        tabIndex={0}
        role="img"
        aria-label={`Reputation earned per period, ${n} periods. Use arrow keys to read each value.`}
        onMouseMove={(e) => setActive(pick(e.clientX))}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(n - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--viz-series)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--viz-series)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* الشبكة والمحور — خطوط شعرية خفيفة */}
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={PAD.left} x2={PAD.left + PW} y1={y(t)} y2={y(t)} />
            <text className="tick" x={PAD.left - 10} y={y(t) + 3.5} textAnchor="end">
              {t.toLocaleString("en-US")}
            </text>
          </g>
        ))}

        {points.map((p, i) => (
          <text key={p.label + i} className="tick" x={x(i)} y={baseline + 20} textAnchor="middle">
            {p.label}
          </text>
        ))}

        <path d={area} fill="url(#areaFill)" />
        <path className="series-line" d={line} vectorEffect="non-scaling-stroke" />

        {/* عنوان مباشر على آخر نقطة فقط */}
        {active === null && (
          <text className="end-label" x={x(n - 1)} y={y(last.value) - 12} textAnchor="end">
            {last.value.toLocaleString("en-US")}
          </text>
        )}

        {point && (
          <g>
            <line className="crosshair" x1={x(active)} x2={x(active)} y1={PAD.top} y2={baseline} />
            <circle className="series-dot" cx={x(active)} cy={y(point.value)} r="5" />
          </g>
        )}
      </svg>

      {point && (
        <div
          className={`viz-tip tip-${align}`}
          style={{ left: `${(x(active) / W) * 100}%`, top: `${(y(point.value) / H) * 100}%` }}
        >
          <span className="tip-value">
            {point.value.toLocaleString("en-US")} <em>{unit}</em>
          </span>
          <span className="tip-label">{point.full || point.label}</span>
        </div>
      )}
    </div>
  );
}

/* ============ أعمدة أفقية (تصنيفات بلا ترتيب طبيعي → لون واحد) ============ */

export function CategoryBars({ rows, valueKey = "count", unit = "posts" }) {
  const [active, setActive] = useState(null);
  const max = Math.max(...rows.map((r) => r[valueKey]), 1);

  return (
    <div className="bars">
      {rows.map((row, i) => {
        const value = row[valueKey];
        return (
          <div
            className={`bar-row${active === i ? " is-active" : ""}`}
            key={row.name}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span className="bar-name">{row.name}</span>
            <span className="bar-track">
              <span className="bar-fill" style={{ width: `${(value / max) * 100}%` }} />
            </span>
            <span className="bar-value">{value}</span>

            {active === i && (
              <span className="viz-tip bar-tip">
                <span className="tip-value">
                  {value} <em>{unit}</em>
                </span>
                <span className="tip-label">
                  {row.name} · {row.views.toLocaleString("en-US")} views
                </span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============ مؤشر تقدّم ============ */

export function Meter({ current, target }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="meter">
      <div
        className="meter-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={target}
      >
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="meter-foot">
        <span>
          <strong>{current}</strong> / {target}
        </span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
