/*
 * تجهيز قاعدة البيانات — آمن للتشغيل أكثر من مرة (idempotent)
 *   npm run migrate
 *
 * - يصلّح جدول users الموجود بدون ما يضيع بيانات:
 *     UUID من int إلى CHAR(36) + تعبئة القيم الخربانة
 *     latin1 → utf8mb4 (عربي وإيموجي)
 *     أعمدة البروفايل + منع تكرار اسم المستخدم والإيميل
 * - ينشئ باقي الجداول إذا مش موجودة
 */
require("dotenv").config({ quiet: true });

const TABLE_OPTS = "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

const USER_COLUMNS = {
    display_name: "VARCHAR(60) NULL",
    role: "VARCHAR(80) NULL",
    bio: "VARCHAR(160) NULL",
    skills: "VARCHAR(600) NULL",
    website: "VARCHAR(255) NULL",
    github: "VARCHAR(60) NULL",
    avatar: "VARCHAR(255) NULL",
    settings: "VARCHAR(500) NULL",
    notifications_seen_at: "DATETIME NULL",
    created_at: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
};

const TABLES = [
    `CREATE TABLE IF NOT EXISTS posts (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('code','question','tutorial','project','meme') NOT NULL,
        title VARCHAR(150) NOT NULL,
        content TEXT NOT NULL,
        code_snippet TEXT NULL,
        code_language VARCHAR(20) NULL,
        error_code TEXT NULL,
        image VARCHAR(255) NULL,
        views INT UNSIGNED NOT NULL DEFAULT 0,
        answered TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL,
        KEY idx_posts_user (user_id),
        KEY idx_posts_type (type),
        KEY idx_posts_created (created_at),
        CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users (ID) ON DELETE CASCADE
    ) ${TABLE_OPTS}`,

    `CREATE TABLE IF NOT EXISTS tags (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(24) NOT NULL,
        UNIQUE KEY uniq_tag_name (name)
    ) ${TABLE_OPTS}`,

    `CREATE TABLE IF NOT EXISTS post_tags (
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        KEY idx_post_tags_tag (tag_id),
        CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
        CONSTRAINT fk_post_tags_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    ) ${TABLE_OPTS}`,

    `CREATE TABLE IF NOT EXISTS post_likes (
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id),
        KEY idx_post_likes_post (post_id),
        CONSTRAINT fk_post_likes_user FOREIGN KEY (user_id) REFERENCES users (ID) ON DELETE CASCADE,
        CONSTRAINT fk_post_likes_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
    ) ${TABLE_OPTS}`,

    `CREATE TABLE IF NOT EXISTS bookmarks (
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id),
        KEY idx_bookmarks_post (post_id),
        CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users (ID) ON DELETE CASCADE,
        CONSTRAINT fk_bookmarks_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
    ) ${TABLE_OPTS}`,

    `CREATE TABLE IF NOT EXISTS comments (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        body TEXT NOT NULL,
        accepted TINYINT(1) NOT NULL DEFAULT 0,
        accepted_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY idx_comments_post (post_id),
        KEY idx_comments_user (user_id),
        CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (ID) ON DELETE CASCADE
    ) ${TABLE_OPTS}`,

    `CREATE TABLE IF NOT EXISTS comment_likes (
        user_id INT NOT NULL,
        comment_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, comment_id),
        KEY idx_comment_likes_comment (comment_id),
        CONSTRAINT fk_comment_likes_user FOREIGN KEY (user_id) REFERENCES users (ID) ON DELETE CASCADE,
        CONSTRAINT fk_comment_likes_comment FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
    ) ${TABLE_OPTS}`,

    `CREATE TABLE IF NOT EXISTS follows (
        follower_id INT NOT NULL,
        following_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, following_id),
        KEY idx_follows_following (following_id),
        CONSTRAINT chk_follows_self CHECK (follower_id <> following_id),
        CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES users (ID) ON DELETE CASCADE,
        CONSTRAINT fk_follows_following FOREIGN KEY (following_id) REFERENCES users (ID) ON DELETE CASCADE
    ) ${TABLE_OPTS}`,
];

async function migrate(db, log = console.log) {
    const dbName = process.env.DB_NAME;
    const [[{ n: hasUsers }]] = await db.query(
        "SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
        [dbName]
    );

    if (!hasUsers) {
        const extra = Object.entries(USER_COLUMNS)
            .map(([name, def]) => `${name} ${def}`)
            .join(",\n        ");
        await db.query(`CREATE TABLE users (
        ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        UUID CHAR(36) NOT NULL,
        ${extra},
        UNIQUE KEY uniq_username (username),
        UNIQUE KEY uniq_email (email)
    ) ${TABLE_OPTS}`);
        log("created table users");
    } else {
        // 1) latin1 → utf8mb4
        const [[{ c: collation }]] = await db.query(
            "SELECT TABLE_COLLATION AS c FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
            [dbName]
        );
        if (!collation.startsWith("utf8mb4")) {
            await db.query("ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            log(`users: ${collation} → utf8mb4`);
        }

        const [cols] = await db.query(
            "SELECT COLUMN_NAME AS name, DATA_TYPE AS type FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
            [dbName]
        );
        const existing = new Map(cols.map((c) => [c.name.toLowerCase(), c.type]));

        // 2) UUID كان int — القيم المخزنة مقصوصة، فبنحوله لنص ونعطي كل مستخدم UUID صحيح
        if (existing.get("uuid") !== "char") {
            await db.query("ALTER TABLE users MODIFY UUID CHAR(36) NOT NULL");
            log("users.UUID: int → CHAR(36)");
        }
        const [fix] = await db.query("UPDATE users SET UUID = UUID() WHERE CHAR_LENGTH(UUID) <> 36");
        if (fix.affectedRows) log(`users.UUID: regenerated ${fix.affectedRows} broken value(s)`);

        // 3) أعمدة البروفايل
        for (const [name, def] of Object.entries(USER_COLUMNS)) {
            if (!existing.has(name)) {
                await db.query(`ALTER TABLE users ADD COLUMN ${name} ${def}`);
                log(`users: added ${name}`);
            }
        }

        // 4) منع التكرار
        const [idx] = await db.query(
            "SELECT DISTINCT INDEX_NAME AS name FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
            [dbName]
        );
        const indexes = new Set(idx.map((i) => i.name));
        if (!indexes.has("uniq_username")) {
            await db.query("ALTER TABLE users ADD UNIQUE KEY uniq_username (username)");
            log("users: unique username");
        }
        if (!indexes.has("uniq_email")) {
            await db.query("ALTER TABLE users ADD UNIQUE KEY uniq_email (email)");
            log("users: unique email");
        }
    }

    for (const sql of TABLES) {
        const name = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
        const [res] = await db.query(sql);
        if (res.warningStatus === 0) log(`table ${name}: ready`);
    }
}

module.exports = { migrate };

// التشغيل المباشر: node db/migrate.js
if (require.main === module) {
    const pool = require("../modules/db");
    migrate(pool)
        .then(() => {
            console.log("✔ migration complete");
            return pool.end();
        })
        .catch((err) => {
            console.error("✖ migration failed:", err.message);
            process.exit(1);
        });
}
