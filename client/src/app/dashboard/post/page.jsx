"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "code",
    code_snippet: "",
    code_language: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("type", formData.type);
      if (formData.code_snippet) data.append("code_snippet", formData.code_snippet);
      if (formData.code_language) data.append("code_language", formData.code_language);
      if (imageFile) data.append("image", imageFile);

      const res = await apiFetch("/posts", {
        method: "POST",
        body: data,
      });

      router.push(`/posts/${res.postId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg shadow bg-white">
        <h1 className="text-2xl font-bold mb-4">إنشاء منشور جديد</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

        <div>
          <label className="block mb-1 font-medium">نوع المنشور</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="code">Code</option>
            <option value="question">Question</option>
            <option value="tutorial">Tutorial</option>
            <option value="project">Project</option>
            <option value="meme">Meme</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">العنوان</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">المحتوى</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={5}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">الكود (اختياري)</label>
          <textarea
            value={formData.code_snippet}
            onChange={(e) => setFormData({ ...formData, code_snippet: e.target.value })}
            rows={3}
            className="w-full border p-2 rounded font-mono text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">لغة البرمجة (اختياري)</label>
          <input
            type="text"
            placeholder="javascript, python, sql..."
            value={formData.code_language}
            onChange={(e) => setFormData({ ...formData, code_language: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">صورة (اختياري)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "جاري النشر..." : "نشر المنشور"}
        </button>
      </form>
    </div>
  );
}