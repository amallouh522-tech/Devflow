const jwt = require("jsonwebtoken");
const db = require("../modules/db");
const { HttpError } = require("../lib/validate");

function readToken(req) {
    const header = req.get("authorization") || "";
    return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
}

function signToken(user) {
    return jwt.sign({ id: user.ID, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

// يتأكد من التوكن ومن إن المستخدم لسا موجود، ويحط req.user
async function resolveUser(token) {
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
    // التوكنات القديمة ما كان فيها id (خطأ user.id بدل user.ID)
    if (!payload.id) return null;
    const [[user]] = await db.query("SELECT ID, username FROM users WHERE ID = ?", [payload.id]);
    return user ? { id: user.ID, username: user.username } : null;
}

async function requireAuth(req, res, next) {
    const token = readToken(req);
    if (!token) throw new HttpError(401, "Please log in first.");
    const user = await resolveUser(token);
    if (!user) throw new HttpError(401, "Your session has expired. Please log in again.");
    req.user = user;
    next();
}

// نفس الشي بس بدون إجبار — للصفحات العامة اللي بتتغير لو المستخدم مسجل
async function optionalAuth(req, res, next) {
    const token = readToken(req);
    req.user = token ? await resolveUser(token) : null;
    next();
}

module.exports = { requireAuth, optionalAuth, signToken };
