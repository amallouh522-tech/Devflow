// هيكل تحميل بشكل الداشبورد أثناء التنقل بين صفحاته
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span className="skeleton" style={{ width: 260, height: 26 }} />
      <span className="skeleton" style={{ width: 340, height: 14 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="skeleton" style={{ height: 118, borderRadius: 14 }} />
        ))}
      </div>
      <span className="skeleton" style={{ height: 300, borderRadius: 14 }} />
    </div>
  );
}
