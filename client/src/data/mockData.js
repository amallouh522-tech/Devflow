// بيانات وهمية مؤقتة لحد ما نجهز الـ API على السيرفر
export const currentUser = {
  name: "Anas",
  handle: "@mallouh86",
  role: "Full Stack Developer",
  bio: "Building cool stuff with JavaScript, React, Node.js and more.",
  avatar: "/photo.png",
  stats: { reputation: "2.4k", solutions: 89, projects: 12 },
  skills: ["JavaScript", "React", "Node.js", "MySQL", "PHP", "Git"],
};

// type = قيمة الفلتر في الرابط (/?type=code)
export const navItems = [
  { key: "home", label: "Home", icon: "home", path: "/" },
  { key: "questions", label: "Questions", icon: "question", path: "/?type=question", type: "question" },
  { key: "code", label: "Code", icon: "code", path: "/?type=code", type: "code" },
  { key: "tutorials", label: "Tutorials", icon: "book", path: "/?type=tutorial", type: "tutorial" },
  { key: "projects", label: "Projects", icon: "layers", path: "/?type=project", type: "project" },
  { key: "memes", label: "Memes", icon: "smile", path: "/?type=meme", type: "meme" },
];

export const yourStuff = [
  { key: "bookmarks", label: "Bookmarks", icon: "bookmark", path: "/bookmarks" },
  { key: "following", label: "Following", icon: "users", path: "/following" },
  { key: "dashboard", label: "Dashboard", icon: "grid", path: "/dashboard" },
];

export const sidebarTags = [
  "JavaScript", "React", "Node.js", "Python", "C++", "Godot",
  "MySQL", "CSS", "Docker", "Git", "PHP", "TypeScript",
];

// أنواع المنشورات — key هو القيمة اللي بتنبعت للسيرفر
export const composerTypes = [
  { key: "code", label: "Code", icon: "code", hint: "Share a snippet or a fix" },
  { key: "question", label: "Question", icon: "question", hint: "Ask the community" },
  { key: "tutorial", label: "Tutorial", icon: "book", hint: "Teach something step by step" },
  { key: "project", label: "Project", icon: "layers", hint: "Show what you built" },
  { key: "meme", label: "Meme", icon: "smile", hint: "Keep it fun" },
];

export const posts = [
  {
    id: 1,
    author: { name: "dev_ahmed", badge: "Top 5%" },
    minutesAgo: 120,
    type: "code",
    title: "How to fix CORS error in Express.js",
    body: "I was getting a CORS error when trying to fetch data from my API. The browser blocks requests from a different origin unless the server explicitly allows it. Here's how I solved it:",
    code: {
      lang: "javascript",
      value: `const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));`,
    },
    tags: ["JavaScript", "Node.js", "Express", "CORS"],
    likes: 42,
    comments: 3,
    answered: true,
  },
  {
    id: 2,
    author: { name: "mohammed_dev", badge: "Top 1%" },
    minutesAgo: 300,
    type: "question",
    title: "Why does this code return undefined?",
    body: "I'm trying to get the user data from my API, but it always returns undefined. Can someone see what I'm missing?",
    code: {
      lang: "javascript",
      value: `const getUser = async (id) => {
  fetch("/api/users/" + id)
    .then(res => res.json());
};

console.log(await getUser(1));`,
    },
    error: "undefined",
    tags: ["JavaScript", "API", "Async"],
    likes: 18,
    comments: 2,
    answered: false,
  },
  {
    id: 3,
    author: { name: "hala.codes", badge: "Top 10%" },
    minutesAgo: 480,
    type: "tutorial",
    title: "Build a Simple To-Do App with React (Step by Step)",
    body: "In this tutorial, we'll build a simple to-do app using React and local storage. We'll cover state, effects, and how to persist data between reloads. Perfect for beginners!",
    image: true,
    tags: ["React", "Tutorial", "Beginners"],
    likes: 26,
    comments: 1,
  },
  {
    id: 4,
    author: { name: "sara_js", badge: "Top 8%" },
    minutesAgo: 720,
    type: "question",
    title: "MySQL: ER_NOT_SUPPORTED_AUTH_MODE when connecting from Node",
    body: "Fresh MySQL 8 install, and my Node app refuses to connect. Tried resetting the password twice. Any idea?",
    error: "Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client",
    tags: ["MySQL", "Node.js"],
    likes: 9,
    comments: 2,
    answered: true,
  },
  {
    id: 5,
    author: { name: "code_master", badge: "Top 10%" },
    minutesAgo: 1440,
    type: "meme",
    title: "When the bug fixes itself after a restart",
    body: "Nobody touch anything. We ship it. 🙏",
    image: true,
    tags: ["Memes", "Debugging"],
    likes: 188,
    comments: 1,
  },
  {
    id: 6,
    author: { name: "yousif_dev", badge: "Top 15%" },
    minutesAgo: 2160,
    type: "project",
    title: "I built a markdown notes app with Next.js and SQLite",
    body: "Offline-first, keyboard driven, and it syncs when you're back online. Would love feedback on the editor UX and the folder structure.",
    image: true,
    tags: ["Next.js", "SQLite", "Open Source"],
    likes: 64,
    comments: 0,
  },
  {
    id: 7,
    author: { name: "lina_tech", badge: "Top 20%" },
    minutesAgo: 2880,
    type: "code",
    title: "Hashing passwords with bcrypt the right way",
    body: "Never store plain passwords. Use a salt round of 10–12 and compare with bcrypt.compare — never compare hashes yourself.",
    code: {
      lang: "javascript",
      value: `const hash = await bcrypt.hash(password, 10);
const ok = await bcrypt.compare(input, hash);`,
    },
    tags: ["Node.js", "Security", "bcrypt"],
    likes: 37,
    comments: 0,
  },
  {
    id: 8,
    author: { name: "dev_ahmed", badge: "Top 5%" },
    minutesAgo: 4320,
    type: "tutorial",
    title: "Git rebase explained without the fear",
    body: "Rebase rewrites history — which sounds scary, but on your own feature branch it's the cleanest way to stay up to date with main. Here's the mental model that finally made it click for me.",
    tags: ["Git", "Tutorial"],
    likes: 41,
    comments: 0,
  },
];

export const commentsByPost = {
  1: [
    { id: 11, author: "sara_js", minutesAgo: 90, likes: 8, body: "This saved me hours. Don't forget to set `credentials: true` on the fetch side too!" },
    { id: 12, author: "yousif_dev", minutesAgo: 60, likes: 3, body: "For production, read the allowed origin from an env variable instead of hardcoding localhost." },
    { id: 13, author: "code_master", minutesAgo: 20, likes: 1, body: "Clean. Bookmarked 👌" },
  ],
  2: [
    { id: 21, author: "dev_ahmed", minutesAgo: 240, likes: 14, accepted: true, body: "You're not returning the promise. Add `return` before `fetch`, or `await` it and return the JSON." },
    { id: 22, author: "lina_tech", minutesAgo: 200, likes: 2, body: "Also: top-level await only works inside ES modules." },
  ],
  3: [{ id: 31, author: "mohammed_dev", minutesAgo: 400, likes: 5, body: "Great walkthrough, the localStorage part was exactly what I needed." }],
  4: [
    { id: 41, author: "code_master", minutesAgo: 600, likes: 11, accepted: true, body: "Switch to the `mysql2` package — it supports the caching_sha2_password plugin out of the box." },
    { id: 42, author: "hala.codes", minutesAgo: 540, likes: 2, body: "Same issue last week, mysql2 fixed it for me too." },
  ],
  5: [{ id: 51, author: "sara_js", minutesAgo: 1300, likes: 20, body: "Every. Single. Time." }],
};

export const developers = [
  { name: "dev_ahmed", meta: "1.2k reputation", badge: "Top 5%", role: "Backend Engineer", skills: ["Node.js", "Express"] },
  { name: "sara_js", meta: "980 reputation", badge: "Top 8%", role: "Frontend Developer", skills: ["React", "CSS"] },
  { name: "code_master", meta: "870 reputation", badge: "Top 10%", role: "Full Stack", skills: ["TypeScript", "MySQL"] },
  { name: "yousif_dev", meta: "640 reputation", badge: "Top 15%", role: "Indie Hacker", skills: ["Next.js", "SQLite"] },
  { name: "lina_tech", meta: "520 reputation", badge: "Top 20%", role: "Security Engineer", skills: ["Node.js", "Security"] },
  { name: "hala.codes", meta: "470 reputation", badge: "Top 20%", role: "Educator", skills: ["React", "Teaching"] },
  { name: "mohammed_dev", meta: "1.9k reputation", badge: "Top 1%", role: "Software Architect", skills: ["Go", "Docker"] },
  { name: "omar.py", meta: "310 reputation", badge: "Rising", role: "Data Engineer", skills: ["Python", "SQL"] },
];

export const trendingDevs = developers.slice(0, 5);

export const popularTags = [
  { name: "JavaScript", count: "1.2k" },
  { name: "React", count: "980" },
  { name: "Node.js", count: "760" },
  { name: "Python", count: "540" },
  { name: "CSS", count: "430" },
  { name: "MySQL", count: "310" },
  { name: "Docker", count: "280" },
  { name: "TypeScript", count: "245" },
  { name: "Git", count: "190" },
  { name: "PHP", count: "150" },
];

export const codeLanguages = [
  "javascript", "typescript", "jsx", "python", "php", "sql", "css", "html", "bash", "json", "cpp", "gdscript",
];

export const typeLabel = (key) => composerTypes.find((t) => t.key === key)?.label || key;
