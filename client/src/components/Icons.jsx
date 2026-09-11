// مجموعة أيقونات SVG بسيطة تستخدمها مكونات الصفحة الرئيسية
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconLogo = (p) => (
  <svg {...base} {...p} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l-5-6 5-6" />
    <path d="M15 6l5 6-5 6" />
  </svg>
);

export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.2-3.2" />
  </svg>
);

export const IconBell = (p) => (
  <svg {...base} {...p}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconChevronDown = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconHome = (p) => (
  <svg {...base} {...p}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

export const IconQuestion = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.2a2.5 2.5 0 014.4 1.6c0 1.7-2 2-2 3.2" />
    <path d="M12 17.2h.01" />
  </svg>
);

export const IconCode = (p) => (
  <svg {...base} {...p}>
    <path d="M8.5 17.5L3 12l5.5-5.5" />
    <path d="M15.5 6.5L21 12l-5.5 5.5" />
  </svg>
);

export const IconBook = (p) => (
  <svg {...base} {...p}>
    <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 20.5z" />
  </svg>
);

export const IconLayers = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5" />
  </svg>
);

export const IconSmile = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 14.5a4.5 4.5 0 007 0" />
    <path d="M9 9.5h.01M15 9.5h.01" />
  </svg>
);

export const IconBookmark = (p) => (
  <svg {...base} {...p}>
    <path d="M6 4h12v17l-6-4-6 4z" />
  </svg>
);

export const IconUsers = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.2 2.7-5 6-5s6 1.8 6 5" />
    <path d="M16 5.2a3.2 3.2 0 010 6.2M17.5 15.4c2.1.6 3.5 2.1 3.5 4.6" />
  </svg>
);

export const IconActivity = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12h4l3 8 4-16 3 8h4" />
  </svg>
);

export const IconUpvote = (p) => (
  <svg {...base} {...p}>
    <path d="M12 6l6 7h-3.5v5h-5v-5H6z" />
  </svg>
);

export const IconDownvote = (p) => (
  <svg {...base} {...p}>
    <path d="M12 18l-6-7h3.5V6h5v5H18z" />
  </svg>
);

export const IconComment = (p) => (
  <svg {...base} {...p}>
    <path d="M21 12a8 8 0 01-8 8H7l-4 3 1.2-4.4A8 8 0 1121 12z" />
  </svg>
);

export const IconShare = (p) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5.5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="18.5" r="2.5" />
    <path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4" />
  </svg>
);

export const IconCopy = (p) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 012-2h9" />
  </svg>
);

export const IconMore = (p) => (
  <svg {...base} {...p}>
    <circle cx="5" cy="12" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <circle cx="19" cy="12" r="1.2" fill="currentColor" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const IconImage = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <circle cx="8.5" cy="10" r="1.6" />
    <path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" />
  </svg>
);

export const IconGithub = (p) => (
  <svg {...base} {...p} strokeWidth="1.5">
    <path d="M9 19c-4 1.3-4-2.2-6-2.7m12 5.2v-3.4c0-1 .1-1.4-.5-2 2.3-.3 4.5-1.2 4.5-5a3.9 3.9 0 00-1.1-2.7 3.6 3.6 0 00-.1-2.7s-.9-.3-3 1.1a10.3 10.3 0 00-5.5 0C7.2 5.4 6.3 5.7 6.3 5.7a3.6 3.6 0 00-.1 2.7A3.9 3.9 0 005 11.1c0 3.8 2.2 4.7 4.5 5-.6.6-.6 1.2-.5 2V21.5" />
  </svg>
);

export const IconTwitter = (p) => (
  <svg {...base} {...p} strokeWidth="1.5">
    <path d="M21 5.5a7.6 7.6 0 01-2.2.6 3.8 3.8 0 001.7-2.1c-.8.5-1.6.8-2.5 1a3.8 3.8 0 00-6.5 3.5A10.8 10.8 0 013.6 4.4a3.8 3.8 0 001.2 5.1c-.6 0-1.2-.2-1.7-.5a3.8 3.8 0 003 3.8c-.5.2-1.1.2-1.7.1a3.8 3.8 0 003.6 2.6A7.7 7.7 0 013 17.1a10.8 10.8 0 005.9 1.7c7 0 10.9-5.9 10.9-11v-.5c.8-.5 1.5-1.2 2.2-1.8z" />
  </svg>
);

export const IconDiscord = (p) => (
  <svg {...base} {...p} strokeWidth="1.5">
    <path d="M8.5 5.5C6 6 4.4 7 4.4 7S2.5 10 2.5 15.5c0 0 1.9 2.2 5 2.5l.9-1.6" />
    <path d="M15.5 5.5c2.5.5 4.1 1.5 4.1 1.5s1.9 3 1.9 8.5c0 0-1.9 2.2-5 2.5l-.9-1.6" />
    <circle cx="9.3" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="14.7" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const IconUser = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c0-3.6 3.2-5.6 7.5-5.6s7.5 2 7.5 5.6" />
  </svg>
);

export const IconSettings = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.7 1.7 0 008.9 19a1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 8.9a1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </svg>
);

export const IconLogout = (p) => (
  <svg {...base} {...p}>
    <path d="M15 17l5-5-5-5" />
    <path d="M20 12H9" />
    <path d="M12 4H6a2 2 0 00-2 2v12a2 2 0 002 2h6" />
  </svg>
);

export const IconGrid = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
  </svg>
);

export const IconEye = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const IconAward = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="M8.2 13.4L7 21l5-2.4L17 21l-1.2-7.6" />
  </svg>
);

export const IconPost = (p) => (
  <svg {...base} {...p}>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </svg>
);

export const IconArrowUp = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5" />
    <path d="M6 11l6-6 6 6" />
  </svg>
);

export const IconArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14" />
    <path d="M6 13l6 6 6-6" />
  </svg>
);

export const IconTable = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 10h18M9 10v10" />
  </svg>
);

export const IconChartArea = (p) => (
  <svg {...base} {...p}>
    <path d="M3 20V4" />
    <path d="M3 20h18" />
    <path d="M6 15l4-5 3.5 3L20 6" />
  </svg>
);

export const IconUserPlus = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.4" />
    <path d="M3 20c0-3.3 2.7-5.2 6-5.2s6 1.9 6 5.2" />
    <path d="M18 8v6M21 11h-6" />
  </svg>
);

export const IconHeart = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.3l-1.3-1.2C5.9 14.8 3 12.2 3 8.9 3 6.3 5 4.3 7.6 4.3c1.7 0 3.3.8 4.4 2 1.1-1.2 2.7-2 4.4-2 2.6 0 4.6 2 4.6 4.6 0 3.3-2.9 5.9-7.7 10.2z" />
  </svg>
);

export const IconX = (p) => (
  <svg {...base} {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const IconTrash = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
    <path d="M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7" />
  </svg>
);

export const IconEdit = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);

export const IconUpload = (p) => (
  <svg {...base} {...p}>
    <path d="M12 16V4" />
    <path d="M7 9l5-5 5 5" />
    <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
  </svg>
);

export const IconAlert = (p) => (
  <svg {...base} {...p}>
    <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

export const IconMenu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const IconSend = (p) => (
  <svg {...base} {...p}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4z" />
  </svg>
);

export const IconLink = (p) => (
  <svg {...base} {...p}>
    <path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" />
  </svg>
);

export const IconSort = (p) => (
  <svg {...base} {...p}>
    <path d="M7 4v16M3 16l4 4 4-4" />
    <path d="M17 20V4M13 8l4-4 4 4" />
  </svg>
);

export const IconLock = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

export const IconMail = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const IconGlobe = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
  </svg>
);

export const IconArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </svg>
);

export const IconSparkle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
  </svg>
);

export const IconBold = (p) => (
  <svg {...base} {...p}>
    <path d="M7 4h6a4 4 0 010 8H7z" />
    <path d="M7 12h7a4 4 0 010 8H7z" />
  </svg>
);

export const IconItalic = (p) => (
  <svg {...base} {...p}>
    <path d="M19 4h-9M14 20H5M15 4L9 20" />
  </svg>
);

export const IconList = (p) => (
  <svg {...base} {...p}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);
