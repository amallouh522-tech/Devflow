"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || "http://localhost:5000";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiFetch("/posts");
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="p-8 text-center">جاري تحميل المنشورات...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المنشورات</h1>
        <Link
          href="/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          منشور جديد
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">لا توجد منشورات حتى الآن.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-5 shadow-sm bg-white space-y-3">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span className="font-semibold text-gray-700">@{post.username}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{post.type}</span>
            </div>

            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-bold text-blue-600 hover:underline">{post.title}</h2>
            </Link>

            <p className="text-gray-700 line-clamp-3">{post.content}</p>

            {post.image && (
              <img
                src={`${UPLOADS_URL}${post.image}`}
                alt={post.title}
                className="max-h-80 w-full object-cover rounded"
              />
            )}

            <div className="flex gap-4 text-sm text-gray-500 border-t pt-3">
              <span>❤️ {post.likes_count} إعجاب</span>
              <span>💬 {post.comments_count} تعليق</span>
              <span>👁️ {post.views} مشاهدة</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}