// هيكل تحميل بنفس شكل بطاقات المنشورات حتى ما تنط الصفحة لما توصل البيانات
export default function FeedSkeleton({ count = 3 }) {
  return (
    <div className="feed" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card post">
          <div className="post-head">
            <span className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            <div className="post-meta" style={{ gap: 6 }}>
              <span className="skeleton" style={{ width: 120, height: 12 }} />
              <span className="skeleton" style={{ width: 70, height: 10 }} />
            </div>
          </div>
          <span className="skeleton" style={{ width: "70%", height: 18 }} />
          <span className="skeleton" style={{ width: "100%", height: 12 }} />
          <span className="skeleton" style={{ width: "85%", height: 12 }} />
          <span className="skeleton" style={{ width: "100%", height: 110, borderRadius: 10 }} />
        </div>
      ))}
    </div>
  );
}
