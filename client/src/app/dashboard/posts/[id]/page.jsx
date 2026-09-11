"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || "http://localhost:5000";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const data = await apiFetch(`/posts/${id}`);
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="p-8 text-center">جاري تحميل المنشور...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!post) return <div className="p-8 text-center">المنشور غير موجود</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <span className="font-bold text-gray-800">@{post.username}</span>
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{post.type}</span>
        </div>

        <h1 className="text-2xl font-bold">{post.title}</h1>

        <p className="text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>

        {post.code_snippet && (
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
            {post.code_language && (
              <div className="text-gray-500 text-xs mb-2">{post.code_language}</div>
            )}
            <pre>{post.code_snippet}</pre>
          </div>
        )}

        {post.image && (
          <img
            src={`${UPLOADS_URL}${post.image}`}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded"
          />
        )}

        <div className="flex gap-6 text-sm text-gray-500 border-t pt-4">
          <span>❤️ {post.likes_count} إعجاب</span>
          <span>💬 {post.comments_count} تعليق</span>
          <span>👁️ {post.views} مشاهدة</span>
        </div>
      </div>
    </div>
  );
}