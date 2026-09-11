const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { HttpError } = require("../lib/validate");

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"));
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const EXT = { "image/png": ".png", "image/jpeg": ".jpg", "image/gif": ".gif", "image/webp": ".webp" };

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    // اسم عشوائي — ما منستخدم اسم الملف الأصلي أبداً
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + EXT[file.mimetype]),
});

function imageUpload(field, maxMb) {
    const upload = multer({
        storage,
        limits: { fileSize: maxMb * 1024 * 1024, files: 1 },
        fileFilter: (req, file, cb) => {
            if (EXT[file.mimetype]) cb(null, true);
            else cb(new HttpError(422, "Only PNG, JPG, GIF or WebP images are allowed.", { [field]: "Unsupported file type" }));
        },
    }).single(field);

    return (req, res, next) =>
        upload(req, res, (err) => {
            if (err?.code === "LIMIT_FILE_SIZE") {
                return next(new HttpError(413, `Image must be ${maxMb} MB or smaller.`, { [field]: `Max ${maxMb} MB` }));
            }
            if (err) return next(err);
            if (req.file && !hasImageSignature(req.file.path)) {
                removeFile(req.file.path);
                return next(new HttpError(422, "That file isn't a valid image.", { [field]: "Invalid image" }));
            }
            next();
        });
}

// نتأكد من محتوى الملف نفسه، مش بس النوع اللي بعته المتصفح
function hasImageSignature(file) {
    const buf = Buffer.alloc(12);
    const fd = fs.openSync(file, "r");
    try {
        fs.readSync(fd, buf, 0, 12, 0);
    } finally {
        fs.closeSync(fd);
    }
    const hex = buf.toString("hex");
    return (
        hex.startsWith("89504e470d0a1a0a") || // PNG
        hex.startsWith("ffd8ff") || // JPEG
        hex.startsWith("474946383") || // GIF
        (hex.startsWith("52494646") && buf.toString("ascii", 8, 12) === "WEBP")
    );
}

function removeFile(p) {
    if (p) fs.promises.unlink(p).catch(() => {});
}

// "/uploads/abc.png" → حذف الملف من القرص
function removeUpload(publicPath) {
    if (!publicPath || !publicPath.startsWith("/uploads/")) return;
    removeFile(path.join(UPLOAD_DIR, path.basename(publicPath)));
}

const publicPath = (file) => (file ? `/uploads/${file.filename}` : null);

module.exports = {
    UPLOAD_DIR,
    postImage: imageUpload("image", 5),
    avatarImage: imageUpload("avatar", 2),
    removeFile,
    removeUpload,
    publicPath,
};
