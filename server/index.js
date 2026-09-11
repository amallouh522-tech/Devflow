require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;
const { postImage, avatarImage, publicPath, UPLOAD_DIR } = require("./middleware/upload"); // تعديل المسار حسب مجلدك
const { requireAuth, optionalAuth } = require("./middleware/auth");

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

// تقديم الصور المرفوعة كملفات استاتيكية للـ Frontend
app.use("/uploads", express.static(UPLOAD_DIR));

// 1. تسجيل المستخدم
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(422).json({ error: "جميع الحقول مطلوبة" });
    }

    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    mysql.query(sql, [email, username], async (err, result) => {
        if (err) return res.status(500).json({ error: "خطأ في قاعدة البيانات" });
        if (result.length > 0) return res.status(422).json({ error: "اسم المستخدم أو البريد المستعمل موجود مسبقاً" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const UUID = crypto.randomUUID();
        const insertSql = "INSERT INTO users (username, email, password, UUID) VALUES (?, ?, ?, ?)";
        
        mysql.query(insertSql, [username, email, hashedPassword, UUID], (err, result) => {
            if (err) return res.status(500).json({ error: "خطأ في إنشاء الحساب" });
            return res.status(201).json({ message: "تم إنشاء الحساب بنجاح" });
        });
    });
});

// 2. تسجيل الدخول
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(422).json({ error: "اسم المستخدم وكلمة المرور مطلوبان" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    mysql.query(sql, [username], async (err, result) => {
        if (err) return res.status(500).json({ error: "خطأ في قاعدة البيانات" });
        if (result.length === 0) return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });

        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });

        const token = signToken(user);
        return res.status(200).json({
            message: "تم تسجيل الدخول بنجاح",
            token,
            user: { id: user.UUID, username: user.username, email: user.email }
        });
    });
});

// 3. مسار جلب معلومات المستخدم الحالي
app.get("/api/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
});

// 1. جلب جميع المنشورات
app.get("/api/posts", optionalAuth, (req, res) => {
    const sql = `
        SELECT p.*, u.username, u.avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
        FROM posts p
        JOIN users u ON p.user_id = u.ID
        ORDER BY p.created_at DESC
    `;
    mysql.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "خطأ في جلب المنشورات" });
        res.status(200).json({ posts: results });
    });
});

// 2. جلب منشور محدد عبر ID
app.get("/api/posts/:id", optionalAuth, (req, res) => {
    const postId = req.params.id;
    
    // زيادة عدد المشاهدات
    mysql.query("UPDATE posts SET views = views + 1 WHERE id = ?", [postId]);

    const sql = `
        SELECT p.*, u.username, u.avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
        FROM posts p
        JOIN users u ON p.user_id = u.ID
        WHERE p.id = ?
    `;
    mysql.query(sql, [postId], (err, results) => {
        if (err) return res.status(500).json({ error: "خطأ في جلب بيانات المنشور" });
        if (results.length === 0) return res.status(404).json({ error: "المنشور غير موجود" });
        res.status(200).json({ post: results[0] });
    });
});

// 3. إنشاء منشور جديد (مع دعم رفع صورة)
app.post("/api/posts", requireAuth, postImage, (req, res) => {
    const { title, content, type, code_snippet, code_language } = req.body;

    if (!title || !content || !type) {
        return res.status(422).json({ error: "العنوان، المحتوى، ونوع المنشور حقول إجبارية" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
        INSERT INTO posts (user_id, type, title, content, code_snippet, code_language, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    mysql.query(
        sql,
        [req.user.id, type, title, content, code_snippet || null, code_language || null, imagePath],
        (err, result) => {
            if (err) return res.status(500).json({ error: "خطأ في نشر المنشور" });
            res.status(201).json({
                message: "تم نشر المنشور بنجاح",
                postId: result.insertId
            });
        }
    );
});

// Handling Errors
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "حدث خطأ غير متوقع", details: err.details });
});

app.listen(PORT, () => {
    console.log("Server Running on PORT : ", PORT);
});