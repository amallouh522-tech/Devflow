// أدوات التحقق من المدخلات — كل خطأ بيرجع 422 مع رسالة واضحة للمستخدم

class HttpError extends Error {
    constructor(status, message, fields) {
        super(message);
        this.status = status;
        this.fields = fields;
    }
}

const POST_TYPES = ["code", "question", "tutorial", "project", "meme"];
const CODE_LANGUAGES = [
    "javascript", "typescript", "jsx", "python", "php", "sql", "css", "html", "bash", "json", "cpp", "gdscript",
];

const LIMITS = {
    titleMin: 10,
    titleMax: 150,
    contentMin: 20,
    contentMax: 5000,
    codeMax: 5000,
    errorMax: 5000,
    tags: 5,
    tagMax: 24,
    commentMax: 1000,
    bioMax: 160,
    skills: 8,
};

const USERNAME_RE = /^[a-zA-Z0-9_.]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TAG_RE = /^[\p{L}\p{N}][\p{L}\p{N}.+#_ -]*$/u;

const str = (v) => (typeof v === "string" ? v.trim() : "");

// "react, #Node ,react" → ["react","Node"]
function parseTags(raw, max = LIMITS.tags) {
    const list = Array.isArray(raw) ? raw : String(raw || "").split(",");
    const seen = new Set();
    const tags = [];
    for (const item of list) {
        const tag = String(item).trim().replace(/^#+/, "");
        if (!tag) continue;
        if (tag.length > LIMITS.tagMax || !TAG_RE.test(tag)) {
            throw new HttpError(422, `“${tag.slice(0, 30)}” isn't a valid tag.`, { tags: "Tags can use letters, numbers, . + # - _" });
        }
        const key = tag.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        tags.push(tag);
    }
    if (tags.length > max) throw new HttpError(422, `You can add up to ${max} tags.`, { tags: `Max ${max} tags` });
    return tags;
}

function validatePost(body) {
    const fields = {};
    const type = str(body.type).toLowerCase();
    const title = str(body.title);
    const content = str(body.content);
    const codeSnippet = typeof body.codeSnippet === "string" ? body.codeSnippet.replace(/\s+$/, "") : "";
    const codeLanguage = str(body.codeLanguage).toLowerCase();
    const errorCode = typeof body.errorCode === "string" ? body.errorCode.trim() : "";

    if (!POST_TYPES.includes(type)) fields.type = "Choose a post type.";

    if (!title) fields.title = "Give your post a title.";
    else if (title.length < LIMITS.titleMin) fields.title = `Title needs at least ${LIMITS.titleMin} characters.`;
    else if (title.length > LIMITS.titleMax) fields.title = `Keep the title under ${LIMITS.titleMax} characters.`;

    if (!content) fields.content = "Write something for your post.";
    else if (content.length < LIMITS.contentMin) fields.content = `Add a bit more detail (at least ${LIMITS.contentMin} characters).`;
    else if (content.length > LIMITS.contentMax) fields.content = `Content is too long (max ${LIMITS.contentMax}).`;

    if (codeSnippet.length > LIMITS.codeMax) fields.codeSnippet = "Code is too long.";
    if (codeSnippet && codeLanguage && !CODE_LANGUAGES.includes(codeLanguage)) fields.codeLanguage = "Unsupported language.";
    if (errorCode.length > LIMITS.errorMax) fields.errorCode = "Error text is too long.";

    const keys = Object.keys(fields);
    if (keys.length) throw new HttpError(422, fields[keys[0]], fields);

    return {
        type,
        title,
        content,
        codeSnippet: codeSnippet || null,
        codeLanguage: codeSnippet ? codeLanguage || "javascript" : null,
        errorCode: errorCode || null,
        tags: parseTags(body.tags),
    };
}

function validateCredentials({ username, email, password }, { requireEmail = true } = {}) {
    const fields = {};
    const u = str(username);
    const e = str(email).toLowerCase();
    const p = typeof password === "string" ? password : "";

    if (!USERNAME_RE.test(u)) fields.username = "Username must be 3–20 characters: letters, numbers, dots and underscores.";
    if (requireEmail && (!EMAIL_RE.test(e) || e.length > 255)) fields.email = "Enter a valid email address.";
    if (p.length < 8) fields.password = "Password must be at least 8 characters.";
    // bcrypt بيتجاهل أي شي بعد 72 بايت
    else if (Buffer.byteLength(p) > 72) fields.password = "Password is too long (max 72 characters).";

    const keys = Object.keys(fields);
    if (keys.length) throw new HttpError(422, fields[keys[0]], fields);
    return { username: u, email: e, password: p };
}

// رقم موجب من الرابط
function toId(value) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "Not found.");
    return id;
}

module.exports = {
    HttpError,
    POST_TYPES,
    CODE_LANGUAGES,
    LIMITS,
    USERNAME_RE,
    parseTags,
    validatePost,
    validateCredentials,
    toId,
    str,
};
