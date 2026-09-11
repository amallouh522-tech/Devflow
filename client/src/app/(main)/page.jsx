import { Suspense } from "react";
import Posts from "@/components/Posts";
import FeedSkeleton from "@/components/FeedSkeleton";

// الصفحة الرئيسية — الهيكل (نافبار/سايدبار/بروفايل) جاي من (main)/layout.jsx
export default function Home() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <Posts />
    </Suspense>
  );
}
