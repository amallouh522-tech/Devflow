// بيانات الداشبورد — مؤقتة لحد ما نجهز الـ API على السيرفر.
// كل الأرقام مشتقّة من نفس المصدر حتى تتفق مع بعضها مهما تغيّر الفلتر.

export const dashboardRanges = [
  { key: "7d", label: "7 days", days: 7, buckets: 7, bucket: 1 },
  { key: "30d", label: "30 days", days: 30, buckets: 10, bucket: 3 },
  { key: "12w", label: "12 weeks", days: 84, buckets: 12, bucket: 7 },
];

export const postCategories = ["Code", "Question", "Tutorial", "Project", "Meme"];

// daysAgo = كم يوم مضى على المنشور (0 = اليوم)
export const dashboardPosts = [
  { id: 1, title: "How to fix CORS error in Express.js", category: "Code", daysAgo: 0, views: 1840, votes: 42, comments: 12, solved: true },
  { id: 2, title: "Why does this async function return undefined?", category: "Question", daysAgo: 1, views: 960, votes: 18, comments: 7, solved: true },
  { id: 3, title: "Build a To-Do App with React (Step by Step)", category: "Tutorial", daysAgo: 2, views: 2310, votes: 26, comments: 9, solved: false },
  { id: 4, title: "DevFlow — my Next.js + Express side project", category: "Project", daysAgo: 3, views: 740, votes: 31, comments: 5, solved: false },
  { id: 5, title: "When the bug fixes itself after a restart", category: "Meme", daysAgo: 4, views: 3120, votes: 88, comments: 21, solved: false },
  { id: 6, title: "Hashing passwords with bcrypt the right way", category: "Code", daysAgo: 6, views: 1275, votes: 37, comments: 8, solved: true },
  { id: 7, title: "MySQL: JOIN vs subquery — which one is faster?", category: "Question", daysAgo: 9, views: 880, votes: 15, comments: 11, solved: true },
  { id: 8, title: "Understanding JWT auth in 10 minutes", category: "Tutorial", daysAgo: 11, views: 1960, votes: 44, comments: 6, solved: false },
  { id: 9, title: "Debugging a memory leak in Node.js", category: "Code", daysAgo: 13, views: 1130, votes: 29, comments: 14, solved: true },
  { id: 10, title: "My first Godot game — feedback welcome", category: "Project", daysAgo: 16, views: 620, votes: 22, comments: 17, solved: false },
  { id: 11, title: "CSS grid vs flexbox for dashboard layouts", category: "Question", daysAgo: 19, views: 795, votes: 12, comments: 9, solved: false },
  { id: 12, title: "It works on my machine", category: "Meme", daysAgo: 22, views: 2740, votes: 71, comments: 19, solved: false },
  { id: 13, title: "Clean error handling in Express middleware", category: "Code", daysAgo: 25, views: 1420, votes: 33, comments: 7, solved: true },
  { id: 14, title: "Deploy a Next.js app with Docker", category: "Tutorial", daysAgo: 28, views: 1680, votes: 39, comments: 10, solved: false },
  { id: 15, title: "Why is my useEffect running twice?", category: "Question", daysAgo: 33, views: 1240, votes: 21, comments: 13, solved: true },
  { id: 16, title: "Building a REST API with Node and MySQL", category: "Tutorial", daysAgo: 38, views: 2050, votes: 47, comments: 12, solved: false },
  { id: 17, title: "Portfolio site built with plain CSS", category: "Project", daysAgo: 44, views: 690, votes: 18, comments: 4, solved: false },
  { id: 18, title: "Git rebase explained without the fear", category: "Tutorial", daysAgo: 51, views: 1590, votes: 41, comments: 8, solved: false },
  { id: 19, title: "How do I stop React from re-rendering everything?", category: "Question", daysAgo: 58, views: 1080, votes: 19, comments: 15, solved: true },
  { id: 20, title: "Senior dev reviewing my first PR", category: "Meme", daysAgo: 63, views: 2380, votes: 64, comments: 23, solved: false },
  { id: 21, title: "Optimizing SQL queries with indexes", category: "Code", daysAgo: 71, views: 1310, votes: 28, comments: 6, solved: true },
  { id: 22, title: "A tiny CLI tool I use every day", category: "Project", daysAgo: 79, views: 560, votes: 16, comments: 5, solved: false },
  // الفترة السابقة — لازمة حتى تطلع نسبة المقارنة صحيحة لمدى الـ 12 أسبوع
  { id: 23, title: "Setting up ESLint and Prettier together", category: "Code", daysAgo: 88, views: 980, votes: 24, comments: 6, solved: true },
  { id: 24, title: "What is the difference between let and var?", category: "Question", daysAgo: 95, views: 720, votes: 11, comments: 8, solved: true },
  { id: 25, title: "CSS animations from scratch", category: "Tutorial", daysAgo: 103, views: 1340, votes: 30, comments: 7, solved: false },
  { id: 26, title: "Weather app with vanilla JavaScript", category: "Project", daysAgo: 110, views: 510, votes: 14, comments: 3, solved: false },
  { id: 27, title: "Me explaining my code six months later", category: "Meme", daysAgo: 118, views: 1980, votes: 55, comments: 16, solved: false },
  { id: 28, title: "Async/await vs promises — when to use which", category: "Question", daysAgo: 126, views: 860, votes: 17, comments: 10, solved: true },
  { id: 29, title: "Writing your first unit test in Jest", category: "Tutorial", daysAgo: 134, views: 1150, votes: 26, comments: 5, solved: false },
  { id: 30, title: "Fixing N+1 queries in a Node API", category: "Code", daysAgo: 142, views: 1020, votes: 22, comments: 9, solved: true },
  { id: 31, title: "A calculator, but way over-engineered", category: "Project", daysAgo: 151, views: 430, votes: 12, comments: 4, solved: false },
  { id: 32, title: "How do I center a div in 2026?", category: "Question", daysAgo: 160, views: 2240, votes: 61, comments: 27, solved: true },
];

export const activityFeed = [
  { id: 1, type: "solution", text: "Your answer on “How to fix CORS error in Express.js” was accepted", daysAgo: 0, points: 15 },
  { id: 2, type: "upvote", text: "Your post “When the bug fixes itself after a restart” got 12 upvotes", daysAgo: 0, points: 24 },
  { id: 3, type: "follow", text: "sara_js started following you", daysAgo: 1, points: 0 },
  { id: 4, type: "comment", text: "dev_ahmed commented on “Why does this async function return undefined?”", daysAgo: 2, points: 0 },
  { id: 5, type: "post", text: "You published “Build a To-Do App with React (Step by Step)”", daysAgo: 2, points: 5 },
  { id: 6, type: "badge", text: "You earned the “Helpful Hand” badge", daysAgo: 4, points: 50 },
  { id: 7, type: "upvote", text: "Your post “Hashing passwords with bcrypt the right way” got 9 upvotes", daysAgo: 6, points: 18 },
  { id: 8, type: "solution", text: "Your answer on “MySQL: JOIN vs subquery” was accepted", daysAgo: 9, points: 15 },
  { id: 9, type: "post", text: "You published “Understanding JWT auth in 10 minutes”", daysAgo: 11, points: 5 },
  { id: 10, type: "follow", text: "code_master started following you", daysAgo: 12, points: 0 },
  { id: 11, type: "comment", text: "lina_tech commented on “My first Godot game”", daysAgo: 16, points: 0 },
  { id: 12, type: "badge", text: "You earned the “Night Owl” badge", daysAgo: 21, points: 25 },
  { id: 13, type: "upvote", text: "Your post “Git rebase explained without the fear” got 15 upvotes", daysAgo: 51, points: 30 },
  { id: 14, type: "solution", text: "Your answer on “How do I stop React from re-rendering?” was accepted", daysAgo: 58, points: 15 },
];

// الشارة الجاية — رقم تراكمي لكل الأوقات، مش تابع للفلتر
export const nextBadge = {
  name: "Problem Solver",
  description: "Reach 25 accepted solutions",
  current: 18,
  target: 25,
};

// مولّد أرقام شبه-عشوائي ثابت: نفس النتيجة كل مرة، فما يصير اختلاف بالـ hydration
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// نقاط السمعة اليومية لآخر 180 يوم (الفهرس 0 = اليوم)
const repRand = seededRandom(20260910);
export const reputationDaily = Array.from({ length: 180 }, (_, i) => {
  const growth = 1 + (180 - i) / 300; // نمو خفيف كل ما اقتربنا من اليوم
  const weekend = i % 7 === 5 || i % 7 === 6 ? 0.5 : 1; // نشاط أقل بالويكند
  return Math.round((5 + repRand() * 20) * growth * weekend);
});

const sum = (list) => list.reduce((total, n) => total + n, 0);

// null = ما في بيانات للفترة السابقة، فما منعرض نسبة أصلاً بدل ما نكتب +100%
function pctChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

// تقسيم المدة إلى فترات متساوية، الأقدم أولاً
function bucketize(range, valueOf) {
  return Array.from({ length: range.buckets }, (_, b) => {
    const end = (range.buckets - b) * range.bucket;
    const start = end - range.bucket;
    return { start, end, value: valueOf(start, end) };
  });
}

const postsBetween = (from, to) =>
  dashboardPosts.filter((p) => p.daysAgo >= from && p.daysAgo < to);

/** كل أرقام الداشبورد لمدة زمنية وحدة — الفلتر يحكم كل شي تحته */
export function getDashboardData(rangeKey) {
  const range = dashboardRanges.find((r) => r.key === rangeKey) || dashboardRanges[0];
  const { days } = range;

  const current = postsBetween(0, days);
  const previous = postsBetween(days, days * 2);

  const reputation = sum(reputationDaily.slice(0, days));
  const reputationPrev = sum(reputationDaily.slice(days, days * 2));
  const views = sum(current.map((p) => p.views));
  const viewsPrev = sum(previous.map((p) => p.views));
  const solutions = current.filter((p) => p.solved).length;
  const solutionsPrev = previous.filter((p) => p.solved).length;

  const series = bucketize(range, (s, e) => sum(reputationDaily.slice(s, e)));

  const stats = [
    {
      key: "reputation",
      label: "Reputation earned",
      icon: "award",
      value: reputation,
      delta: pctChange(reputation, reputationPrev),
      spark: series.map((b) => b.value),
    },
    {
      key: "posts",
      label: "Posts published",
      icon: "post",
      value: current.length,
      delta: pctChange(current.length, previous.length),
      spark: bucketize(range, (s, e) => postsBetween(s, e).length).map((b) => b.value),
    },
    {
      key: "solutions",
      label: "Accepted solutions",
      icon: "check",
      value: solutions,
      delta: pctChange(solutions, solutionsPrev),
      spark: bucketize(range, (s, e) => postsBetween(s, e).filter((p) => p.solved).length).map((b) => b.value),
    },
    {
      key: "views",
      label: "Post views",
      icon: "eye",
      value: views,
      delta: pctChange(views, viewsPrev),
      spark: bucketize(range, (s, e) => sum(postsBetween(s, e).map((p) => p.views))).map((b) => b.value),
    },
  ];

  const categories = postCategories
    .map((name) => {
      const list = current.filter((p) => p.category === name);
      return { name, count: list.length, views: sum(list.map((p) => p.views)) };
    })
    .sort((a, b) => b.count - a.count || b.views - a.views);

  const topPosts = [...current].sort((a, b) => b.views - a.views).slice(0, 5);

  const activity = activityFeed
    .filter((a) => a.daysAgo < days)
    .sort((a, b) => a.daysAgo - b.daysAgo)
    .slice(0, 6);

  return { range, stats, series, categories, topPosts, activity };
}

/** 1284 → "1,284" و 12900 → "12.9K" */
export function compactNumber(n) {
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString("en-US");
}
